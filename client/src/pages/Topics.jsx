import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const Topics = () => {
    const location = useLocation();
    const lessonData =location.state?.lessonData 
    console.log(location.state?.lessonData);
  return (
    <>
    
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Lesson Plan</h1>
      {lessonData.map((lesson, index) => (
        <Link to={`/learn/${lesson.day}`} 
                key={index}
                state={{lesson}}
                >
        <div key={index} className="mb-8 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Day {lesson.day}: {lesson.topic}
          </h2>
        </div>
        </Link>
      ))
       }
    </div>
    
    {/* <div>
        {data.map((data, idx) =>(
            <h1 key={idx}>
                {data.topic}
            </h1>
        ) )}
    </div> */}
    </>
  )
}

export default Topics