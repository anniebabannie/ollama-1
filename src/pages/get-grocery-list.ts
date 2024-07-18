import type { APIRoute } from "astro";
import { Ollama } from "ollama";
import { z } from "zod";

async function getBase64Image(url:string) {
  const imgResp = await fetch(url);
  const imgBlob = await imgResp.blob();
  let buffer = Buffer.from(await imgBlob.arrayBuffer());
  return buffer.toString('base64')
}

const sampleSchema = [
  {
    "recipe": "<The name of the recipe>",
    "ingredients": ["<ingredient1>", "<ingredient2>", "<ingredient3>"],
    "instructions": ["step 1", "step 2", "step 3"]
  }
];

export const POST: APIRoute = async ({ params, request }) => {
  const req = await request.json();
  if (!req.url) {
    return new Response(
      JSON.stringify({ error: 'Missing URL parameter' }),
      { status: 400 }
    );
  }

  const imgBase64 = await getBase64Image(req.url);

  const ollama = new Ollama({ 
    host: 'http://ollama-scale-to-0-purple-pine-2926.flycast'
  });

  const response = await ollama.generate({
    model: 'llava',
    prompt: `
    This is an image of some kind of food. 
    Provide me with a recipe and a corresponding list of ingredients needed to make this dish.
    Provide the response as JSON, following the schema below: ${JSON.stringify(sampleSchema)}.
    Do not include any other properties in the JSON object other than the ones specified in the schema.`,
    images: [imgBase64],
    stream: false,
    format: 'json',
  })

  return new Response(
    JSON.stringify(response.response),
    { status: 200 }
  )
}