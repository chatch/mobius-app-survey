const express = require('express')
const Mobius = require('@mobius-network/mobius-client-js')
const StellarSdk = require('stellar-sdk')

const dbadapter = require('./dbadapter')
const MobiusApi = require('./mobius/api')
const MobiusAuth = require('./mobius/auth')

require('dotenv').config()

function sendJsonResult(res, obj) {
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(obj))
}

const mobius = new Mobius.Client()
const db = new dbadapter()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use((req, res, next) => {
  mobius.network =
    process.env.NETWORK === 'public'
      ? StellarSdk.Networks.PUBLIC
      : StellarSdk.Networks.TESTNET
  next()
})

app.use('/api', MobiusApi)
app.use('/auth', MobiusAuth)

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

app.get('/changeName', function(req, res) {
  var id = req.query['id']
  var name = req.query['name']
  db.changeName(id, name, function(result) {
    sendJsonResult(res, result)
  })
})

app.get('/create', function(req, res) {
  var name = req.query['name']
  db.addSurvey(name, function(result) {
    sendJsonResult(res, {Name: result.name, Id: result.name})
  })
})

app.post('/changeJson', function(req, res) {
  var id = req.body.Id
  var json = req.body.Json
  db.storeSurvey(id, json, function(result) {
    sendJsonResult(res, result.json)
  })
})

app.post('/post', function(req, res) {
  var postId = req.body.postId
  var surveyResult = req.body.surveyResult
  db.postResults(postId, surveyResult, function(result) {
    sendJsonResult(res, result.json)
  })
})

app.get('/delete', function(req, res) {
  var surveyId = req.query['id']
  db.deleteSurvey(surveyId, function(result) {
    sendJsonResult(res, {})
  })
})

app.get('/results', function(req, res) {
  var postId = req.query['postId']
  db.getResults(postId, function(result) {
    sendJsonResult(res, result)
  })
})

app.use(express.static(__dirname + '/public'))

app.listen(process.env.PORT || 3000, function() {
  console.log('Listening!')
})
