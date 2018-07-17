import process from 'process'
import has from 'lodash/has'
import DynamoDB from 'aws-sdk/clients/dynamodb'
import {DataMapper} from '@aws/dynamodb-data-mapper'

import Survey from '../model/survey'
import Result from '../model/result'

// import {ValidationError} from '../error/errors'

const OFFLINE_CONFIG = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'dummy',
  secretAccessKey: 'dummy',
}

const assertMandatoryFields = (inputObj, mandatoryFields) => {
  const missingFields = mandatoryFields.filter(
    field => has(inputObj, field) == false
  )
  if (missingFields.length > 0) {
    // throw new ValidationError(`missing mandatory fields`, missingFields)
    throw new Error(`missing mandatory fields: ${missingFields}`)
  }
}

class DBAPI {
  mapper: DataMapper

  constructor({
    isOffline = true,
    stage = 'local',
  }: {
    isOffline: boolean
    stage: string
  }) {
    const config = isOffline ? OFFLINE_CONFIG : {}
    const dynamoDBClient = new DynamoDB(config)

    this.mapper = new DataMapper({
      client: dynamoDBClient, // the SDK client used to execute operations
      tableNamePrefix: `${stage}_`,
    })
  }

  /*************************************
   * Survey Table
   ************************************/

  addSurvey({
    name,
    userId,
    completions,
    json,
  }: {
    name: string
    userId: string
    completions: number
    json: string
  }) {
    return this.mapper.put(
      Object.assign(new Survey(), {name, userId, completions, json})
    )
  }

  changeName(id: string, name: string) {
    console.log('change name: ' + name + ' id: ' + id)
    return this.mapper.update(Object.assign(new Survey(), {id, name}))
  }

  storeSurvey(id: string, json: string) {
    return this.mapper.update(Object.assign(new Survey(), {id, json}))
  }

  async getSurveys() {
    const iterator = this.mapper.scan(Survey)
    const surveys: Survey[] = []
    for await (const record of iterator) {
      surveys.push(record)
    }
    return surveys
  }

  getSurvey(id: string) {
    return this.mapper.get(Object.assign(new Survey(), {id}))
  }

  deleteSurvey(id: string) {
    return this.mapper.delete(Object.assign(new Survey(), {id}))
  }

  /*************************************
   * Result Table
   ************************************/

  postResult({
    surveyId,
    userId,
    json,
  }: {
    surveyId: string
    userId: string
    json: string
  }) {
    return this.mapper.put(
      Object.assign(new Result(), {surveyId, userId, json})
    )
  }

  async getResults(surveyId: string) {
    const iterator = this.mapper.scan(Result)
    const results: Result[] = []
    for await (const record of iterator) {
      if (record.surveyId === surveyId) results.push(record)
    }
    return results
  }
}

export default DBAPI
