// app/utils/s3.server.ts
import type { UploadHandler } from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import S3 from "aws-sdk/clients/s3";
import { createId } from "@paralleldrive/cuid2";

// The UploadHandler gives us an AsyncIterable<Uint8Array>, so we need to convert that to something the aws-sdk can use.
// Here, we are going to convert that to a buffer to be consumed by the aws-sdk.
// https://dev.to/crypticai/uploading-files-in-remix-to-an-s3-compatible-service-35c9
async function convertToBuffer(a: AsyncIterable<Uint8Array>) {
  const result = [];
  for await (const chunk of a) {
    result.push(chunk);
  }
  return Buffer.concat(result);
}

// 1
const s3 = new S3({
  region: process.env.KUDOS_AWS_BUCKET_REGION,
  accessKeyId: process.env.KUDOS_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.KUDOS_AWS_SECRET_ACCESS_KEY,
});

const uploadHandler: UploadHandler = async (handlerData) => {
  const { filename, data } = handlerData;
  const body = {
    Bucket: process.env.KUDOS_AWS_BUCKET_NAME ?? "",
    Key: `${createId()}.${filename?.split(".").slice(-1)}`,
    Body: await convertToBuffer(data),
  };


  const uploadInfo = await s3.upload(body).promise();
  return uploadInfo.Location;
};

export async function uploadAvatar(request: Request) {
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const file = formData.get("profile-pic")?.toString() ?? "";

  return file;
}
