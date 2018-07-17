import express from 'express'
import cors from 'cors'
import {AppBuilder as MobiusAppBuilder} from '@mobius-network/mobius-client-js'

import DBAPI from '../db/db-api'
import {authorize, corsOptions, setNetwork} from '../middleware'

require('dotenv').config()

const {APP_KEY} = process.env

const FEE_NEW_SURVEY = Number(process.env.FEE_NEW_SURVEY)
const REWARD_COMPLETE_SURVEY = Number(process.env.REWARD_COMPLETE_SURVEY)

const db = new DBAPI({
  isOffline: Boolean(process.env.IS_OFFLINE), // set by 'sls offline'
  stage: process.env.STAGE, // set by serverless (see in serverless.yml)
})

const router = express.Router()

router.use(cors(corsOptions))
router.use(express.json())
router.use(express.urlencoded({extended: true}))
router.use(setNetwork)

/**
 * Protected Survey Routes
 */

// New Survey
router.get(
  '/create',
  authorize,
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userId = req.user.sub
    const name = req.query.name
    const completions = Number(req.query.completions)
    const json = '{}'

    if (Number.isInteger(completions) === false || completions < 1) {
      throw new Error(`completions must be a positive integer`)
    }

    db.addSurvey({name, userId, completions, json}).then(async result => {
      const dapp = await MobiusAppBuilder.build(APP_KEY, userId)
      const totalFee = FEE_NEW_SURVEY + completions * REWARD_COMPLETE_SURVEY
      console.log(`totalFee: ${totalFee}`)
      const response = await dapp.charge(totalFee)
      res.json({
        Name: result.name,
        Id: result.name,
      })
    })
  }
)

// Survey Result - one user is posting answers
router.post(
  '/post',
  authorize,
  (req: express.Request, res: express.Response) => {
    const surveyId = req.body.surveyId
    const surveyResult = req.body.surveyResult
    const userId = req.user.sub
    db.postResult({surveyId, userId, json: surveyResult}).then(async result => {
      // TODO: check result?
      const dapp = await MobiusAppBuilder.build(APP_KEY, userId)
      // payout from DApp balance which collected reward amounts when the survey was created
      const tx = await dapp.payout(REWARD_COMPLETE_SURVEY, userId)
      console.log(`payed ${userId} complete survey fee. rsp: ${tx.hash}`)
      res.json({})
    })
  }
)

router.delete(
  '/delete',
  authorize,
  (req: express.Request, res: express.Response) => {
    const surveyId = req.query.id
    console.log(`Delete ${surveyId}`)
    db.deleteSurvey(surveyId).then(result => res.json({}))
  }
)

router.put(
  '/changeName',
  authorize,
  (req: express.Request, res: express.Response) => {
    const id = req.body.id
    const name = req.body.name
    db.changeName(id, name).then(result => res.json(result))
  }
)

router.put(
  '/changeJson',
  authorize,
  (req: express.Request, res: express.Response) => {
    const id = req.body.Id
    const json = req.body.Json
    db.storeSurvey(id, json).then(result => res.json(result.json))
  }
)

/**
 * Public Survey Routes
 */

router.get('/getActive', (req: express.Request, res: express.Response) => {
  db.getSurveys().then(result => res.json(result))
})

router.get('/getSurvey', (req: express.Request, res: express.Response) => {
  const surveyId = req.query.surveyId
  db.getSurvey(surveyId).then(result => res.json(result))
})

router.get('/results', (req: express.Request, res: express.Response) => {
  const surveyId = req.query.surveyId
  db.getResults(surveyId).then(result => res.json(result))
})

export default router
