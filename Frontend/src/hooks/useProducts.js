import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Fetch featured products with their category and brand info.
 * @param {number} limit – number of products to fetch (default 6)
 */
export function useProducts(limit = 6) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        short_description,
        thumbnail_url,
        base_price,
        is_featured,
        status,
        categories ( id, name, slug ),
        brands ( id, name, slug, logo_url )
      `)
      .eq('status', 'active')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)
      .then(({ data, error: err }) => {
        if (!isMounted) return;
        if (err) setError(err.message);
        else setProducts(data || []);
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, [limit]);

  return { products, loading, error };
}

/**
 * Fetch all products with optional category filter.
 */
export function useAllProducts({ categorySlug, limit = 24 } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        short_description,
        thumbnail_url,
        base_price,
        status,
        categories ( id, name, slug ),
        brands ( id, name, slug )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (categorySlug) {
      // join filter via categories slug
      query = query.eq('categories.slug', categorySlug);
    }

    query.then(({ data, error: err }) => {
      if (!isMounted) return;
      if (err) setError(err.message);
      else setProducts(data || []);
      setLoading(false);
    });

    return () => { isMounted = false; };
  }, [categorySlug, limit]);

  return { products, loading, error };
}
