
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseInvitationTokenResult {
  invitationToken: string | null;
  isTokenValid: boolean;
  isVerifyingToken: boolean;
}

export const useInvitationToken = (token: string | null): UseInvitationTokenResult => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);
  const [invitationToken, setInvitationToken] = useState<string | null>(token);

  useEffect(() => {
    if (token) {
      setInvitationToken(token);
      verifyInvitationToken(token);
    } else {
      setIsVerifyingToken(false);
      setIsTokenValid(false);
    }
  }, [token]);

  const verifyInvitationToken = async (token: string) => {
    try {
      const { data, error } = await supabase
        .from('registration_invitations')
        .select('*')
        .eq('token', token)
        .eq('is_used', false)
        .single();

      if (error) throw error;

      // Check if the invitation has expired
      const now = new Date();
      const expiresAt = new Date(data.expires_at);

      if (expiresAt < now) {
        setIsTokenValid(false);
        toast.error("El enlace de invitación ha expirado");
      } else {
        setIsTokenValid(true);
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      setIsTokenValid(false);
      toast.error("El enlace de invitación no es válido");
    } finally {
      setIsVerifyingToken(false);
    }
  };

  return {
    invitationToken,
    isTokenValid,
    isVerifyingToken
  };
};
