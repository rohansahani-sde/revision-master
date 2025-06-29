import React from 'react'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Lesson = () => {
    const [data, setData] = React.useState([]);

    useEffect(() =>{
        const fetchData = async () => {
            const response = await fetch('http://localhost:8000/api');
            const data = await response.json();
            setData(data)
            console.log(data)
        }
        fetchData();
    },[])
    
  return (
    <>
    <div className='bg-[#F5F5F5]'>
        {
            data.map((data, idx) => (
                <Link 
                to={`/learn/${data.day}`} key={idx}
                state={{data}}
                >

                <div key={idx} className='flex hover:bg-[#DEDEDE] bg-[#F5F5F5]  text-amber-500 border m-2 rounded-lg p-4'>
                    <h5 className='text-black'>Day{data.day}: </h5>
                    <h3> {data.topic}</h3>
                </div>
                </Link>
            ) )
        }
    </div>
    
    </>
  )
}

export default Lesson