import React from "react";

interface CustomButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600 focus:ring-green-500"
      } ${className}`}
    >
      {label}
    </button>
  );
};

export default CustomButton;