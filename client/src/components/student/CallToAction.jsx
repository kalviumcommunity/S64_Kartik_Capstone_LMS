import React from 'react';
import { assets } from '../../assets/assets';

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-b from-white to-blue-50 py-20 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
          Learn anything, anytime, anywhere
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <button className="bg-indigo-600 text-white hover:bg-indigo-700 font-medium px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
            Get started
          </button>
          
          <button className="flex items-center justify-center gap-2 bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium px-8 py-3 rounded-lg transition duration-300">
            Learn more 
            <img 
              src={assets.arrow_icon} 
              alt="arrow icon" 
              className="w-5 h-5" 
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;