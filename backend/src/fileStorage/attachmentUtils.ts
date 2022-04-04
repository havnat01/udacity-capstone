import * as AWS from 'aws-sdk'
import { S3 } from 'aws-sdk'
import { createLogger } from '../utils/logger'

const logger = createLogger('AttachmentUtils')

export class AttachmentUtils {
  constructor(
    private readonly s3: S3 = createS3Client(),
    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
  ) {}

  async getUploadUrl(taskId: string): Promise<string> {
    logger.info(
      `Get presigned URL url for TASK ${taskId} with bucket ${this.bucketName}`
    )
    const url = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: taskId,
      Expires: parseInt(this.urlExpiration)
    })
    return url
  }

  getAttachmentUrl(taskId: string): string {
    logger.info(
      `Get attachment URL for TASK ${taskId} on bucket ${this.bucketName}`
    )
    return `https://${this.bucketName}.s3.amazonaws.com/${taskId}`
  }
}

function createS3Client(): S3 {
  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })
  return s3
}
