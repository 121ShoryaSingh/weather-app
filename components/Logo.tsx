import Image from 'next/image'
import React from 'react'

const logo = () => {
  return (
    <div className=''>
      <Image src="/logo.svg" alt='Loge' width={50} height={50} />
    </div>
  )
}

export default logo
