import { useState } from "react";
import {
  DRILLDOWN,
  INITIAL_BUTTONS,
  NUMBER_OF_RESPONSES,
} from "../config/prompts";
import { fetchData } from "./api/fetchData";
import Button from "../components/Button";
import ButtonSkeleton from "@components/ButtonSkeleton";

interface ButtonData {
  title: string;
  text: string;
}

const Home: React.FC = () => {
  const [buttons, setButtons] = useState<ButtonData[]>(INITIAL_BUTTONS);
  const [promptHistory, setPromptHistory] = useState<string[]>([]); // Initialize promptHistory as an array
  const [loading, setLoading] = useState<boolean>(false); // Add loading state
  const [completePrompt, setCompletePrompt] = useState<string>(""); // Add state for complete prompt
  const [structuredResponse, setStructuredResponse] = useState<string>(""); // Add state for structured response

  const handleClick = async (selection: string) => {
    setPromptHistory((prevPromptHistory) => [...prevPromptHistory, selection]); // Append the new selection to the prompt history
    setLoading(true);

    const newCompletePrompt = `
      
      ## Drill Down Instructions
      ${DRILLDOWN}
      
      ## Conversation History
      ${promptHistory.join("\n")}
      
      ## New User Input
      ${selection}
    `;

    setCompletePrompt(newCompletePrompt); // Update the complete prompt state

    try {
      const data = await fetchData(newCompletePrompt);
      console.log("Fetched data:", data);

      if (
        Array.isArray(data.choices) &&
        data.choices.length === NUMBER_OF_RESPONSES
      ) {
        setButtons(
          data.choices.map((choice) => ({
            title: choice.title,
            text: choice.text,
          }))
        );
        setStructuredResponse(
          JSON.stringify(data.choices, null, NUMBER_OF_RESPONSES - 1)
        );
        setLoading(false);
      } else {
        console.error("Unexpected number of choices:", data.choices.length);
      }
    } catch (error) {
      console.error("Failed to fetch choices:", error);
      setLoading(false);
    }
  };

  return (
    <div className="button-row">
      {buttons.map((button, index) => (
        <div key={index}>
          {loading ? (
            <ButtonSkeleton />
          ) : (
            <Button
              title={button.title}
              text={button.text}
              onClick={() => handleClick(button.title)}
            />
          )}
        </div>
      ))}
      {/* <pre>{structuredResponse}</pre> */}
    </div>
  );
};

export default Home;
