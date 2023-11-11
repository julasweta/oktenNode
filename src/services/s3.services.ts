import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import { UploadedFile } from "express-fileupload";
import * as path from "path";

import { configs } from "../configs/config";
import { EFileTypes } from "../types/file.type";

class S3Service {
  constructor(
    //створюємо S3Client для відправлення даних на AWS
    private s3Client = new S3Client({
      region: configs.AWS_S3_REGION,
      credentials: {
        accessKeyId: configs.AWS_S3_ACCESS_KEY,
        secretAccessKey: configs.AWS_S3_SECRET_KEY,
      },
    }),
  ) {}

  //формуємо назву файлу з допомогою crypto який рандомно генерує стрічку
  public buildPath(
    fileName: string,
    fileType: EFileTypes,
    fileId: string,
  ): string {
    return `${fileType}/${fileId}/avatar/${crypto.randomUUID()}${path.extname(
      fileName,
    )}`;
  }
  //відправляємо на aws
  public async uploadFile(
    file: UploadedFile,
    itemType: EFileTypes,
    itemId: string,
  ) {
    //buildPath вертає стрічку типу назва_папки/ID/avatar/рандомне_значення.png  -- png, jpg витягує з назви файлу -- так в aws  і будуть створені папки і назва файлу
    //itemType/itemId/avatar/рандом.роширення файлу
    const filePath = this.buildPath(file.name, itemType, itemId);
    // Key: назви папок в aws
    await this.s3Client.send(
      new PutObjectCommand({
        Key: filePath,
        Bucket: configs.AWS_S3_BUCKET,
        Body: file.data,
        ContentType: file.mimetype,
        ACL: "public-read",
      }),
    );

    return filePath;
  }

  public async deleteFile(fileKey: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Key: fileKey,
        Bucket: configs.AWS_S3_BUCKET,
      }),
    );
  }
}

export const s3Service = new S3Service();
