import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { s3Client } from "../clients/s3Client";

const EXPIRATION_TIME = 60 * 60 * 24; // 1 day

const getFileExtension = (fileType: string) => {
  if (fileType === "audio/m4a") return ".m4a";
  return ".jpg";
};

export const getPresignedUrl = async (fileType: string) => {
  const fileId = randomUUID();
  const ext = getFileExtension(fileType);
  const fileKey = `${fileId}${ext}`;

  console.log({ bucketName: process.env.BUCKET_NAME });
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileKey,
  });
  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: EXPIRATION_TIME,
  });

  return {
    fileKey,
    presignedUrl,
  };
};
