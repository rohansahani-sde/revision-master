// LessonViewer.jsx
import React from "react";

const LessonViewer = ({ plan }) => {
  return (
    <div>
      {plan.map((day) => (
        <div key={day.day} style={{ marginBottom: "20px" }}>
          <h2>Day {day.day}: {day.topic}</h2>
          {day.content.map((item, index) => (
            <div key={index}>
              <h3>{item.concept}</h3>
              <p>{item.about}</p>
              <h4>Problem: {item.problem.title}</h4>
              <p>{item.problem.description}</p>
              <p><strong>Input:</strong> {item.problem.input}</p>
              <p><strong>Output:</strong> {item.problem.output}</p>
              <div>
                <strong>Examples:</strong>
                <ul>
                  {item.problem.examples.map((ex, i) => (
                    <li key={i}>Input: {ex.input} → Output: {ex.output}</li>
                  ))}
                </ul>
              </div>
              <a href={item.practice_que} target="_blank" rel="noreferrer">Practice Link</a>
              <hr />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LessonViewer;
