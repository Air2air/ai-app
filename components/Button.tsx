import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  text: string;
  loading?: boolean;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
  title,
  text,
  loading,
  onClick,
  ...props
}) => {
  if (loading) {
    return (
      <button disabled>
        <i className="fa fa-spinner fa-spin" /> Loading...
      </button>
    );
  }

  return (
    <button onClick={onClick} {...props} className="button">
      <h1>{title} </h1>
      {text}
    </button>
  );
};

export default Button;
