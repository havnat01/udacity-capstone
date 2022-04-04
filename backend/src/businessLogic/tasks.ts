import { TasksAccess } from '../dataLayer/tasksAcess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils'
import { TaskItem } from '../models/TaskItem'
import { CreateTaskRequest } from '../requests/CreateTaskRequest'
import { UpdateTaskRequest } from '../requests/UpdateTaskRequest'
import * as uuid from 'uuid'
import { TaskUpdate } from '../models/TaskUpdate'

const tasksAccess = new TasksAccess()
const accessFile = new AttachmentUtils()

export async function createAttachmentPresignedUrl(
  userId: string,
  taskId: string
): Promise<String> {
  const uploadUrl = await accessFile.getUploadUrl(taskId)
  const attachmentUrl = accessFile.getAttachmentUrl(taskId)
  await tasksAccess.updateAttachmentUrl(userId, taskId, attachmentUrl)
  return uploadUrl
}

export async function getAllTasks(userId: string): Promise<TaskItem[]> {
  return tasksAccess.getAllTasks(userId)
}

export async function searchTasks(
  userId: string,
  keyword: string
): Promise<TaskItem[]> {
  return tasksAccess.searchTasks(userId, keyword)
}

export async function createTask(
  createTaskRequest: CreateTaskRequest,
  userId: string
): Promise<TaskItem> {
  const taskId = uuid.v4()
  const timestamp = new Date().toISOString()

  return await tasksAccess.createTask({
    userId: userId,
    taskId: taskId,
    createdAt: timestamp,
    name: createTaskRequest.name,
    dueDate: createTaskRequest.dueDate,
    done: false
  })
}

export async function updateTask(
  taskId: string,
  updateTaskRequest: UpdateTaskRequest,
  userId: string
): Promise<TaskUpdate> {
  return await tasksAccess.updateTask(
    {
      name: updateTaskRequest.name,
      dueDate: updateTaskRequest.dueDate,
      done: updateTaskRequest.done
    },
    taskId,
    userId
  )
}

export async function deleteTask(taskId: string, userId: string) {
  await tasksAccess.deleteTask(taskId, userId)
}
