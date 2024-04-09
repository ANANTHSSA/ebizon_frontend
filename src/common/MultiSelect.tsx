import React, { ChangeEvent } from 'react';
import '../../src/styles/MultiSelect.scss';
interface MultiSelectProps {
  type: string;
  name?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ type, name, value, onChange, checked, disabled }) => {
  return (
    <div id="custom-checkbox">
      <label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          checked={checked}
          disabled={disabled}
        />
        <span className="checkmark"></span>
      </label>
    </div>
  );
};

export default MultiSelect;
