/**
 * Client side storage using browser LocalStorage.
 *
 * Provides hard getter and setter for each app properties.
 */

const TOKEN_KEY = 'token'
const USER_KEY = 'userid'

class Storage {
  constructor() {
    if (typeof localStorage === 'undefined' || localStorage === null) {
      throw new Error('localStorage not defined. What env are you running in?')
    }
    this.storage = localStorage
  }

  storeToken(token) {
    this.storage.setItem(TOKEN_KEY, token)
  }

  getToken() {
    return this.storage.getItem(TOKEN_KEY)
  }

  storeUser(user) {
    this.storage.setItem(USER_KEY, user)
  }

  getUser() {
    return this.storage.getItem(USER_KEY)
  }
}

const storageInstance = new Storage()

export default storageInstance
