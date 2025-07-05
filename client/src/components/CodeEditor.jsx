import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const languageOptions = {
  java: {
    id: 62,
    defaultCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
  },
  python: {
    id: 71,
    defaultCode: `print("Hello, World!")`
  },
  javascript: {
    id: 63,
    defaultCode: `console.log("Hello, World!");`
  },
  c: {
    id: 50,
    defaultCode: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`
  }
};

function CodeEditor() {
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(languageOptions["java"].defaultCode);
  const [output, setOutput] = useState("Smart Revision");

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setCode(languageOptions[selectedLang].defaultCode);
    setOutput(""); // clear output on language change
  };

  const handleRunCode = async () => {
  const encodedSourceCode = btoa(code);
  try {
    const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "553d43adeemsh75b9aca0cc69405p14a024jsn6599ca07bd91",  // REPLACE this
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
      },
      body: JSON.stringify({
        language_id: languageOptions[language].id,
        source_code: encodedSourceCode,
        stdin: ""
      })
    });

    const result = await response.json();
    setOutput(
      atob(result.stdout || "") ||
      result.stderr ||
      result.compile_output ||
      "No output"
    );
  } catch (error) {
    setOutput("Error: " + error.message);
  }
};


  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <select onChange={handleLanguageChange} value={language}>
          {Object.keys(languageOptions).map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <button onClick={handleRunCode}>Run</button>
      </div>

      <div className='h-screen flex'>
      {/* <div className=" " > */}
        {/* <h1>{language}:</h1> */}
        <Editor
          height="100%"
          width="60%"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={(value) => setCode(value)}
        />
      {/* </div> */}
      <div className='text-gray-100 pl-4 border rounded-r-xl shadow w-[40%] h-full bg-[#222433]' style={{ whiteSpace: "pre-wrap" }}>
        <strong className='text-gray-500' >Output:</strong>
        <div>{output}</div>
      </div>
      </div>

    </>
  );
}

export default CodeEditor;
