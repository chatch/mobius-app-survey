/**
 * All service wide errors defined here.
 */

// class ValidationError extends Error {
//   fields: string[]
//   constructor(message, fields: string[] = []) {
//     super(message)
//     this.name = 'ValidationError'
//     this.fields = fields
//   }
// }

class AlreadySubmittedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AlreadySubmittedError'
  }
}

class ForbiddenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ForbiddenError'
  }
}

class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export {AlreadySubmittedError, ForbiddenError, UnauthorizedError}
