import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
// import language from 'react-syntax-highlighter/dist/esm/languages/hljs/1c';

function CodeEditor() {

    
    const [language, setLanguage] = useState("java");
    const [code, setCode] = useState(`import java.util.*;

public class Main {
    public static void main(String[] args) {
      System.out.println("Hello, World!");
  }
}`);

    // const handleCode = async () =>{
    //     console.log(code);
    // }

    const [output, setOutput] = useState("");

    const handleRunCode = async () => {
    const encodedSourceCode = btoa(code); // base64 encode required by Judge0
    try {
        const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY", // Replace with your RapidAPI key
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
            },
            body: JSON.stringify({
                language_id: 62, // Java
                source_code: encodedSourceCode,
                stdin: ""
            })
        });

        const result = await response.json();
        setOutput(atob(result.stdout || "") || result.stderr || result.compile_output || "No output");
    } catch (error) {
        setOutput("Error: " + error.message);
    }
};

    

  return (
    <>
    <button onClick={handleRunCode} >run</button>
    <div className="h-screen pb-6 border rounded shadow">
    <h1>{language}:</h1>
      <Editor
        height="100%"
        defaultLanguage={language}
        defaultValue={code}
        theme="vs-dark"
        onChange={(value) => setCode(value)}
      />
    </div>
    <div>
        {output}
    </div>
    </>
  );
}

export default CodeEditor;
