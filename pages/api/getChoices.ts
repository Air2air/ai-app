import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("The OPENAI_API_KEY environment variable is missing or empty.");
}

const configuration = {
  apiKey: process.env.OPENAI_API_KEY
};
const openaiClient = new OpenAI(configuration);

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { selection } = req.body;

  if (!selection) {
    res.status(400).json({ error: "Selection is required" });
    return;
  }

  const messages: ChatMessage[] = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: `Generate three related choices for the following selection: ${selection}` }
  ];

  console.log(`Received selection: ${selection}`);
  console.log(`Generated messages: ${JSON.stringify(messages)}`);

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 150,
      n: 3,
      temperature: 0.7,
    });

    if (!response.choices || response.choices.length < 3) {
      throw new Error("Less than 3 choices returned by OpenAI");
    }

    const choices = response.choices.map(choice => choice.message?.content?.trim()).filter(Boolean);
    console.log(`Generated choices: ${choices}`);
    res.status(200).json({ choices });
  } catch (error) {
    console.error("Error generating choices:", error);
    res.status(500).json({ error: "Failed to generate choices" });
  }
}