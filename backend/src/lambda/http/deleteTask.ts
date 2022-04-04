import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTask } from '../../businessLogic/tasks'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const taskId = event.pathParameters.taskId
    const userId = getUserId(event)
    await deleteTask(taskId, userId)
    return {
      statusCode: 204,
      body: ''
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
