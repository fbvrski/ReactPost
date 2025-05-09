interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "neutral" | "icon";
  isLoading?: boolean;
  children: React.ReactNode;
}

const baseButtonStyles =
  "inline-flex items-center justify-center text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 cursor-pointer";

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  type = "button",
  ...rest
}) => {
  let variantStyles: string;

  switch (variant) {
    case "neutral":
      variantStyles =
        "px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500";
      break;
    case "icon":
      variantStyles =
        "p-1 rounded-full text-gray-400 hover:text-gray-700 focus:ring-blue-500";
      break;
    case "primary":
    default:
      variantStyles =
        "px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
      break;
  }

  return (
    <button
      type={type}
      className={`${baseButtonStyles} ${variantStyles} ${className}`}
      disabled={isLoading || rest.disabled}
      {...rest}
    >
      {isLoading ? "Loading…" : children}
    </button>
  );
};
