import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";

export default function BudgetCell({ value, onUpdate, options }) {
  const [currentValue, setCurrentValue] = useState(value || 0);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const currencySymbol = options?.currency === 'ILS' ? '₪' : '$'; // Example, can be extended

  useEffect(() => {
    setCurrentValue(value || 0);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    const numericValue = parseFloat(currentValue) || 0;
    if (numericValue !== parseFloat(value)) {
      onUpdate(numericValue);
    }
    setCurrentValue(numericValue); // Ensure it's a number after editing
  };

  const handleChange = (e) => {
    setCurrentValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setCurrentValue(value || 0); // Revert to original value
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        type="number"
        value={currentValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-full w-full p-1 border-none focus:ring-1 focus:ring-blue-500 bg-transparent text-sm"
        step="0.01" // For currency
      />
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)} 
      className="cursor-pointer h-full w-full flex items-center text-sm text-gray-700 hover:bg-gray-100/50 px-1 rounded"
    >
      {currencySymbol}{Number(currentValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </div>
  );
}