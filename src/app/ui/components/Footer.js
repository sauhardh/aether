import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='bg-slate-950 text-white'>
      <p className='text-center'>Copyright &copy; {currentYear} Aether- All rights reserved</p>
    </footer>
  )
}

export default Footer