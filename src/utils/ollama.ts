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
  console.log(response.response)
  return response.response;
}

export async function getSandos(ingredients: string) {
  const ollama = new Ollama({ host: 'http://ollama-scale-to-0-purple-pine-2926.flycast' })

  const response = await ollama.generate({
    model: 'llama3',
    prompt: `You've just been provided a list of ingredients. 
    Provide me with a list of five possible SANDWICH recipes that can be made with these ingredients: ${ingredients}. 
    You do not need to use every ingredient provided in the recipes.
    Do not preface the list of recipes with any other information or text. I just need the list of recipes.
    The format of your response should be as follows using markdown: For each recipe, provide the recipe name as an H2 title. Underneath the recipe name, have the word "Ingredients" in bold text, followed by the list of ingredients. Finally have the word "Instructions" in bold text, with a numbered list of instruction steps.`,
    stream: true,
  })
  return response;
}