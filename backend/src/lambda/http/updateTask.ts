import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTask } from '../../businessLogic/tasks'
import { UpdateTaskRequest } from '../../requests/UpdateTaskRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const taskId = event.pathParameters.taskId
    const updatedTask: UpdateTaskRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    await updateTask(taskId, updatedTask, userId)
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
