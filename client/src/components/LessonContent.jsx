import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

const LessonContent = ({ lessonData }) => {
  return (
    <div className="w-1/2 bg-amber-500 min-h-screen p-6">
      {lessonData?.map((lesson, i) =>
        lesson.content?.map((content, j) => (
          <div key={`${i}-${j}`} className="mb-10">
            {/* Header */}
            <div className="flex text-xl font-semibold gap-2 mb-4">
              <h1>Day {lesson.day}:</h1>
              <h1>{lesson.topic}</h1>
            </div>

            {/* Concept Title and About */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-1">Concept: {content.concept}</h1>
              <p className="mb-4">About: {content.about}</p>
            </div>

            {/* Problem */}
            <div className="mb-6">
              <h1 className="text-lg font-semibold mb-2">Que: {content.problem.title}</h1>
              <p className="mb-4">{content.problem.description}</p>

              <div className="mb-4">
                <h2 className="font-semibold">Input Format:</h2>
                <p>{content.problem.input}</p>
                <h2 className="font-semibold mt-2">Output Format:</h2>
                <p>{content.problem.output}</p>
              </div>

              {/* Examples */}
              <div>
                {content.problem.examples.map((example, idx) => (
                  <div key={idx} className="mb-4 bg-amber-400 rounded p-3">
                    <h3 className="font-semibold mb-1">Example {idx + 1}:</h3>
                    <pre className="whitespace-pre-wrap bg-amber-300 p-2 rounded mb-1">
                      Input: {example.input}
                    </pre>
                    <pre className="whitespace-pre-wrap bg-amber-300 p-2 rounded">
                      Output: {example.output}
                    </pre>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Button */}
            <div>
              <a href={content.practice_que} target="_blank" rel="noreferrer">
                <button className="flex items-center gap-x-2 bg-amber-300 hover:bg-amber-400 p-2 rounded-lg">
                  Practice <FaExternalLinkAlt />
                </button>
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LessonContent;
