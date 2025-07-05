import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaArrowLeft, FaHome } from "react-icons/fa";
import CodeEditor from '../components/CodeEditor';
import ReminderSystem from '../components/ReminderSystem';


const Details = () => {
    const location = useLocation()
    const lesson = location.state.lesson
    // console.log("data :", lesson)
    const data = location.state.lesson
    console.log(data.day);


    const example = lesson.content
    
    const content = lesson.content[0]
    // console.log(content)

    
  return (

    <>
        <Link to={"/"} >
        <h1 className='flex items-center'> <span><FaArrowLeft/></span>  Home <FaHome />  </h1>
      {/* <h1 className="text-3xl font-bold mb-6 text-center">Lesson Details</h1> */}
        </Link>
      <h1 className="text-3xl font-bold mb-6 text-center">Lesson Details</h1>

    <div className="bg-gray-100 w-full min-h-screen flex">
      {/* {data.map((dayItem, index) => ( */}
      {/* <div className='flex bg-red-400'> */}
        <div className="mb-8 w-[40%] bg-white p-6 rounded-2xl shadow">
            {/* // key={index}  */}
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Day {data.day}: {data.topic}
          </h2>

          {data.content.map((item, idx) => (
            <div key={idx} className="border-l-4 border-blue-500 pl-4 mb-6">
              <h3 className="text-lg font-semibold">{item.concept}</h3>
              <p className="text-gray-700 mb-2">{item.about}</p>

              <div className="mb-2">
                <h4 className="font-medium text-md">🧩 Problem: {item.problem.title}</h4>
                <p className="text-sm text-gray-800 mb-1">{item.problem.description}</p>

                <p className="text-sm text-gray-700">
                  <strong>Input:</strong> {item.problem.input}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Output:</strong> {item.problem.output}
                </p>

                <div className="mt-2 text-sm text-gray-800">
                  <strong>Examples:</strong>
                  <ul className="list-disc ml-6">
                    {item.problem.examples.map((ex, i) => (
                      <li key={i}>
                        <strong>Input:</strong> {ex.input} | <strong>Output:</strong> {ex.output}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a
                href={item.practice_que}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-500 hover:underline"
              >
                🔗 Practice Question
              </a>
            </div>
          ))}
        </div>
      {/* </div> */}
        <div className=" w-[60%]">
        <CodeEditor />
        </div>
    </div>
    </>


  )
}

export default Details