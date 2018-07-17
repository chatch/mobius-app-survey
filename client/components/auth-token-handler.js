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
 */
const checkToken = () => {
  // check if it's on the URI - should happen only when the DApp store directs
  // user to the app; if it's there store it and init the page
  const jwtToken = getUrlVars().token
  if (jwtToken) {
    storage.storeToken(jwtToken)
    // strip token from the URL so it doesn't get copied around etc.
    window.location.replace(stripOutToken(window.location.href))
  }
  else {
    // check if token is in localstorage from a previous page load
    const lsToken = storage.getToken()
    // no token - show the 401
    if (!lsToken || lsToken.length <= 0) {
      // TODOchange this to a router route ...
      window.location.href = '/401.html'
      return
    }
  }
}

const AuthTokenHandler = ({ children }) => {
  checkToken()
  return <div>{children}</div>
}

export default AuthTokenHandler
