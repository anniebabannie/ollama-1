import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function RecipeMaker() {
  const [recipes, setRecipes] = useState("");
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRecipes("");
    const formData = new FormData(event.currentTarget);
    const ingredients = formData.get("ingredients") as string;

    const resp = await fetch(`http://localhost:4321/get-sandos`, {
      method: "POST",
      body: JSON.stringify({ ingredients }),
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
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

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-5">
        <textarea name="ingredients" placeholder="List your ingredient's here, separated by commas" 
          className="border border-gray-400 rounded-md p-5 text-black w-full min-h-32 mb-5 outline-none focus:ring-4 focus:ring-yellow-500 focus:border-yellow-600 text-xl"/>
        <button type="submit" className="bg-red-700 hover:bg-red-800 text-xl rounded-md py-5 text-white text-center w-full">Generate Sandwiches</button>
      </form>
      {recipes &&
      <div className="bg-yellow-100 p-5 rounded-md">
        <Markdown remarkPlugins={[remarkGfm]}>{recipes}</Markdown>
      </div>
      }
    </>
  );
}