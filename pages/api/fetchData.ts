// utils/fetchData.ts
export const fetchData = async (selection: string) => {
    const response = await fetch("/api/apiHandler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selection }), // Send the structured prompt
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch choices");
    }
  
    return response.json();
  };