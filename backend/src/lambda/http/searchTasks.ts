import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { searchTasks } from '../../businessLogic/tasks'
import { getUserId } from '../utils'
import { SearchTaskRequest } from '../../requests/SearchTaskRequest'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const request: SearchTaskRequest = JSON.parse(event.body)
    const tasks = await searchTasks(userId, request.keyword)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: tasks
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
