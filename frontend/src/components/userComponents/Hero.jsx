import React from 'react'
import { useSelector } from 'react-redux'

const Hero = () => {

  const { userInfo } = useSelector((state)=>state.auth)
  return (
    <div>
            <div className="container mx-auto px-4 mt-48 flex justify-center">
                <div className="text-center bg-white rounded-lg shadow-xl p-8">
                    <h1 className="text-4xl md:text-6xl mt-8 font-bold text-gray-800">Welcome <span className="text-blue-500">{ userInfo?.name }</span>!</h1>
                    <p className="text-lg mt-4 text-gray-600">Thank you for joining us.</p>
                    <p className="text-lg mt-2 text-gray-600">Start exploring now.</p>
                </div>
            </div>

    </div>
  )
}

export default Hero
