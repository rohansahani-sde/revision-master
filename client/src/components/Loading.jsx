import React from 'react'
import load from '/load.gif'

const Loading = () => {
  return (
    <>
    <div className=' bg-black flex justify-center'>
    <img className=' w-60' src={load} alt="" />
    </div>
    </>
  )
}

export default Loading