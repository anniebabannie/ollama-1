import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const uploadFile = async (name: string, uint8Array: Uint8Array) => {

  const BUCKET_NAME = "ollama-1"
  const AWS_REGION = "auto";
  const s3Client = new S3Client({
    endpoint: "https://fly.storage.tigris.dev",
    region: AWS_REGION,
    credentials: {
      accessKeyId: "tid_fQNRzwlIWIZFaOHcLFtKNCNrKaAZdQsTjcc_CzFVwNPHCMQrmS",
      secretAccessKey: "tsec_omTiChmZwHZi3TIMFfAbHsulEystOu2oFLl3WQZ1_BTfql4Zrd4CaHenj4XfrTe4f7laMJ",
    },
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: name,
    Body: uint8Array,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return name;
}