import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='bg-[#2a3439] text-white'>
      <p className='text-center'>Copyright &copy; {currentYear} Aether- All rights reserved</p>
    </footer>
  )
}

export default Footer