import { useAppDispatch, useAppSelector } from "@/app/hook";
import { authService } from "@/features/auth/service";
import { clearError, logout } from "@/features/auth/slice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { profile, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth,
  );
  const loginWithGoogle = () => {
    authService.redirectToGoogle();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    profile,
    isAuthenticated,
    isLoading,
    error,
    loginWithGoogle,
    logout: handleLogout,
    clearError: handleClearError,
  };
};
