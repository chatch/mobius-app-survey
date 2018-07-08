const express = require('express')
const expressJwt = require('express-jwt')
const cors = require('cors')
const Mobius = require('@mobius-network/mobius-client-js')
const StellarSdk = require('stellar-sdk')

const dbadapter = require('./dbadapter')
const MobiusAuth = require('./auth')

require('dotenv').config()

const {
  APP_DOMAIN,
  APP_KEY,
  APP_STORE,
  FEE_NEW_SURVEY,
  REWARD_COMPLETE_SURVEY,
} = process.env

const mobius = new Mobius.Client()
const db = new dbadapter()

// Auth middleware - verify JWT token issued under /auth
const authorize = (req, res, next) => {
  expressJwt({
    secret: APP_KEY,
    issuer: `https://${APP_DOMAIN}/`,
    algorithms: ['HS256'],
    getToken,
  })(req, res, next)
}

const corsOptions = (req, callback) => {
  callback(null, {
    origin: req.pubnet ? APP_DOMAIN : true,
  })
}

const app = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use((req, res, next) => {
  mobius.network =
    process.env.NETWORK === 'public'
      ? StellarSdk.Networks.PUBLIC
      : StellarSdk.Networks.TESTNET
  next()
})

app.use('/auth', MobiusAuth)

/**
 * Protected Survey Routes
 */

// New Survey
app.get('/create', authorize, function(req, res, next) {
  const user = req.user.sub
  const name = req.query['name']
  const completions = req.query['completions']

  if (Number.isInteger(Number(completions)) === false || completions < 1) {
    throw new Error(`completions must be a positive integer`)
  }

  db.addSurvey(name, user, completions, async result => {
    const dapp = await Mobius.AppBuilder.build(APP_KEY, user)
    const totalFee = FEE_NEW_SURVEY + completions * REWARD_COMPLETE_SURVEY
    const response = await dapp.charge(totalFee)
    sendJsonResult(res, {
      Name: result.name,
      Id: result.name,
    })
  })
})

// Survey Result - one user is posting answers
app.post('/post', authorize, function(req, res) {
  const postId = req.body.postId
  const surveyResult = req.body.surveyResult
  const user = req.user.sub
  db.postResults(postId, surveyResult, result => {
    Mobius.AppBuilder.build(APP_KEY, user).then(dapp => {
      // payout from DApp balance which collected reward amounts when the survey was created
      dapp.payout(REWARD_COMPLETE_SURVEY, user).then(tx => {
        console.log(`payed ${user} complete survey fee. rsp: ${tx.hash}`)
        sendJsonResult(res, {})
      })
    })
  })
})

app.delete('/delete', authorize, function(req, res) {
  var surveyId = req.query['id']
  console.log(`Delete ${surveyId}`)
  db.deleteSurvey(surveyId, function(result) {
    sendJsonResult(res, {})
  })
})

app.put('/changeName', authorize, function(req, res) {
  var id = req.body['id']
  var name = req.body['name']
  db.changeName(id, name, function(result) {
    sendJsonResult(res, result)
  })
})

app.put('/changeJson', authorize, function(req, res) {
  var id = req.body.Id
  var json = req.body.Json
  db.storeSurvey(id, json, function(result) {
    sendJsonResult(res, result.json)
  })
})

/**
 * Public Survey Routes
 */

app.get('/getActive', function(req, res) {
  db.getSurveys(function(result) {
    sendJsonResult(res, result)
  })
})

app.get('/getSurvey', function(req, res) {
  var surveyId = req.query['surveyId']
  db.getSurvey(surveyId, function(result) {
    sendJsonResult(res, result)
  })
})

app.get('/results', function(req, res) {
  var postId = req.query['postId']
  db.getResults(postId, function(result) {
    sendJsonResult(res, result)
  })
})

/**
 * TEST ROUTES
 */

app.get('/test', authorize, (req, res) => {
  console.log('User: ', req.user.sub)
  res.json({user: req.user})
})

app.get('/balance', authorize, async (req, res, next) => {
  try {
    const dapp = await Mobius.AppBuilder.build(APP_KEY, req.user.sub)
    res.json({balance: dapp.userBalance})
  } catch (e) {
    next(e)
  }
})

app.get('/appBalance', authorize, async (req, res, next) => {
  try {
    const dapp = await Mobius.AppBuilder.build(APP_KEY, req.user.sub)
    res.json({balance: dapp.appBalance})
  } catch (e) {
    next(e)
  }
})

app.use(express.static(__dirname + '/public'))

app.use(logErrors)
app.use(errorHandler)

function sendJsonResult(res, obj) {
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(obj))
}

function getToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1]
  } else if (req.query && req.query.token) {
    return req.query.token
  }
  return null
}

function logErrors(err, req, res, next) {
  console.error(err)
  next(err)
}

function errorHandler(err, req, res, next) {
  res.status(500).json({error: 'Internal server error'})
}

app.listen(process.env.PORT || 3000, function() {
  console.log('Listening!')
})
