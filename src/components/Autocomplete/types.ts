export type AutocompleteProps<Value> = {
  options: Value[];
  getOptionLabel?: (option: Value) => string;
  renderOption: (option: Value) => React.ReactNode;
  onInputChange: (event: React.SyntheticEvent, value: string) => void;
  onOptionClick: (event: React.SyntheticEvent, value: Value) => void;
  onOpen?: (event: React.SyntheticEvent) => void;
  onClose?: (event: React.SyntheticEvent) => void;
  renderInput: (inputProps: React.HTMLProps<HTMLInputElement>) => React.ReactNode;
};
