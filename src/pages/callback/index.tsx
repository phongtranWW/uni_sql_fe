import { useAppDispatch } from "@/app/hook";
import { handleAuthCallback } from "@/features/auth/slice";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
const AuthCallback = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasHandled = useRef(false);

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    (async () => {
      const token = searchParams.get("accessToken");

      if (!token) return navigate("/login", { replace: true });

      try {
        await dispatch(handleAuthCallback(token)).unwrap();
        navigate("/", { replace: true });
      } catch {
        navigate("/login", { replace: true });
      }
    })();
  }, [dispatch, navigate, searchParams]);
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Authenticating...</p>
      </div>
    </div>
  );
};
export default AuthCallback;
