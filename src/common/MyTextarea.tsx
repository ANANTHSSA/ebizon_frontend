
// import React from "react";

// interface MyTextareaProps {
//   initialValue?: string;

//   onChange:any;
// }

// const MyTextarea: React.FC<MyTextareaProps> = ({ initialValue, onChange }) => {


//   return (
//     <textarea
//       id="w3review"
//       name="w3review"
//       rows={2}
//       cols={70}
//       onChange={onChange}
//       defaultValue={initialValue}
//     ></textarea>
//   );
// };

// export default MyTextarea;
import React from "react";
import '../../src/styles/MyTextarea.scss';
interface MyTextareaProps {
  value?: string ;
  onBlur?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number; // Optional rows prop
  cols?: number; // Optional cols prop
  style?: React.CSSProperties;
  className?: string; 
  name?: string;
  disabled?: boolean;
}

const MyTextarea: React.FC<MyTextareaProps> = ({
  value,
  onBlur,
  rows = 2, // Default rows value
  cols = 85, // Default cols value
  style,
  className,
  name,
  disabled
  
}) => {

  

  return (
    <textarea
      name={name}
      rows={rows}
      cols={cols}
      onBlur={onBlur}
     value={value}
      style={style}
      className={className}
      disabled={disabled}
    ></textarea>
  );
};

export default MyTextarea;
