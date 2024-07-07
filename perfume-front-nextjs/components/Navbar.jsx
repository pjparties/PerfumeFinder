'use client'
import { useState } from "react"
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import Link from "next/link"

export const Navbar = () => {
  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);
  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };
  return (
    <div className='navbar font-mono text-primary py-4 px-6 flex items-center justify-between'>
      <Link href="/" className="text-xl text-black font-bold" prefetch={false}>
        Perfume Finder
      </Link>
      {/* Desktop Navigation */}
      <ul className='hidden md:flex'>
        <li>
          <Link href="/about" className='p-4 hover:text-accent hover:font-bold text-primary mr-1 py-[10px] px-6 cursor-pointer duration-100'>
            ABOUT
          </Link>
        </li>
        <li >
          <Link href="https://parth-time-dev.vercel.app/" title='Read my Blog' className='p-4 hover:text-accent hover:font-bold text-primary mr-1 py-[10px] px-6 cursor-pointer duration-100'>
            BLOG
          </Link>
        </li>
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className='block md:hidden z-20'>
        {nav ? <AiOutlineClose size={20} className='text-primary' /> : <AiOutlineMenu size={20} className='text-primary' />}
      </div>
      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? 'fixed md:hidden z-10 top-0 w-[100%] bg-background ease-in-out duration-500 h-[100%] left-0 flex flex-col items-center justify-center'
            : 'md:hidden ease-in-out w-[100%] left-0 flex flex-col items-center justify-center -z-10 duration-500 fixed bottom-0 top-[-200%] '
        }
      >
        {/* Mobile Navigation Items */}
        <li className='my-[12px] mr-[1px]'>
          <Link href="/about" className='p-4 hover:text-accent text-lg my-[12px] px-[24px] hover:font-bold text-primary mr-1 py-[10px]  cursor-pointer duration-100'>
            ABOUT
          </Link>
        </li>
        <li className='my-[12px] mr-[1px]'>
          <Link href="https://parth-time-dev.vercel.app/" className='p-4 hover:text-accent text-lg my-[12px] px-[24px] hover:font-bold text-primary mr-1 py-[10px]  cursor-pointer duration-100'>
            BLOG
          </Link>
        </li>
      </ul>
    </div>
  );
};