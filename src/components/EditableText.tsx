import React, { useState, useRef, useEffect } from 'react';
import { Edit3, Check, X } from 'lucide-react';
import { sanitizeInput, validate } from '../utils/security';

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  maxLength?: number;
  required?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  className = '',
  multiline = false,
  placeholder = 'Click to edit...',
  as = 'p',
  maxLength = multiline ? 1000 : 200,
  required = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (multiline) {
        const textarea = inputRef.current as HTMLTextAreaElement;
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      } else {
        const input = inputRef.current as HTMLInputElement;
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }
  }, [isEditing, multiline]);

  const validateInput = (inputValue: string): boolean => {
    setError('');

    if (required && !validate.required(inputValue)) {
      setError('This field is required');
      return false;
    }

    if (!validate.maxLength(inputValue, maxLength)) {
      setError(`Maximum ${maxLength} characters allowed`);
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateInput(editValue)) {
      return;
    }

    // Sanitize the input before saving
    const sanitizedValue = multiline 
      ? sanitizeInput.html(editValue) 
      : sanitizeInput.text(editValue);

    onSave(sanitizedValue);
    setIsEditing(false);
    setError('');
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    // Prevent input beyond max length
    if (newValue.length <= maxLength) {
      setEditValue(newValue);
      if (error) {
        validateInput(newValue);
      }
    }
  };

  const Component = as;

  if (isEditing) {
    return (
      <div className="relative group">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 ${error ? 'border-red-300' : 'border-blue-300'} rounded-md p-2 w-full resize-none min-h-[100px]`}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 ${error ? 'border-red-300' : 'border-blue-300'} rounded-md p-2 w-full`}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        )}
        
        {error && (
          <p className="text-red-600 text-xs mt-1">{error}</p>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={!!error}
              className={`p-1 rounded transition-colors ${
                error 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
              title="Save (Enter)"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-600 text-white p-1 rounded hover:bg-red-700 transition-colors"
              title="Cancel (Escape)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <span className="text-xs text-gray-500">
            {editValue.length}/{maxLength}
          </span>
        </div>
        
        {multiline && (
          <p className="text-xs text-gray-500 mt-1">Press Ctrl+Enter to save, Escape to cancel</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <Component 
        className={`${className} cursor-pointer hover:bg-blue-50 rounded-md p-1 transition-colors`} 
        onClick={() => setIsEditing(true)}
      >
        {value || placeholder}
      </Component>
      <button
        onClick={() => setIsEditing(true)}
        className="absolute -top-2 -right-2 bg-blue-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        title="Edit text"
      >
        <Edit3 className="h-3 w-3" />
      </button>
    </div>
  );
};

export default EditableText;