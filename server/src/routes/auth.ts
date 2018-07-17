const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const Mobius = require('@mobius-network/mobius-client-js')
import {setNetwork} from '../middleware'

require('dotenv').config()

const {APP_DOMAIN, APP_KEY, APP_STORE} = process.env

const corsOptions = (req, callback) => {
  callback(null, {
    origin: req.pubnet ? APP_STORE : true,
  })
}

const router = express.Router()

router.use(cors(corsOptions))
router.use(express.json())
router.use(setNetwork)

router.get('/', (req, res) => {
  res.send(Mobius.Auth.Challenge.call(APP_KEY))
})

router.post('/', (req, res) => {
  try {
    const token = new Mobius.Auth.Token(
      APP_KEY,
      req.body.xdr || req.query.xdr,
      req.body.public_key || req.query.public_key
    )
    token.validate()

    const payload = {
      sub: token._address,
      jti: token.hash('hex').toString(),
      iss: 'https://' + APP_DOMAIN + '/',
      iat: parseInt(token.timeBounds.minTime, 10),
      exp: parseInt(token.timeBounds.maxTime, 10),
    }

    res.send(jwt.sign(payload, APP_KEY))
  } catch (error) {
    res.status(401).json({error: error.message})
  }
})

export default router