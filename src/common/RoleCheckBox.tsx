import React, { useEffect, useState, ChangeEvent } from 'react';

interface RoleCheckBoxProps {
  type: string;
  name?: string;
  value?: string | number;
  initialChecked?: boolean;
  onChange: (checked: boolean) => void;
  readOnly?: boolean;
  disabled?: boolean;
}

const RoleCheckBox: React.FC<RoleCheckBoxProps> = ({
  type,
  name,
  value,
  initialChecked,
  onChange,
  readOnly,
  disabled,
}) => {
  const [checked, setChecked] = useState(initialChecked);

  useEffect(() => {
    // Update the state if initialChecked changes
    setChecked(initialChecked);
  }, [initialChecked]);

  const handleChange = () => {
    // If the checkbox is not read-only and not disabled, update the state
    if (!(type === 'checkbox' && (value === undefined || value === null))) {
      const newCheckedState = !checked;
      setChecked(newCheckedState);
      onChange(newCheckedState);
    }
  };

  return (
    <div id="custom-checkbox">
      <label>
        <input
          type={type}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          readOnly={readOnly}
          disabled={disabled}
        />
        <span className="checkmark"></span>
      </label>
    </div>
  );
};

export default RoleCheckBox;
