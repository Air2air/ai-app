import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
// Ensure the API key is set
if (!process.env.OPENAI_API_KEY) {
  throw new Error("The OPENAI_API_KEY environment variable is missing or empty.");
}

// Initialize the OpenAI client
const configuration = {
  apiKey: process.env.OPENAI_API_KEY
};const openaiClient = new OpenAI(configuration);
// Define the type for chat messages
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

  // Define the messages array with the correct type
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
      max_tokens: 50,
      n: 1,
      temperature: 0.7,
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error("No choices returned by OpenAI");
    }

    const choices = response.choices[0].message?.content?.trim().split("\n").filter(choice => choice) || [];
    console.log(`Generated choices: ${choices}`);
    res.status(200).json({ choices });
  } catch (error) {
    console.error("Error generating choices:", error);
    res.status(500).json({ error: "Failed to generate choices" });
  }
}