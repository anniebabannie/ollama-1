import React, { useState } from 'react';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

function ImageUpload() {
  // Create state to store file
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [list, setList] = useState("");

  // Function to upload file to s3
  const uploadFile = async () => {

    // S3 Bucket Name
    const BUCKET_NAME = "ollama-1"

    // S3 Region
    const AWS_REGION = "auto";

    // S3 Credentials
    const s3Client = new S3Client({
      endpoint: "https://fly.storage.tigris.dev",
      region: AWS_REGION,
      credentials: {
        accessKeyId: "tid_fQNRzwlIWIZFaOHcLFtKNCNrKaAZdQsTjcc_CzFVwNPHCMQrmS",
        secretAccessKey: "tsec_omTiChmZwHZi3TIMFfAbHsulEystOu2oFLl3WQZ1_BTfql4Zrd4CaHenj4XfrTe4f7laMJ",
      },
    });

    // Files Parameters
    const params = {
      Bucket: BUCKET_NAME,
      Key: file.name,
      Body: file,
    };

    try {
      // Uploading file to s3
      const command = new PutObjectCommand(params);
      const response = await s3Client.send(command);
      const imgUrl = `https://fly.storage.tigris.dev/${BUCKET_NAME}/${file.name}`;
      const ollamaResponse = await fetch(`http://localhost:4321/ollama`, {
        method: "POST",
        body: JSON.stringify({ url: imgUrl }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      const list = await ollamaResponse.json();
      console.log(list);
      // setList(list)
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  return (
    <div className="App">
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload</button>
        <img src={image} alt="" />
        <p>{list}</p>
      </div>
    </div>
  );
}


export default ImageUpload;