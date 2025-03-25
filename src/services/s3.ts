import { S3_BUCKET } from "../constants/s3-bucket.constant";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default class S3Service {
  private s3Client = new S3Client({
    region: S3_BUCKET.BUCKET_REGION,
  });

  async getDownloadSignedUrl(bucket: string, key: string) {
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return getSignedUrl(this.s3Client, getObjectCommand);
  }
}
