import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getAllTasks } from '../../businessLogic/tasks'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const tasks = await getAllTasks(userId)

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
