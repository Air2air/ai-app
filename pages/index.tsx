import { useState } from 'react';

const engagementContext = "You are an engaging assistant."; // Define the base prompt
const drillDown = "Thoroughly explore the selected topic and identify 3 deeply fascinating and surprising subtopics. Provide detailed and engaging insights for each subtopic, ensuring they are both intriguing and unexpected. Return exactly 3 distinct variations of your response as separate objects."; // Refined drillDown with clear instructions

const Home: React.FC = () => {
  const [buttons, setButtons] = useState<string[]>([
    'Cats',
    'Dogs',
    'Beardies',
  ]);
  const [promptHistory, setPromptHistory] = useState<string[]>([]); // Initialize promptHistory as an array
  const [loading, setLoading] = useState<boolean>(false); // Add loading state
  const [completePrompt, setCompletePrompt] = useState<string>(''); // Add state for complete prompt
  const [structuredResponse, setStructuredResponse] = useState<string>(''); // Add state for structured response

  const handleClick = async (selection: string) => {
    setPromptHistory((prevPromptHistory) => [...prevPromptHistory, selection]); // Append the new selection to the prompt history
    setLoading(true); // Set loading to true when fetching starts

    // Create a structured prompt with labeled sections
    const newCompletePrompt = `
      ## Engagement Context
      ${engagementContext}
      
      ## Drill Down Instructions
      ${drillDown}
      
      ## Conversation History
      ${promptHistory.join('\n')}
      
      ## New User Input
      ${selection}
    `;

    setCompletePrompt(newCompletePrompt); // Update the complete prompt state

    const response = await fetch('/api/getChoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selection: newCompletePrompt }), // Send the structured prompt
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Fetched data:', data);

      // Ensure the response contains exactly 3 objects
      if (Array.isArray(data.choices) && data.choices.length === 3) {
        setButtons(data.choices);
        setStructuredResponse(JSON.stringify(data.choices, null, 2)); // Store the structured response as a formatted JSON string
      } else {
        console.error('Unexpected number of choices:', data.choices.length);
      }
    } else {
      console.error('Failed to fetch choices');
    }

    setLoading(false); // Set loading to false when fetching ends
  };

  return (
    <div>
      <h1>AI Choice Generator</h1>
      {promptHistory.length > 0 && (
        <div>
          <h2>Prompt History:</h2>
          <ul>
            {promptHistory.map((prompt, index) => (
              <li key={index}>{prompt}</li>
            ))}
          </ul>
        </div>
      )}
      {loading ? (
        <div className="spinner"></div> // Loading indicator
      ) : (
        <div>
          {buttons.map((button, index) => (
            <button key={index} onClick={() => handleClick(button)}>
              {button}
            </button>
          ))}
        </div>
      )}
      {completePrompt && (
        <div>
          <h2>Submitted Prompt:</h2>
          <pre><code>{completePrompt}</code></pre>
        </div>
      )}
      {structuredResponse && (
        <div>
          <h2>Structured Response:</h2>
          <pre><code>{structuredResponse}</code></pre>
        </div>
      )}
    </div>
  );
};

export default Home;