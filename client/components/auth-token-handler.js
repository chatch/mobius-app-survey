import Error, { UNAUTHORIZED } from './error'
import storage from '../storage'

const getUrlVars = () => {
  let vars = [],
    hash
  let hashes = window.location.href
    .slice(window.location.href.indexOf('?') + 1)
    .split('&')
  for (let i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=')
    vars.push(hash[0])
    vars[hash[0]] = hash[1]
  }
  return vars
}

const stripOutToken = url => url.replace(/token=[^=&]*/, '')

/**
 * Check for the JWT token assigned by the Mobius Dapp Store auth flow
 * (auth flow gets a token from our /auth endpoint)
 *
 * @return {boolean} Have valid auth token
 */
const checkToken = () => {
  // check if it's on the URI - should happen only when the DApp store directs
  // user to the app; if it's there store it and init the page
  const jwtToken = getUrlVars().token
  if (jwtToken) {
    storage.storeToken(jwtToken)
    // strip token from the URL bar so it doesn't get copied around etc.
    window.location.replace(stripOutToken(window.location.href))
    return true
  }

  // check if token is in localstorage from a previous page load
  const lsToken = storage.getToken()

  return lsToken && lsToken.length > 0 // TODO: better token check
}

const AuthTokenHandler = ({ children }) =>
  checkToken() ? <div>{children}</div> : <Error error={UNAUTHORIZED} />

export default AuthTokenHandler
