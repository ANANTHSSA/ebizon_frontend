

import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import "../styles/PasswordInput.scss";

interface PasswordInputProps {
  value?: any;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onValidationChange?: Dispatch<SetStateAction<boolean>>;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange }) => {
  const [passwordValid, setPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    // Example password validation logic
    const passwordIsValid = e.target.value.length >= 8; 
    setPasswordValid(passwordIsValid);
  };
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
    <div style={{ position: "relative", marginBottom: "10px" }}>
    <input
            type={showPassword ? "text" : "password"}
        value={value}
        placeholder="Enter your password"
        onChange={handleChange}
        className="custom-input"
      />
      <div
        className="custom-icon"
        onClick={handleTogglePassword}
      >
        {showPassword ? "👁" : "👁️‍🗨"}
      </div>
    </div>
      
     
    </>
  );
};

export default PasswordInput;




