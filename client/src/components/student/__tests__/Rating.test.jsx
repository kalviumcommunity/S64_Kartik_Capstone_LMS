import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Rating from '../Rating.jsx';

describe('Rating Component', () => {
  test('renders 5 stars by default', () => {
    render(<Rating />);
    const stars = screen.getAllByText('★');
    expect(stars).toHaveLength(5);
  });

  test('renders with initial rating', () => {
    render(<Rating initialRating={3} />);
    const stars = screen.getAllByText('★');
    
    // First 3 stars should be yellow (rated), last 2 should be gray
    expect(stars[0]).toHaveClass('text-yellow-500');
    expect(stars[1]).toHaveClass('text-yellow-500');
    expect(stars[2]).toHaveClass('text-yellow-500');
    expect(stars[3]).toHaveClass('text-gray-400');
    expect(stars[4]).toHaveClass('text-gray-400');
  });

  test('calls onRate callback when star is clicked', () => {
    const mockOnRate = jest.fn();
    render(<Rating onRate={mockOnRate} />);
    
    const stars = screen.getAllByText('★');
    fireEvent.click(stars[2]); // Click 3rd star
    
    expect(mockOnRate).toHaveBeenCalledWith(3);
  });

  test('updates rating state when star is clicked', () => {
    const mockOnRate = jest.fn();
    render(<Rating onRate={mockOnRate} />);
    
    const stars = screen.getAllByText('★');
    
    // Initially all stars should be gray
    stars.forEach(star => {
      expect(star).toHaveClass('text-gray-400');
    });
    
    // Click 4th star
    fireEvent.click(stars[3]);
    
    // First 4 stars should now be yellow
    expect(stars[0]).toHaveClass('text-yellow-500');
    expect(stars[1]).toHaveClass('text-yellow-500');
    expect(stars[2]).toHaveClass('text-yellow-500');
    expect(stars[3]).toHaveClass('text-yellow-500');
    expect(stars[4]).toHaveClass('text-gray-400');
  });

  test('does not call onRate when no callback is provided', () => {
    render(<Rating />);
    
    const stars = screen.getAllByText('★');
    fireEvent.click(stars[0]);
    
    // Should not throw error when no onRate callback is provided
    expect(() => {
      fireEvent.click(stars[0]);
    }).not.toThrow();
  });

  test('updates rating when initialRating prop changes', () => {
    const { rerender } = render(<Rating initialRating={2} />);
    
    let stars = screen.getAllByText('★');
    expect(stars[0]).toHaveClass('text-yellow-500');
    expect(stars[1]).toHaveClass('text-yellow-500');
    expect(stars[2]).toHaveClass('text-gray-400');
    
    // Update initialRating prop
    rerender(<Rating initialRating={4} />);
    
    stars = screen.getAllByText('★');
    expect(stars[0]).toHaveClass('text-yellow-500');
    expect(stars[1]).toHaveClass('text-yellow-500');
    expect(stars[2]).toHaveClass('text-yellow-500');
    expect(stars[3]).toHaveClass('text-yellow-500');
    expect(stars[4]).toHaveClass('text-gray-400');
  });

  test('handles zero initial rating', () => {
    render(<Rating initialRating={0} />);
    const stars = screen.getAllByText('★');
    
    // All stars should be gray when rating is 0
    stars.forEach(star => {
      expect(star).toHaveClass('text-gray-400');
    });
  });

  test('handles undefined initial rating', () => {
    render(<Rating initialRating={undefined} />);
    const stars = screen.getAllByText('★');
    
    // All stars should be gray when rating is undefined
    stars.forEach(star => {
      expect(star).toHaveClass('text-gray-400');
    });
  });
}); 