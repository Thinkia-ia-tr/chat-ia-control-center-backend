
import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { TokenVerification } from "@/components/auth/TokenVerification";
import { InvalidToken } from "@/components/auth/InvalidToken";
import { RegistrationForm } from "@/components/auth/RegistrationForm";
import { useInvitationToken } from "@/components/auth/useInvitationToken";

export default function Register() {
  const location = useLocation();
  
  // Extract token from URL parameters
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  
  // Use the invitation token hook
  const { invitationToken, isTokenValid, isVerifyingToken } = useInvitationToken(token);

  // If there's no token, redirect to login
  useEffect(() => {
    if (!token && !isVerifyingToken) {
      toast.error("Se requiere una invitación para registrarse");
    }
  }, [token, isVerifyingToken]);

  if (!invitationToken && !isVerifyingToken) {
    return <Navigate to="/auth/login" />;
  }

  if (isVerifyingToken) {
    return <TokenVerification />;
  }

  if (!isTokenValid) {
    return <InvalidToken />;
  }

  return <RegistrationForm invitationToken={invitationToken as string} />;
}
