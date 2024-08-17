// pages/index.tsx

import { useState } from "react";
import { DRILLDOWN } from "./prompts";

const Home: React.FC = () => {
  const [buttons, setButtons] = useState<string[]>([
    "Cats",
    "Dogs",
    "Beardies",
  ]);
  const [promptHistory, setPromptHistory] = useState<string[]>([]); // Initialize promptHistory as an array
  const [loading, setLoading] = useState<boolean>(false); // Add loading state
  const [completePrompt, setCompletePrompt] = useState<string>(""); // Add state for complete prompt
  const [structuredResponse, setStructuredResponse] = useState<string>(""); // Add state for structured response

  const handleClick = async (selection: string) => {
    setPromptHistory((prevPromptHistory) => [...prevPromptHistory, selection]); // Append the new selection to the prompt history
    setLoading(true); // Set loading to true when fetching starts

    // Create a structured prompt with labeled sections
    const newCompletePrompt = `
      
      ## Drill Down Instructions
      ${DRILLDOWN}
      
      ## Conversation History
      ${promptHistory.join("\n")}
      
      ## New User Input
      ${selection}
    `;

    setCompletePrompt(newCompletePrompt); // Update the complete prompt state

    const response = await fetch("/api/apiHandler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selection: newCompletePrompt }), // Send the structured prompt
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Fetched data:", data);

      // Ensure the response contains exactly 3 objects
      if (Array.isArray(data.choices) && data.choices.length === 3) {
        setButtons(data.choices.map(choice => choice.title));
        setStructuredResponse(JSON.stringify(data.choices, null, 2)); // Store the structured response as a formatted JSON string
      } else {
        console.error("Unexpected number of choices:", data.choices.length);
      }
    } else {
      console.error("Failed to fetch choices");
    }

    setLoading(false); // Set loading to false when fetching ends
  };

  return (
    <div>
      {buttons.map((button, index) => (
        <button key={index} onClick={() => handleClick(button)}>
          {button}
        </button>
      ))}
      {loading && <p>Loading...</p>}
      <pre>{structuredResponse}</pre>
    </div>
  );
};

export default Home;