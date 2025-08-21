import React from 'react'

const Cross = () => {
  return (
    <div className='flex justify-center items-center'>
        <div className='w-0.5 absolute bg-white min-h-screen rotate-45'></div>
        <div className='w-0.5 absolute bg-white min-h-screen -rotate-45'></div>
    </div>
  )
}

export default Cross