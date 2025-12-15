import React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  iconClassName?: string;
}

export function IconButton({ icon, iconClassName = "", className = "", children, ...props }: IconButtonProps) {
  return (
    <button className={`flex items-center justify-center gap-2 ${className}`} {...props}>
      <span className={`material-symbols-outlined ${iconClassName}`}>{icon}</span>
      {children}
    </button>
  );
}
