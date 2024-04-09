import React, { useState, ChangeEvent } from 'react';
import '../styles/ToggleBtn.scss';

interface ToggleBtnProps {
  initialActive: boolean;
  onClick: (isActive: boolean) => void;
}

const ToggleBtn: React.FC<ToggleBtnProps> = ({ initialActive, onClick }) => {
  const [active, setActive] = useState(initialActive);

  const handleToggle = () => {
    setActive(!active);
    onClick(!active);
  };

  return (
    <div id='toggle'>
      <label className="switch">
        <input type="checkbox" checked={active} onChange={handleToggle} />
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default ToggleBtn;
