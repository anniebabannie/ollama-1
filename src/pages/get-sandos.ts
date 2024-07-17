import type { APIRoute } from "astro";
import { getSandos } from "../utils/ollama";

export const POST: APIRoute = async ({ params, request }) => {
  const req = await request.json();
  const ingredients = req.ingredients;
  if (!ingredients) {
    return new Response(
      JSON.stringify({ error: 'Missing ingredients parameter' }),
      { status: 400 }
    );
  }

  const response = await getSandos(ingredients);

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const part of response) {
          controller.enqueue(`${part.response}`);
        }
        controller.close();
      },
    })
  )
}