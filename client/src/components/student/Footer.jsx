import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-left w-full'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
          {/* Logo and description */}
          <div className='flex flex-col'>
            <div className='flex items-center'>
              <img src={assets.logo_dark} alt='logo' className='h-8' />
              {/* <span className='text-white text-xl font-bold ml-2'>Edemy</span> */}
            </div>
            <p className='text-gray-400 mt-4 max-w-md'>
              Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text.
            </p>
          </div>
          
          {/* Company links */}
          <div>
            <h3 className='text-white text-lg font-semibold mb-4'>Company</h3>
            <ul className='space-y-3'>
              <li><a href="#" className='text-gray-400 hover:text-white transition-colors'>Home</a></li>
              <li><a href="#" className='text-gray-400 hover:text-white transition-colors'>About us</a></li>
              <li><a href="#" className='text-gray-400 hover:text-white transition-colors'>Contact us</a></li>
              <li><a href="#" className='text-gray-400 hover:text-white transition-colors'>Privacy policy</a></li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div>
            <h3 className='text-white text-lg font-semibold mb-4'>Subscribe to our newsletter</h3>
            <p className='text-gray-400 mb-4'>
              The latest news, articles, and resources, sent to 
              your inbox weekly.
            </p>
            <div className='flex'>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className='bg-gray-800 text-gray-300 px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors'>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className='mt-12 pt-8 border-t border-gray-800'>
          <p className='text-center text-gray-500'>
            Copyright 2024 © Edemy. All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;