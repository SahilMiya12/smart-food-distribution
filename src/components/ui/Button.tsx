import { cn } from "@/lib/utils";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "secondary";
}

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-emerald-700 text-white hover:bg-emerald-800",
    outline:
      "border border-emerald-700 text-emerald-700 hover:bg-emerald-50",
    secondary:
      "bg-orange-500 text-white hover:bg-orange-600",
  };

  return (
    <button
      className={cn(
        "rounded-xl px-5 py-3 font-medium transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}