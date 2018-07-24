import express from 'express'

const errorHandler = (
  error: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.error(`type: ${typeof error}`)
  console.error(`message: ${error.message}`)
  console.error(`toString: ${error.toString()}`)
  console.error(JSON.stringify(error, null, 2))

  let status
  let {message} = error

  if (error.name === 'UnauthorizedError') {
    status = 401
  } else if (error.name === 'ForbiddenError') {
    status = 403
  } else if (error.name === 'AlreadySubmittedError') {
    status = 409
  } else {
    status = 500
    message = `Unknown Internal Error: ${error.message}`
  }

  res
    .status(status)
    .type('application/json')
    .send(message ? {error: {message}} : {})
}

export default errorHandler
