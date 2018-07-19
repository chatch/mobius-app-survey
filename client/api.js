import fetch from 'node-fetch'
import storage from './storage'

/**
 * This module provides a client to the backend API.
 */

/**
 * Derive the API_URL from the App hostname.
 */
const API_URL = (() => {
  const { hostname: host } = window.location
  if (host === 'localhost' || host === '0.0.0.0') return 'http://localhost:3000'
  else if (host === 'surveyrewards.network') return `https://api-public.${host}`
  return `https://api-${host}`
})()
console.log(`API_URL: ${API_URL}`)

const httpHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${storage.getToken()}`
})

const fetchAuthorized = (method, path, options = {}) =>
  fetch(
    `${API_URL}/${path}`,
    Object.assign(options, { headers: httpHeaders(), method })
  ).then(res => res.json())

const get = path => fetchAuthorized('GET', path)
const post = (path, body) =>
  fetchAuthorized('POST', path, { body: JSON.stringify(body) })

class API {
  balance() {
    return get('mobius/balance').then(result => result.balance)
  }
  surveys() {
    return get('survey')
  }
  survey(id) {
    return get(`survey/${id}`)
  }
  createSurvey(survey) {
    return post('survey', survey)
  }
  updateSurvey(survey) {
    return fetchAuthorized('PUT', `survey`, {
      body: JSON.stringify(survey)
    })
  }
  deleteSurvey(id) {
    return fetchAuthorized('DELETE', `survey/${id}`)
  }
  createResult(result) {
    return post('survey/results', result)
  }
  results(surveyId) {
    return get(`survey/results/${surveyId}`)
  }
}

const api = new API()

export default api
