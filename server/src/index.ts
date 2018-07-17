import express from 'express'
import serverless from 'serverless-http'

import authRouter from './routes/auth'
import mobiusRouter from './routes/mobius'
import surveyRouter from './routes/survey'

// import ErrorHandler from './error-handler';

const app = express()

// app.use(express.json()); //{strict: false}
app.use('/auth', authRouter)
app.use('/', mobiusRouter)
app.use('/', surveyRouter)
app.use(express.static('../client/build'))

// app.use(ErrorHandler)

const serverlessApp = serverless(app)

export { serverlessApp as app }
