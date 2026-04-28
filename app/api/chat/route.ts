import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();

  const stream = await client.chat.completions.create({
    model: body.model || "gpt-5",
    stream: true,
    messages: body.messages,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text =
          chunk.choices?.[0]?.delta?.content || "";

        controller.enqueue(
          encoder.encode(text)
        );
      }

      controller.close();
    },
  });

  return new Response(readable);
}