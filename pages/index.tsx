import { useState } from 'react';

const Home: React.FC = () => {
  const [buttons, setButtons] = useState<string[]>([
    'Hello!',
    'How are you?',
    'What is your name?'
  ]);

  const handleClick = async (selection: string) => {
    const response = await fetch('/api/getChoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selection }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Fetched data:', data);
      setButtons(data.choices);
    } else {
      console.error('Failed to fetch choices');
    }
  };

  return (
    <div>
      <h1>AI Choice Generator</h1>
      <div>
        {buttons.map((button, index) => (
          <button key={index} onClick={() => handleClick(button)}>
            {button}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;