import { useAppSelector } from "@/app/hook";
import { Navigate, Outlet } from "react-router";
import { Spinner } from "../ui/spinner";
import { selectAuthState } from "@/features/auth/selectors";

const ProtectedRoute = () => {
  const { profile, status } = useAppSelector(selectAuthState);
  if (status === "loading") return <Spinner />;
  return profile ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
