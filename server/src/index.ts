import express from 'express'
import serverless from 'serverless-http'

import authRouter from './routes/auth'
import mobiusRouter from './routes/mobius'
import surveyRouter from './routes/survey'
import ErrorHandler from './error-handler'

const app = express()
app.use('/auth', authRouter)
app.use('/mobius', mobiusRouter)
app.use('/survey', surveyRouter)
app.use(ErrorHandler)

const serverlessApp = serverless(app)

export {serverlessApp as app}
