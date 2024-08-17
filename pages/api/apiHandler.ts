import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { NUMBER_OF_RESPONSES, DRILLDOWN } from "../../config/prompts";

if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "The OPENAI_API_KEY environment variable is missing or empty."
  );
}

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openaiClient = new OpenAI(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: DRILLDOWN },
    { role: "user", content: `New User Input:\n${selection}` },
  ];

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 150,
      n: NUMBER_OF_RESPONSES,
      temperature: 0.7,
      top_p: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: ["\n"],
    });

    if (!response.choices || response.choices.length < NUMBER_OF_RESPONSES) {
      throw new Error("Less than the required number of choices returned by OpenAI");
    }

    const choices = response.choices.map((choice) => {
      const content = choice.message.content?.trim() ?? "";
      const [title, text] = content.split("\n\n", 2);
      return { title: title || "Untitled", text: text || content };
    });

    res.status(200).json({ choices });
  } catch (error) {
    console.error("Error fetching choices:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}