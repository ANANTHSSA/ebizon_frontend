import React, { ReactNode, MouseEventHandler } from 'react';
import '../styles/SeconderyBtn.scss';
interface SeconderyBtnProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  style?: React.CSSProperties;

  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

const SeconderyBtn: React.FC<SeconderyBtnProps> = ({ children, onClick, disabled,style,type,title }) => {
  console.log(title);
  
  return (
    <button className='secondery-btn' onClick={onClick} disabled={disabled} style={style} type={type} title={title}>
      {children}
    </button>
  );
}

export default SeconderyBtn;
