import React from "react";
import { Button } from "@/components/atoms/Button/Button";
import type { LucideIcon } from "lucide-react";

interface NavigationButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "sky" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  variant = "sky",
  size = "lg",
  className,
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={className}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </Button>
  );
};
