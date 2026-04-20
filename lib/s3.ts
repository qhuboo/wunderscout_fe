import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

export async function getS3Object(s3Key: string): Promise<any> {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
  });

  try {
    const response = await s3.send(command);

    const bodyString = await response.Body?.transformToString();

    if (!bodyString) {
      throw new Error("Empty response from S3.");
    }

    return JSON.parse(bodyString);
  } catch (error) {
    console.log("Error downloading from S3: ", error);
    throw error;
  }
}
