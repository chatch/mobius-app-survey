import express from 'express'
import cors from 'cors'
import {AppBuilder as MobiusAppBuilder} from '@mobius-network/mobius-client-js'

import DBAPI from '../db/db-api'
import {
  AlreadySubmittedError,
  ForbiddenError,
  UnauthorizedError,
} from '../errors'
import {authorize, stellarNetwork} from '../middleware'

require('dotenv').config()
const {APP_KEY, CLIENT_URL} = process.env
const FEE_NEW_SURVEY = Number(process.env.FEE_NEW_SURVEY)
const REWARD_COMPLETE_SURVEY = Number(process.env.REWARD_COMPLETE_SURVEY)

const db = new DBAPI({
  isOffline: Boolean(process.env.IS_OFFLINE), // set by 'sls offline'
  stage: process.env.STAGE, // set by serverless (see in serverless.yml)
})

const corsAllow = cors({origin: CLIENT_URL})

const isOwner = (req, res, next) => {
  const surveyId = req.body && req.body.id ? req.body.id : req.params.surveyId
  db.getSurvey(surveyId).then(({userId: owner}) => {
    if (owner !== req.user.sub)
      next(new ForbiddenError('user does not own this survey'))
    next()
  })
}

const router = express.Router()

router.use(corsAllow)
router.use(express.json())
router.use(stellarNetwork)

/**
 * Protected Survey Routes
 */

// New Survey
router.post(
  '/',
  authorize,
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userId = req.user.sub
    const name = req.body.name
    const json = '{}'

    const completions = Number(req.body.completions)
    if (Number.isInteger(completions) === false || completions < 1) {
      throw new Error(`completions must be a positive integer`)
    }

    db.addSurvey({name, userId, completions, json}).then(async result => {
      const dapp = await MobiusAppBuilder.build(APP_KEY, userId)
      const totalFee = FEE_NEW_SURVEY + completions * REWARD_COMPLETE_SURVEY
      console.log(`totalFee: ${totalFee}`)
      try {
        await dapp.charge(totalFee)
      } catch (err) {
        console.error('charge failed:')
        console.error(err)
        throw err
      }
      res.json(result)
    })
  }
)

router.options('/', corsAllow)
router.put(
  '/',
  authorize,
  isOwner,
  (req: express.Request, res: express.Response) =>
    db.updateSurvey(req.body).then(result => res.json(result))
)

router.options('/:surveyId', corsAllow)
router.delete(
  '/:surveyId',
  authorize,
  isOwner,
  (req: express.Request, res: express.Response) => {
    const surveyId = req.params.surveyId
    console.log(`Delete ${surveyId}`)
    db.deleteSurvey(surveyId).then(result => res.json({}))
  }
)

// Survey Result - one user is posting answers
router.post(
  '/results',
  authorize,
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const {surveyId, surveyResult} = req.body
    const userId = req.user.sub
    // first check the user hasn't already submitted a result
    db.getResults(surveyId)
      .then(result => {
        if (result.some(rec => rec.userId === userId))
          next(
            new AlreadySubmittedError('User has already completed this survey!')
          )
      })
      .then(() =>
        db
          .postResult({surveyId, userId, json: JSON.stringify(surveyResult)})
          .then(async result => {
            // TODO: check result?
            const dapp = await MobiusAppBuilder.build(APP_KEY, userId)
            // payout from DApp balance which collected reward amounts when the survey was created
            const tx = await dapp.payout(REWARD_COMPLETE_SURVEY, userId)
            console.log(`payed ${userId} complete survey fee. tx: ${tx.hash}`)
            res.json({})
          })
      )
  }
)

/**
 * Public Survey Routes
 */

router.get('/', (req: express.Request, res: express.Response) => {
  db.getSurveys().then(result => res.json(result))
})

router.get('/:surveyId', (req: express.Request, res: express.Response) => {
  const surveyId = req.params.surveyId
  db.getSurvey(surveyId).then(result => res.json(result))
})

router.get(
  '/results/:surveyId',
  (req: express.Request, res: express.Response) => {
    const surveyId = req.params.surveyId
    db.getResults(surveyId).then(result => res.json(result))
  }
)

export default router
