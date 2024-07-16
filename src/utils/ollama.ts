import { Ollama } from "ollama";

export async function getGroceryList(url: string) {
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
  return response;
}