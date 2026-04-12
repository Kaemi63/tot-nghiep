import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export const useAuthProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setToken(session.access_token);
          
          const { data, error } = await supabase
            .from('profiles')
            .select('fullname, avatar_url')
            .eq('id', session.user.id)
            .single();

          if (!error) setUserProfile(data);
        }
      } catch (err) {
        console.error("Auth Hook Error:", err);
      } finally {
        setLoading(false);
      }
    };

    getSessionAndProfile();
  }, []);

  return { userProfile, token, loading };
};