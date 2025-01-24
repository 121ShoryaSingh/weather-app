import React from 'react'

interface props {
    children: React.ReactNode
    classname?: string
}

const Section = ({children, classname}: props) => {
  return (
    <section className={`max-w-screen-xl mx-auto ${classname}`}>
      {children}
    </section>
  )
}

export default Section
