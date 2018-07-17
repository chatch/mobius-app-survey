import express from 'express'
import cors from 'cors'
import {AppBuilder as MobiusAppBuilder} from '@mobius-network/mobius-client-js'

import {authorize, corsOptions, setNetwork} from '../middleware'

require('dotenv').config()

const {APP_KEY} = process.env

declare namespace Express {
  export interface Request {
    user?: any
  }
}

const router = express.Router()

router.use(cors(corsOptions))
router.use(express.json())
router.use(express.urlencoded({extended: true}))
router.use(setNetwork)

/**
 * Test route - logs and returns user record
 */

router.get(
  '/test',
  authorize,
  (req: express.Request, res: express.Response) => {
    console.log('User: ', req.user.sub)
    res.json({user: req.user})
  }
)

/**
 * Fetch the users MOBI balance
 */

router.get(
  '/balance',
  authorize,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const dapp = await MobiusAppBuilder.build(APP_KEY, req.user.sub)
      res.json({balance: dapp.userBalance})
    } catch (e) {
      next(e)
    }
  }
)

/**
 * Fetch the DApp balance
 */

router.get(
  '/appBalance',
  authorize,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const dapp = await MobiusAppBuilder.build(APP_KEY, req.user.sub)
      res.json({balance: dapp.appBalance})
    } catch (e) {
      next(e)
    }
  }
)

export default router
