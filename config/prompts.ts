export const NUMBER_OF_RESPONSES = 4;
export const MAX_CHARACTERS = 300;
export const INITIAL_BUTTONS = [
  { text: "Furry Friends", title: "Cats" },
  { text: "Loyal Companions", title: "Dogs" },
  { text: "Scaly Pals", title: "Beardies" },
  { text: "Prickly buddies", title: "Hedgehogs" },
];

export const DRILLDOWN = `Thoroughly explore the selected topic and identify ${NUMBER_OF_RESPONSES} deeply fascinating and surprising subtopics. Provide detailed and engaging insights for each subtopic, ensuring they are both intriguing and unexpected. Return exactly ${NUMBER_OF_RESPONSES}  distinct variations of your response as separate objects. Limit the response to ${MAX_CHARACTERS} characters.`;
