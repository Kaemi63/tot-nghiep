import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Fetch active brands from Supabase.
 */
export function useBrands(limit = 12) {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    supabase
      .from('brands')
      .select('id, name, slug, logo_url, description')
      .eq('status', 'active')
      .order('name', { ascending: true })
      .limit(limit)
      .then(({ data, error: err }) => {
        if (!isMounted) return;
        if (err) setError(err.message);
        else setBrands(data || []);
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, [limit]);

  return { brands, loading, error };
}
