import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  text: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, text, onClick, ...props }) => {
  return (
    <button onClick={onClick} {...props}>
      <h1>{title} </h1>
      {text}
    </button>
  );
};

export default Button;
