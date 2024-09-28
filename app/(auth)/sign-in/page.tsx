import React from 'react'
import SignInForm from '@/components/form/SignInForm'
import Image from 'next/image'


const page = () => {
  return (
        <div className='flex flex-row w-screen h-screen'>
          <div className='w-3/5 h-full'>
            <Image
            src="/SnackNavbar.svg"
            alt="Title"
            height={100}
            width={100}
            priority/>
          </div>
          <div className='flex w-2/5 h-full items-center  bg-gradient-to-b from-[#EBC601] to-[#CAAA00] rounded-tl-xl rounded-bl-xl justify-center'>
            <SignInForm/>
          </div>
        </div>
  )
}

export default page
