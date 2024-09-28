import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  // State to manage mobile menu open/close
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Toggle function for mobile menu
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <nav className="p-4 bg-white sticky top-0 z-10 shadow">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-white font-bold text-xl">
          <Link href="/">
            <Image src="/SnackNavbar.svg" alt="Snack O Verse Logo" width={100} height={100} className="h-full w-full" />
          </Link>
        </div>

        {/* Desktop Navbar Links */}
        <div className="hidden md:flex space-x-2">
          <Link href="/">
            <div className="flex items-center justify-center w-10 h-10">
              <Image src="/Icon/Home.svg" alt="Home" width={25} height={20} className="w-fill" />
            </div>
          </Link>
          <Link href="/cart">
            <div className="flex items-center justify-center w-10 h-10">
              <Image src="/Icon/Cart.svg" alt="Cart" width={33} height={20} className="w-fill" />
            </div>
          </Link>
          <Link href="/notification/new">
            <div className="flex items-center justify-center w-10 h-10">
              <Image src="/Icon/Notification.svg" alt="Notification" width={23} height={20} className="w-fill" />
            </div>
          </Link>
          <Link href="/orders/history">
            <div className="flex items-center justify-center w-10 h-10">
              <Image src="/Icon/Order.svg" alt="Order History" width={25} height={20} className="w-fill" />
            </div>
          </Link>
          <Link href="/profile">
            <div className="flex items-center justify-center w-10 h-10">
              <Image src="/Icon/Profile.svg" alt="Profile" width={30} height={20} className="w-fill" />
            </div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleDrawer}
            className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
          >
            {/* Icon for mobile menu */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white text-black shadow-lg transform ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex justify-between items-center p-4">
          <span className="text-xl font-bold">Menu</span>
          <button onClick={toggleDrawer}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col space-y-2 mt-4 px-4">
          <Link href="/">
            <div className="flex items-center justify-start w-full h-10 bg-[#] rounded px-2">
              <div className='flex items-center justify-center w-10 h-10'>
                <Image src="/Icon/Home.svg" alt="Home" width={25} height={20} className="w-fill" />
              </div>
              <span className="ml-2">Home</span>
            </div>
          </Link>

          <Link href="/cart">
            <div className="flex items-center justify-start w-full h-10 rounded px-2">
              <div className='flex items-center justify-center w-10 h-10'>
                <Image src="/Icon/Cart.svg" alt="Cart" width={33} height={20} className="w-fill" />
              </div>
              <span className="ml-2">Cart</span>
            </div>
          </Link>

          <Link href="/notification/new">
            <div className="flex items-center justify-start w-full h-10 rounded px-2">
              <div className='flex items-center justify-center w-10 h-10'>
                <Image src="/Icon/Notification.svg" alt="Notification" width={23} height={20} className="w-fill" />
              </div>
              <span className="ml-2">Notifications</span>
            </div>
          </Link>

          <Link href="/orders/history">
            <div className="flex items-center justify-start w-full h-10 rounded px-2">
              <div className='flex items-center justify-center w-10 h-10'>
                <Image src="/Icon/Order.svg" alt="Order History" width={25} height={20} className="w-fill" />
              </div>
              <span className="ml-2">Order History</span>
            </div>
          </Link>

          <Link href="/profile">
            <div className="flex items-center justify-start w-full h-10 rounded px-2">
              <div className='flex items-center justify-center w-10 h-10'>
                <Image src="/Icon/Profile.svg" alt="Profile" width={30} height={20} className="w-fill" />
              </div>
              <span className="ml-2">Profile</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
