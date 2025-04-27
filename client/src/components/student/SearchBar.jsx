import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate, useParams } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const { input: urlInput } = useParams(); // Get the input from URL if available
  const [input, setInput] = useState('');
  
  // Update input state when URL param changes
  useEffect(() => {
    if (urlInput) {
      setInput(urlInput);
    }
  }, [urlInput]);

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate('/courses-list/' + encodeURIComponent(input.trim()));
    }
  };

  return (
    <form onSubmit={onSearchHandler} className='max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition duration-300'>
      <img src={assets.search_icon} alt="search_icon" className='md:w-auto w-10 px-3'/>
      <input
        type="text"
        placeholder='Search for courses'
        className='w-full h-full outline-none text-gray-500/80 bg-transparent'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type='submit' className='bg-blue-600 hover:bg-blue-700 rounded-r-lg text-white md:px-10 px-7 h-full transition duration-300'>
        Search
      </button>
    </form>
  );
};

export default SearchBar;