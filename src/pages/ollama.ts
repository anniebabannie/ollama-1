import type { APIRoute } from "astro";
import { Ollama } from "ollama";

// Outputs: /builtwith.json
export const POST: APIRoute = async ({ params, request }) => {
  const req = await request.json();
  if (!req.url) {
    return new Response(
      JSON.stringify({ error: 'Missing URL parameter' }),
      { status: 400 }
    );
  }

  const url = req.url;
  const imgResp = await fetch(url);
  const imgBlob = await imgResp.blob();
  let buffer = Buffer.from(await imgBlob.arrayBuffer());
  const imgBase64 = buffer.toString('base64')

  const ollama = new Ollama({ host: 'http://ollama-scale-to-0-purple-pine-2926.flycast' })

  const response = await ollama.generate({
    model: 'llava',
    prompt: 'This is an image of some kind of food. Provide me with a grocery list needed to make this dish.',
    images: [imgBase64],
    stream: false,
  })

  return new Response(
    JSON.stringify({
      list: response.response
    })
  )
}