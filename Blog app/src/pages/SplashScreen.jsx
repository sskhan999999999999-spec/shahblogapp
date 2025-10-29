import React, { useEffect } from 'react'

function SplashScreen({onFinish}) {
    useEffect(()=>{
        const time = setTimeout(() => {
            onFinish()
        }, 1000);
        return ()=> clearTimeout(time)
    },[onFinish])
  return (
    
  <div className="flex flex-col justify-between items-center min-h-screen py-8">
  
  <div className="flex flex-1 justify-center items-center">
    <h1 className="bg-blue-600 text-white rounded-full p-4 lg:p-6 flex items-center justify-center text-4xl font-bold w-16 h-16 lg:w-24 lg:h-24 lg:text-7xl">
      B
    </h1>
  </div>

  
  <h2 className="text-lg lg:text-3xl font-semibold text-gray-700 mb-4">
    Blog App
  </h2>
</div>



  )
}

export default SplashScreen
