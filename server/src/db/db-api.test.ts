import DynamoDB from 'aws-sdk/clients/dynamodb'
import DBAPI from './db-api'

const STAGE = 'dev'

/*
 * Test records
 */

const SURVEY = {
  name: 'my survey',
  completions: 100,
  userId: 'owner@survey.com',
  json: '{a: 1, b: 2}',
}
const RESULT = {userId: 'bob@survey.com', json: '{answer1: 1, answer2: 2}'}

/*
 * Utilities
 */

const deleteAllItems = () => {
  const deleteAllInTable = (dynamo, table) =>
    dynamo
      .scan({TableName: table})
      .promise()
      .then(result =>
        Promise.all(
          result.Items.map(item =>
            dynamo
              .deleteItem({
                Key: {id: item.id},
                TableName: table,
              })
              .promise()
          )
        )
      )

  const dynamoDB = new DynamoDB({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy',
  })

  return Promise.all([
    deleteAllInTable(dynamoDB, `${STAGE}_surveys`),
    deleteAllInTable(dynamoDB, `${STAGE}_results`),
  ])
}

/*
 * Clear the database before and after each test
 */

beforeEach(deleteAllItems)
afterEach(deleteAllItems)

const db = new DBAPI({isOffline: true, stage: STAGE})

test('survey routines', async () => {
  // addSurvey
  const survey = await db.addSurvey(SURVEY)
  expect(survey.name).toEqual(SURVEY.name)
  expect(survey.userId).toEqual(SURVEY.userId)
  expect(survey.json).toEqual(SURVEY.json)
  expect(survey.completions).toEqual(SURVEY.completions)
  expect(survey.completionsDone).toEqual(0)

  // getSurvey
  expect(await db.getSurvey(survey.id)).toEqual(survey)

  // getSurveys
  const surveys = await db.getSurveys()
  expect(surveys.length).toEqual(1)
  expect(surveys[0]).toEqual(survey)

  // update name
  const newName = 'new name'
  await db.updateSurvey({id: survey.id, name: newName})
  const surveyFreshGet = await db.getSurvey(survey.id)
  expect(surveyFreshGet.name).toEqual(newName)

  // deleteSurvey
  await db.deleteSurvey(survey.id)
  const surveysAfter = await db.getSurveys()
  expect(surveysAfter.length).toEqual(0)
})

test('result routines', async () => {
  const survey = await db.addSurvey(SURVEY)
  const surveyId = survey.id

  const result1 = Object.assign(RESULT, {surveyId})

  const resultRsp = await db.postResult(result1)
  expect(resultRsp.surveyId).toEqual(surveyId)
  expect(resultRsp.json).toEqual(result1.json)
  expect(resultRsp.userId).toEqual(result1.userId)

  const surveyFreshGet = await db.getSurvey(surveyId)
  expect(surveyFreshGet.completions).toEqual(SURVEY.completions)
  expect(surveyFreshGet.completionsDone).toEqual(1)

  const results = await db.getResults(surveyId)
  expect(results.length).toEqual(1)
  expect(results[0]).toEqual(resultRsp)
})
