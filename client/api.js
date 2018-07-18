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

const fetchAuthorized = (method, path) =>
  fetch(`${API_URL}/${path}`, { headers: httpHeaders(), method }).then(res =>
    res.json()
  )

const get = path => fetchAuthorized('GET', path)
const post = path => fetchAuthorized('POST', path)

class API {
  balance() {
    return get('balance').then(result => result.balance)
  }
}

const api = new API()

export default api
