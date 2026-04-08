import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

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
        description,
        thumbnail_url,
        base_price,
        is_featured,
        status,
        brands (id, name, slug, logo_url),
        categories!inner (id, name, slug),
        product_images (id, image_url, sort_order),
        product_specifications (id, spec_name, spec_value),
        product_variants (id, variant_name, sku, price, stock_quantity, color, size)
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
        description,
        thumbnail_url,
        base_price,
        is_featured,
        status,
        brands (id, name, slug, logo_url),
        categories!inner (id, name, slug),
        product_images (id, image_url, sort_order),
        product_specifications (id, spec_name, spec_value),
        product_variants (id, variant_name, sku, price, stock_quantity, color, size)
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
