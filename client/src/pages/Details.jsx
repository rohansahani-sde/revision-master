import React from 'react'
import { useLocation } from 'react-router-dom'
import { FaExternalLinkAlt } from "react-icons/fa";
import CodeEditor from '../components/CodeEditor';


const Details = () => {
    const location = useLocation()
    const lesson = location.state.data
    // console.log(lesson)

    const example = lesson.content[0].problem.examples
    const content = lesson.content[0]

    
  return (

    <>
    <main className='flex'>

    <div className='w-1/2 bg-amber-500 min-h-screen' >

    <div className='flex text-xl font-semibold gap-2'>
        <h1>Day {lesson.day}:</h1>
        <h1>{lesson.topic}</h1>
    </div>
    <div>
        <h1 className='text-2xl font-bold'>Concept : {content.concept}</h1>
        <h1>About: {content.about}</h1>
        {/* problem */}
        <h1>Que: {content.problem.title} :</h1>
        <h1>{content.problem.description}</h1>

        <div className='mt-6'>
            <h1>Input Format:</h1>
            <h1>{content.problem.input}</h1>
            <h1>Output Format:</h1>
            <h1>{content.problem.output}</h1>
        </div>
        <div>
            {example.map((example, idx) =>(
                <div key={idx}>
                    <h1>Example : {idx+1}</h1>
                    <pre>Input: {example.input}</pre>
                    <pre>Output: {example.output}</pre>
                </div>
            ))}
        </div>

        
    </div>

    <div>
       <a href={content.practice_que} target='_blank' >
        <button className=' flex items-center gap-x-2 bg-amber-300 hover:bg-amber-400 p-2 rounded-lg'>
         practice <FaExternalLinkAlt />
        </button>
        </a> 
    </div>
    </div>
    <div className='w-1/2 min-h-screen'>
    <CodeEditor />

    </div>

    </main>

    </>

  )
}

export default Details