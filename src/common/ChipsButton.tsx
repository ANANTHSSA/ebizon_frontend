import React, { ReactNode, MouseEventHandler } from 'react';
import '../styles/ChipsButton.scss';

interface ChipsButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  className?: string; // Add the correct type for className
  title?: string;
}

const ChipsButton: React.FC<ChipsButtonProps> = ({ children, onClick, disabled, style, type, className, title }) => {
  return (
    <button className={`chips-button ${className}`} onClick={onClick} disabled={disabled} style={style} type={type} title={title}>
      {children}
    </button>
  );
}

export default  ChipsButton;
