// import React, { ReactNode, MouseEventHandler } from 'react';
// import '../../src/styles/PrimaryBtn.scss';
// interface PrimaryBtnProps {
//   children: ReactNode;
//   onClick?: MouseEventHandler<HTMLButtonElement>;
//   disabled?: boolean;
//   style?: React.CSSProperties;
//   type?: 'button' | 'submit' | 'reset';
//   className
// }

// const PrimaryBtn: React.FC<PrimaryBtnProps> = ({ children, onClick, disabled,style,type,className }) => {
//   return (
//     <button className='primary-btn' onClick={onClick} disabled={disabled} style={style} type={type}>
//       {children}
//     </button>
//   );
// }

// export default PrimaryBtn;
import React, { ReactNode, MouseEventHandler } from 'react';
import '../../src/styles/PrimaryBtn.scss';

interface PrimaryBtnProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  className?: string; // Add the correct type for className
  title: string;
}

const PrimaryBtn: React.FC<PrimaryBtnProps> = ({ children, onClick, disabled, style, type, className, title }) => {
  return (
    <button className={`primary-btn ${className}`} onClick={onClick} disabled={disabled} style={style} type={type} title={title}>
      {children}
    </button>
  );
}

export default PrimaryBtn;
