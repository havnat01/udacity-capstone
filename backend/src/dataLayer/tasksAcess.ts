import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TaskItem } from '../models/TaskItem'
import { TaskUpdate } from '../models/TaskUpdate'

const logger = createLogger('TasksAccess')

export class TasksAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly tasksTable = process.env.TASKS_TABLE
  ) {}

  async getAllTasks(userId: string): Promise<TaskItem[]> {
    console.log('Getting all Tasks for user ', userId)

    const result = await this.docClient
      .query({
        TableName: this.tasksTable,
        KeyConditionExpression: '#userId =:i',
        ExpressionAttributeNames: {
          '#userId': 'userId'
        },
        ExpressionAttributeValues: {
          ':i': userId
        }
      })
      .promise()

    const items = result.Items
    return items as TaskItem[]
  }

  async searchTasks(userId: string, keyword: string): Promise<TaskItem[]> {
    console.log('Getting all Tasks for user ', userId, ' by keyword ', keyword)

    const result = await this.docClient
      .query({
        TableName: this.tasksTable,
        KeyConditionExpression: '#userId =:i',
        ExpressionAttributeNames: {
          '#userId': 'userId'
        },
        ExpressionAttributeValues: {
          ':i': userId
        }
      })
      .promise()

    let items = result.Items
    items = items.filter((item) => item.name.includes(keyword))
    return items as TaskItem[]
  }

  async createTask(task: TaskItem): Promise<TaskItem> {
    console.log('Creating new TASK item')
    await this.docClient
      .put({
        TableName: this.tasksTable,
        Item: task
      })
      .promise()
    console.log('Created new TASK item')
    return task
  }

  async updateTask(
    task: TaskUpdate,
    userId: string,
    taskId: string
  ): Promise<TaskUpdate> {
    console.log(`Updating TASK ${taskId} for user ${userId}`)
    const params = {
      TableName: this.tasksTable,
      Key: {
        userId: userId,
        taskId: taskId
      },
      ExpressionAttributeNames: {
        '#task_name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': task.name,
        ':dueDate': task.dueDate,
        ':done': task.done
      },
      UpdateExpression:
        'SET #task_name = :name, dueDate = :dueDate, done = :done',
      ReturnValues: 'ALL_NEW'
    }

    const result = await this.docClient.update(params).promise()

    logger.info('Result of update statement', { result: result })

    return result.Attributes as TaskUpdate
  }

  async updateAttachmentUrl(
    userId: string,
    taskId: string,
    attachmentUrl: string
  ) {
    console.log(
      `Updating attachment URL for TASK ${taskId} of user ${userId} with URL ${attachmentUrl}`
    )
    const params = {
      TableName: this.tasksTable,
      Key: {
        userId: userId,
        taskId: taskId
      },
      ExpressionAttributeNames: {
        '#task_attachmentUrl': 'attachmentUrl'
      },
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      },
      UpdateExpression: 'SET #task_attachmentUrl = :attachmentUrl',
      ReturnValues: 'ALL_NEW'
    }

    const result = await this.docClient.update(params).promise()
    logger.info('Result of update statement', { result: result })
  }

  async deleteTask(taskId: string, userId: string) {
    console.log(`Deleting TASK ${taskId} of user ${userId}`)

    await this.docClient
      .delete({
        TableName: this.tasksTable,
        Key: {
          userId: userId,
          taskId: taskId
        }
      })
      .promise()

    logger.info('Deleted TASK successfully')
  }
}

function createDynamoDBClient(): DocumentClient {
  const service = new AWS.DynamoDB()
  const client = new AWS.DynamoDB.DocumentClient({
    service: service
  })
  AWSXRay.captureAWSClient(service)
  return client
}
