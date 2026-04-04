import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

/**
 * Fetch categories tree from Supabase.
 * Returns top-level categories with their children.
 */
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    supabase
      .from('categories')
      .select('id, name, slug, parent_id, image_url, description, status')
      .eq('status', 'active')
      .order('name', { ascending: true })
      .then(({ data, error: err }) => {
        if (!isMounted) return;
        if (err) {
          setError(err.message);
          setLoading(false);
          return;
        }

        const all = data || [];

        // Build tree: top-level = parent_id is null
        const topLevel = all.filter((c) => c.parent_id === null);
        const withChildren = topLevel.map((cat) => ({
          ...cat,
          children: all.filter((c) => c.parent_id === cat.id),
        }));

        setCategories(withChildren);
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  return { categories, loading, error };
}
