import React, { useState } from 'react';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BUCKET_NAME = "ollama-1"

function ImageUpload() {
  // Create state to store file
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [recipes, setRecipes] = useState("");

  const generateMealPlan = async (filename:string) => {
    const imgUrl = `https://fly.storage.tigris.dev/${BUCKET_NAME}/${filename}`;
    const resp = await fetch(`http://localhost:4321/get-grocery-list`, {
      method: "POST",
      body: JSON.stringify({ url: imgUrl }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    const reader = await resp.body?.getReader();
    const decoder = new TextDecoder();
    // @ts-ignore
    reader?.read().then(async function processText({ done, value }) {
      if (done) {
        return;
      }
      const text = decoder.decode(value);
      console.log(text);
      setRecipes((prevRecipes) => prevRecipes + text);
      return reader?.read().then(processText);
    });
  }

  const uploadFile = async () => {

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
      Key: file.name,
      Body: file,
    };

    try {
      // Uploading file to s3
      const command = new PutObjectCommand(params);
      const response = await s3Client.send(command);

      await generateMealPlan(file.name);
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
        <Markdown remarkPlugins={[remarkGfm]}>{recipes}</Markdown>
      </div>
    </div>
  );
}


export default ImageUpload;