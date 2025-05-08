
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useReferralEmails() {
  // Subscribe to new referral creations
  useEffect(() => {
    const channel = supabase
      .channel('public:referrals')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'referrals',
        },
        (payload) => {
          // We're no longer showing toast notifications for automatic referrals
          console.log("New referral created:", payload.new);
        }
      )
      .subscribe();

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
}
