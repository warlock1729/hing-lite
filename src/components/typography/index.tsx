import React from "react";
import { cn } from "@/lib/utils";

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2"
  | "button"
  | "caption"
  | "overline";

type TypographyAlign = "inherit" | "left" | "center" | "right" | "justify";

type TypographyColor =
  | "initial"
  | "inherit"
  | "primary"
  | "secondary"
  | "textPrimary"
  | "textSecondary"
  | "error";

interface TypographyProps {
  children: React.ReactNode;
  className?: string; // Additional Tailwind or custom styles
  variant?: TypographyVariant;
  component?: React.ElementType;
  align?: TypographyAlign;
  color?: TypographyColor;
  gutterBottom?: boolean;
  noWrap?: boolean;
  paragraph?: boolean;
}

interface TypographyPropsForLabel extends TypographyProps {
  htmlFor?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  className,
  variant = "body1",
  component,
  align = "inherit",
  color = "initial",
  gutterBottom = false,
  noWrap = false,
  paragraph = false,
}) => {
  // Determine the component to render
  const Component =
    component ||
    (({
      h1: "h1",
      h2: "h2",
      h3: "h3",
      h4: "h4",
      h5: "h5",
      h6: "h6",
      subtitle1: "h6",
      subtitle2: "h6",
      body1: "p",
      body2: "p",
      button: "span",
      caption: "span",
      overline: "span",
    }[variant] || "p") as React.ElementType);

  // Variant styles
  const variantStyles = {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-semibold",
    h3: "text-2xl font-medium",
    h4: "text-xl font-medium",
    h5: "text-lg font-medium",
    h6: "text-base font-medium",
    subtitle1: "text-lg font-normal",
    subtitle2: "text-base font-medium",
    body1: "text-base font-normal",
    body2: "text-sm font-normal",
    button: "text-sm font-medium uppercase",
    caption: "text-xs font-normal",
    overline: "text-xs font-medium uppercase tracking-wider",
  }[variant];

  // Alignment styles
  const alignStyles = {
    inherit: "",
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  }[align];

  // Color styles
  const colorStyles = {
    initial: "",
    inherit: "",
    primary: "text-blue-400",
    secondary: "text-purple-400",
    textPrimary: "text-white",
    textSecondary: "text-gray-400",
    error: "text-red-400",
  }[color];

  // Additional styles
  const gutterBottomStyle = gutterBottom ? "mb-2" : "";
  const noWrapStyle = noWrap
    ? "whitespace-nowrap overflow-hidden text-ellipsis"
    : "";
  const paragraphStyle = paragraph ? "mb-4" : "";

  return (
    <Component
      className={cn(
        variantStyles,
        alignStyles,
        colorStyles,
        gutterBottomStyle,
        noWrapStyle,
        paragraphStyle,
        className
      )}
    >
      {children}
    </Component>
  );
};

// Legacy interface for backward compatibility
interface TypographyPropsForLabel extends TypographyProps {
  htmlFor?: string;
}

// Heading 1 Component
export const Heading1: React.FC<TypographyProps> = ({
  children,
  className,
}) => {
  return (
    <Typography variant="h1" className={className}>
      {children}
    </Typography>
  );
};

// Heading 2 Component
export const Heading2: React.FC<TypographyProps> = ({
  children,
  className,
}) => {
  return (
    <Typography variant="h2" className={className}>
      {children}
    </Typography>
  );
};

// Heading 3 Component
export const Heading3: React.FC<TypographyProps> = ({
  children,
  className,
}) => {
  return (
    <Typography variant="h3" className={className}>
      {children}
    </Typography>
  );
};

export const Heading5: React.FC<TypographyProps> = ({
  children,
  className,
}) => {
  return (
    <Typography variant="h5" className={className}>
      {children}
    </Typography>
  );
};

// Paragraph Component
export const Paragraph: React.FC<TypographyProps> = ({
  children,
  className,
}) => {
  return (
    <Typography variant="body1" className={className}>
      {children}
    </Typography>
  );
};

// Small Text Component
export const SmallText: React.FC<TypographyProps> = ({
  children,
  className,
}) => {
  return (
    <Typography
      variant="body2"
      component="small"
      className={cn("font-light", className)}
    >
      {children}
    </Typography>
  );
};

// Caption Component
export const Caption: React.FC<TypographyProps> = ({ children, className }) => {
  return (
    <Typography variant="caption" className={cn("font-light", className)}>
      {children}
    </Typography>
  );
};

// Lead Text Component
export const LeadText: React.FC<TypographyProps> = ({
  children,
  className,
}) => {
  return (
    <Typography
      variant="subtitle1"
      className={cn("font-light leading-relaxed", className)}
    >
      {children}
    </Typography>
  );
};

// Label text Component
export const LabelText: React.FC<TypographyPropsForLabel> = ({
  children,
  className,
  htmlFor,
}) => {
  return (
    <Typography
      variant="body2"
      component="label"
      className={cn("text-slate-100/80", className)}
      {...(htmlFor && { component: "label", htmlFor })}
    >
      {children}
    </Typography>
  );
};
