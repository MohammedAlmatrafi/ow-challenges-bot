import { twMerge } from "tailwind-merge";

interface ButtonType extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;
}

const Button = ({ children, onClick, className, ...props }: ButtonType) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "bg-green-600 text-white py-1 px-2 rounded-md hover:bg-green-700 active:scale-95 duration-100 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
