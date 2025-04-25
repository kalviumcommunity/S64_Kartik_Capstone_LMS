import React from 'react';
import { assets } from '../../assets/assets';

const Companies = () => {
  return (
    <div className='py-12 px-4 bg-white'>
      <div className='max-w-6xl mx-auto text-center'>
        <p className='text-base text-gray-500 mb-6'>Trusted by learners from</p>
        <div className='flex flex-wrap items-center justify-center gap-6 md:gap-16'>
          <img src={assets.microsoft_logo} alt="Microsoft" className='w-20 md:w-28 transition-opacity hover:opacity-80' />
          <img src={assets.walmart_logo} alt="Walmart" className='w-20 md:w-28 transition-opacity hover:opacity-80' />
          <img src={assets.accenture_logo} alt="Accenture" className='w-20 md:w-28 transition-opacity hover:opacity-80' />
          <img src={assets.adobe_logo} alt="Adobe" className='w-20 md:w-28 transition-opacity hover:opacity-80' />
          <img src={assets.paypal_logo} alt="Paypal" className='w-20 md:w-28 transition-opacity hover:opacity-80' />
        </div>
      </div>
    </div>
  );
};

export default Companies;