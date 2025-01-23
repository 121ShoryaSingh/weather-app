import React from 'react'

interface props {
    children: React.ReactNode
}

const Section = ({children}: props) => {
  return (
    <section className='max-w-screen-xl mx-auto px-5 '>
      {children}
    </section>
  )
}

export default Section
