import { S3Event } from "aws-lambda";
import { sqsClient } from "../clients/sqsClient";
import { SendMessageCommand } from "@aws-sdk/client-sqs";

export async function handler(event: S3Event) {
  await Promise.all(
    event.Records.map(async (record) => {
      const { key } = record.s3.object;

      const command = new SendMessageCommand({
        QueueUrl: process.env.MEALS_QUEUE_URL!,
        MessageBody: JSON.stringify({ fileKey: key }),
      });

      await sqsClient.send(command);
    })
  );

  //   return {
  //     statusCode: 200,
  //     body: "File uploaded",
  //   };
}
