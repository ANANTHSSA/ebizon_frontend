
import React, { ChangeEvent,CSSProperties } from "react";
import '../styles/RadioBtn.scss';

interface RadioBtnProps {
 
  name?: string;
  value?: string;
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  style?: CSSProperties
}

const RadioBtn: React.FC<RadioBtnProps> = ({
  name,
  value,
  checked,
  onChange,
  disabled,
  style
}) => {
  return (
    
    <div className="radio-buttons">
  <label className="radio-button">
    <input type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      style={style}
    />
    <div className="radio-circle"></div>
    <span className="radio-label">{value}</span>
  </label>
</div>
  );
};

export default RadioBtn;
