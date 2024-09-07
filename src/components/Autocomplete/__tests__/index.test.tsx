import { render, screen, fireEvent } from '@testing-library/react';

import Autocomplete, { AutocompleteProps } from '../Autocomplete';

describe('Autocomplete', () => {
  const options = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    { id: 3, name: 'Option 3' },
  ];

  const renderAutocomplete = (props: Partial<AutocompleteProps<{ id: number, name: string }>> = {}) => {
    const defaultProps: AutocompleteProps<{ id: number, name: string }> = {
      options,
      getOptionLabel: (option) => option.name,
      renderOption: (option) => <li>{option.name}</li>,
      onInputChange: jest.fn(),
      onOptionClick: jest.fn(),
      renderInput: (inputProps) => <input {...inputProps} />,
    };

    render(<Autocomplete {...defaultProps} {...props} />);
  };

  it('renders the input field', () => {
    renderAutocomplete();
    const inputElement = screen.getByRole('combobox');
    expect(inputElement).toBeInTheDocument();
  });

  it('opens the dropdown on input focus', () => {
    renderAutocomplete();
    const inputElement = screen.getByRole('combobox');
    fireEvent.focus(inputElement);
    expect(screen.getByRole('list')).toBeVisible();
  });

  it('closes the dropdown on input blur', () => {
    renderAutocomplete();
    const inputElement = screen.getByRole('combobox');
    fireEvent.focus(inputElement);
    fireEvent.blur(inputElement);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('filters options based on input value', () => {
    renderAutocomplete();
    const inputElement = screen.getByRole('combobox');
    fireEvent.focus(inputElement);
    fireEvent.change(inputElement, { target: { value: 'Option 2' } });
    expect(screen.getAllByRole('listitem').length).toBe(1);
    expect(screen.getByText('Option 2')).toBeVisible();
  });

  it('selects an option on click', () => {
    const onOptionClickMock = jest.fn();
    renderAutocomplete({ onOptionClick: onOptionClickMock });
    const inputElement = screen.getByRole('combobox');
    fireEvent.focus(inputElement);
    fireEvent.click(screen.getByText('Option 1'));
    expect(onOptionClickMock).toHaveBeenCalledWith(expect.any(Object), options[0]);
    expect(inputElement).toHaveValue('Option 1');
  });

  it('navigates options with arrow keys', () => {
    renderAutocomplete();
    const inputElement = screen.getByRole('combobox');
    fireEvent.focus(inputElement);

    fireEvent.keyDown(inputElement, { key: 'ArrowDown' });
    expect(screen.getAllByRole('listitem')[0]).toHaveClass('bg-gray-200');

    fireEvent.keyDown(inputElement, { key: 'ArrowDown' });
    fireEvent.keyDown(inputElement, { key: 'ArrowUp' });
    expect(screen.getAllByRole('listitem')[0]).toHaveClass('bg-gray-200');
  });

  it('selects an option with Enter key', () => {
    const onOptionClickMock = jest.fn();
    renderAutocomplete({ onOptionClick: onOptionClickMock });
    const inputElement = screen.getByRole('combobox');
    fireEvent.focus(inputElement);
    fireEvent.keyDown(inputElement, { key: 'ArrowDown' });
    fireEvent.keyDown(inputElement, { key: 'Enter' });
    expect(onOptionClickMock).toHaveBeenCalledWith(expect.any(Object), options[0]);
    expect(inputElement).toHaveValue('Option 1');
  });
});
