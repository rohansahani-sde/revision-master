import React, { useState, useEffect } from "react";
import axios from "axios";

const CrudComponent = () => {
  const [items, setItems] = useState([]);

  const fetchAIData = async () => {
    try {
      const prompt = `
        Generate a JSON array of 5 objects. Each object should have:
        - id (number)
        - name (string)
        - description (string)
        Example:
        [
          {"id": 1, "name": "Item One", "description": "First item"},
          {"id": 2, "name": "Item Two", "description": "Second item"}
        ]
      `;

      const response = await axios.post("http://localhost:5000/generate", {
        prompt: prompt
      });

      const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const jsonStart = rawText.indexOf("[");
      const jsonEnd = rawText.lastIndexOf("]");
      const jsonString = rawText.slice(jsonStart, jsonEnd + 1);

      const parsedData = JSON.parse(jsonString);
      setItems(parsedData);
    } catch (error) {
      console.error("Error fetching AI data:", error);
    }
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  useEffect(() => {
    fetchAIData();
  }, []);

  return (
    <div>
      <h2>AI-Generated Items</h2>
      <button onClick={fetchAIData}>Refresh AI Data</button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong>: {item.description}
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrudComponent;
