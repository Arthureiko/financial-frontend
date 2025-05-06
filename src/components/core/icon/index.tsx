"use client";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface IconProps {
  name: string;
  style?: React.CSSProperties;
}

export function Icon({ name, style }: IconProps) {
  if (name === "eye") return <FaEye style={style} />;
  if (name === "eye_closed") return <FaEyeSlash style={style} />;
  return null;
}
