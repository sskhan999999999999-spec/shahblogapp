import React from 'react'

function Container({children}) {
  return (
    
    <div className='w-full max-w-sm flex-col justify-center items-center m-auto bg-white
     mt-12  lg:mt-0 shadow-2xl'>
      {children}
    </div>
    
  )
}

export default Container
