import clsx from 'clsx';
import React, { useState, useRef } from 'react';

import type { AutocompleteProps } from './types';

const defaultGetOptionLabel = <Value,>(option: Value) => {
  return (option as any).label ?? option;
};

const Autocomplete = <Value,>({
  options,
  onInputChange,
  onOptionClick,
  renderOption,
  onOpen,
  onClose,
  renderInput,
  getOptionLabel = defaultGetOptionLabel,
}: AutocompleteProps<Value>) => {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const ignoreBlur = useRef(false);

  const handleOpen = (event: React.SyntheticEvent) => {
    if (open) {
      return;
    }

    setOpen(true);
    
    if (onOpen) {
      onOpen(event);
    }
  };

  const handleClose = (event: React.SyntheticEvent) => {
    if (!open) {
      return;
    }

    setOpen(false);
    setActiveIndex(-1);
    
    if (onClose) {
      onClose(event);
    }
  };

  const handleInputFocus = (event: React.SyntheticEvent) => {
    handleOpen(event);
  };

  const handleInputBlur = (event: React.SyntheticEvent) => {
    if (ignoreBlur.current) {
      inputRef.current?.focus();
      return;
    }

    handleClose(event);
  };

  const handleInputChange = (event: React.SyntheticEvent) => {
    const newValue = (event.target as HTMLInputElement).value;

    if (inputValue !== newValue) {
      setInputValue(newValue);

      if (onInputChange) {
        onInputChange(event, newValue);
      }
    }
    
    if (newValue !== '') {
      handleOpen(event);
    } else {
      setActiveIndex(-1);
    }
  };

  const handleInputKeyDown = (event: React.SyntheticEvent) => {
    if ((event as React.KeyboardEvent).key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((activeIndex + 1) % getFilteredOptions(options).length);
    } else if ((event as React.KeyboardEvent).key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((activeIndex - 1 + getFilteredOptions(options).length) % getFilteredOptions(options).length);
    } else if ((event as React.KeyboardEvent).key === 'Enter') {
      const activeOption = getFilteredOptions(options)[activeIndex];

      if (activeOption) {
        event.preventDefault();
        handleOptionClick(event, activeOption);
      }
    }
  };

  const handleOptionClick = (event: React.SyntheticEvent, item: Value) => {
    setInputValue(getOptionLabel(item));

    ignoreBlur.current = false;
    inputRef.current?.blur();

    if (onOptionClick) {
      onOptionClick(event, item);
    }
  };

  const getFilteredOptions = (opts: Value[]): Value[] => {
    return opts.filter((option) =>
      getOptionLabel(option).toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const renderOptions = () => {
    const filteredOptions = getFilteredOptions(options);
    const elements = filteredOptions.map((option, index) => {
      const element = renderOption(option);

      return React.cloneElement(element as any, {
        key: index,
        role: 'listitem',
        className: clsx('p-2 cursor-pointer', { 'bg-gray-200': index === activeIndex }),
        onClick: (event: React.SyntheticEvent) => handleOptionClick(event, option),
      });
    });

    return React.cloneElement(<ul />, {
      role: 'list',
      className: 'absolute w-full border z-10 shadow-lg bg-white',
      onTouchStart: () => ignoreBlur.current = true,
      onMouseEnter: () => ignoreBlur.current = true,
      onMouseLeave: () => ignoreBlur.current = false,
      children: elements,
    });
  };

  return (
    <div className="relative">
      {renderInput({
        role: 'combobox',
        'aria-autocomplete': 'list',
        'aria-expanded': open,
        autoComplete: 'off',
        ref: inputRef,
        onFocus: handleInputFocus,
        onBlur: handleInputBlur,
        onChange: handleInputChange,
        onKeyDown: handleInputKeyDown,
        value: inputValue,
      })}
      {open && renderOptions()}
    </div>
  );
};

export default Autocomplete;
