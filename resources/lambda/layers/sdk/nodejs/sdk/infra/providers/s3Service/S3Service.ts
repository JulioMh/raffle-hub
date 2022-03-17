import S3 from 'aws-sdk/clients/s3';
import { ImageContentType } from '../../../domain/types/ImageContentType';

export class S3Service {
  private service: S3;

  constructor(service: any) {
    this.service = service;
  }

  public async putObject(params: S3.PutObjectRequest): Promise<S3.Types.PutObjectOutput> {
    return this.service.putObject(params).promise();
  }

  public async deleteObject(params: S3.DeleteObjectRequest): Promise<S3.Types.DeleteObjectOutput> {
    return this.service.deleteObject(params).promise();
  }

  public async getObject(params: S3.GetObjectRequest): Promise<S3.Types.GetObjectOutput> {
    return this.service.getObject(params).promise();
  }

  public async uploadImage({
    filename,
    bucketName,
    contentType,
    data,
    bucketFolders,
  }: {
    filename: string;
    bucketName: string;
    contentType: ImageContentType;
    data: Buffer;
    bucketFolders?: string;
  }): Promise<S3.Types.PutObjectOutput> {
    return this.service
      .putObject({
        Bucket: bucketName,
        Key: bucketFolders ? `${bucketFolders}/${filename}` : filename,
        Body: data,
        ContentType: contentType,
      })
      .promise();
  }

  public async uploadJsonFile({
    jsonObject,
    filename,
    bucketName,
    bucketFolders,
  }: {
    jsonObject: any;
    filename: string;
    bucketName: string;
    bucketFolders?: string;
  }): Promise<S3.Types.PutObjectOutput> {
    const params: S3.PutObjectRequest = {
      Body: JSON.stringify(jsonObject),
      Bucket: bucketName,
      Key: bucketFolders ? `${bucketFolders}/${filename}` : filename,
      ContentType: 'application/json',
    };

    return this.service.putObject(params).promise();
  }

  async getFileByKey(fileKey: string, bucketName: string): Promise<string | null> {
    const params: S3.GetObjectRequest = {
      Key: fileKey,
      Bucket: bucketName,
    };
    const getRes = await this.service.getObject(params).promise();
    if (!getRes.Body) return null;
    return getRes.Body.toString('utf-8');
  }

  async getFile({
    filename,
    bucketName,
    bucketFolders,
  }: {
    filename: string;
    bucketName: string;
    bucketFolders?: string;
  }): Promise<string | null> {
    const fileKey = bucketFolders ? `${bucketFolders}/${filename}` : filename;
    return this.getFileByKey(fileKey, bucketName);
  }
}
