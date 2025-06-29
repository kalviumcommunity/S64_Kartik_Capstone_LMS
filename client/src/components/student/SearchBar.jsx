import React, { useState, useEffect, useRef, useCallback } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const SearchBar = ({ onSearch, initialValue, enableAI = true, className = '' }) => {
  const navigate = useNavigate();
  const { input: urlInput } = useParams(); // Get the input from URL if available
  const [input, setInput] = useState(initialValue || '');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [error, setError] = useState('');
  
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Update input state when URL param or initialValue changes
  useEffect(() => {
    if (urlInput) {
      setInput(urlInput);
    } else if (initialValue !== undefined) {
      setInput(initialValue);
    }
  }, [urlInput, initialValue]);

  // Debounced function to call LLM API for course search suggestions
  const debouncedCallLLM = useCallback((text) => {
    if (!enableAI || debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      if (text.length >= 2 && enableAI) {
        await callLLM(text);
      } else {
        setSuggestion('');
        setShowSuggestion(false);
      }
    }, 300);
  }, [enableAI]);

  // Call LLM API for course search suggestions
  const callLLM = async (prompt) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/llm/complete', {
        prompt: `Suggest course search terms for: ${prompt}`,
        context: 'course search'
      });
      
      if (response.data.success) {
        setSuggestion(response.data.completion);
        setShowSuggestion(true);
      } else {
        setError('Failed to get suggestion');
      }
    } catch (err) {
      console.error('LLM API error:', err);
      // Don't show error for AI suggestions, just disable them
      setShowSuggestion(false);
    } finally {
      setIsLoading(false);
    }
  };

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const searchTerm = input.trim();
      // Call onSearch callback if provided
      if (onSearch) {
        onSearch(searchTerm);
      } else {
        // Default navigation behavior
        navigate('/courses-list/' + encodeURIComponent(searchTerm));
      }
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    
    if (value.length >= 2 && enableAI) {
      debouncedCallLLM(value);
    } else {
      setSuggestion('');
      setShowSuggestion(false);
    }
  };

  // Handle key navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && showSuggestion && suggestion) {
      e.preventDefault();
      acceptSuggestion();
    } else if (e.key === 'Escape') {
      setShowSuggestion(false);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowRight' && showSuggestion && suggestion) {
      e.preventDefault();
      acceptSuggestion();
    }
  };

  // Accept the current suggestion
  const acceptSuggestion = () => {
    if (!suggestion) return;
    
    const newValue = input + suggestion;
    setInput(newValue);
    setSuggestion('');
    setShowSuggestion(false);
    
    // Focus back to input and set cursor position
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newValue.length, newValue.length);
      }
    }, 0);
  };

  // Handle suggestion click
  const handleSuggestionClick = () => {
    acceptSuggestion();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={onSearchHandler} className='max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition duration-300'>
        <img src={assets.search_icon} alt="search_icon" className='md:w-auto w-10 px-3'/>
        <input
          ref={inputRef}
          type="text"
          placeholder='Search for courses'
          className='w-full h-full outline-none text-gray-500/80 bg-transparent'
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestion && input.length >= 2 && enableAI) {
              setShowSuggestion(true);
            }
          }}
          onBlur={() => {
            // Delay hiding suggestion to allow for clicks
            setTimeout(() => setShowSuggestion(false), 200);
          }}
        />
        
        {/* Loading indicator for AI suggestions */}
        {isLoading && enableAI && (
          <div className="absolute right-20 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        <button type='submit' className='bg-blue-600 hover:bg-blue-700 rounded-r-lg text-white md:px-10 px-7 h-full transition duration-300'>
          Search
        </button>
      </form>

      {/* AI Suggestion dropdown */}
      {showSuggestion && suggestion && enableAI && (
        <div
          ref={suggestionRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
        >
          <div className="p-3">
            <div className="text-sm text-gray-500 mb-2">
              AI Suggestion (Press Tab to accept):
            </div>
            <div 
              className="text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded"
              onClick={handleSuggestionClick}
            >
              <span className="text-gray-400">{input}</span>
              <span className="text-blue-600 font-medium">{suggestion}</span>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint (only show when AI is enabled) */}
      {enableAI && (
        <div className="mt-2 text-xs text-gray-500">
          <span className="mr-4">Tab: Accept suggestion</span>
          <span className="mr-4">Esc: Dismiss</span>
          <span>→: Accept suggestion</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;