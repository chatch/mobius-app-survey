import expressJwt from 'express-jwt'
import StellarSdk from 'stellar-sdk'
import { Client as MobiusClient } from '@mobius-network/mobius-client-js'

require('dotenv').config()

const { APP_DOMAIN, APP_KEY } = process.env

const mobius = new MobiusClient()

/**
 * Get token from the Authorization header or failing that the query string.
 */
const getToken = req => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1]
  }
  else if (req.query && req.query.token) {
    return req.query.token
  }
  return null
}

/**
 * Auth middleware - verify JWT token issued by /auth routes
 */
const authorize = (req, res, next) => {
  expressJwt({
    secret: APP_KEY,
    issuer: `https://${APP_DOMAIN}/`,
    algorithms: ['HS256'],
    getToken
  })(req, res, next)
}

const corsOptions = (req, callback) => {
  callback(null, {
    origin: req.pubnet ? APP_DOMAIN : true
  })
}

const setNetwork = (req, res, next) => {
  mobius.network =
    process.env.NETWORK === 'public'
      ? StellarSdk.Networks.PUBLIC
      : StellarSdk.Networks.TESTNET
  next()
}

export { authorize, corsOptions, setNetwork }
