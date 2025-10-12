import logo from "@/assets/logo.png";
import { useNavigate } from "react-router";

interface AppLogoProps {
  className?: string;
}

export default function AppLogo({ className }: AppLogoProps) {
  const navigator = useNavigate();
  return (
    <img
      src={logo}
      alt="logo"
      className={className}
      onClick={() => navigator("/")}
    />
  );
}
