import React, { CSSProperties, ReactNode } from "react";

type Variant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" | "small";

interface TypographyProps {
  variant?: Variant;
  size?: number;
  weight?: number;
  color?: string;
  children: ReactNode;
  style?: CSSProperties;
}

const styles: Record<Variant, CSSProperties> = {
  h1: {
    fontSize: "2rem",
    fontWeight: "bold",
  },
  h2: {
    fontSize: "1.75rem",
    fontWeight: "bold",
  },
  h3: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  h4: {
    fontSize: "1.25rem",
    fontWeight: "bold",
  },
  h5: {
    fontSize: "1.125rem",
    fontWeight: "bold",
    lineHeight: "150%",
  },
  h6: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
  body: {
    fontSize: "1rem",
    fontWeight: "normal",
  },
  small: {
    fontSize: "0.875rem",
    fontWeight: "normal",
  },
};

export function Typography({
  variant = "body",
  size,
  color = "#221C35",
  children,
  weight,
  style,
  ...props
}: TypographyProps) {
  const textStyle = {
    ...styles[variant],
    fontSize: size ? `${size}rem` : styles[variant].fontSize,
    fontWeight: weight ? weight : styles[variant].fontWeight,
    color,
    ...style,
  };

  const Element =
    variant === "h1" ||
    variant === "h2" ||
    variant === "h3" ||
    variant === "h4" ||
    variant === "h5" ||
    variant === "h6"
      ? variant
      : "p";

  return (
    <Element style={textStyle} {...props}>
      {children}
    </Element>
  );
}
