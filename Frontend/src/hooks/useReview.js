import { useState, useEffect } from 'react';
import { reviewService } from '../services/reviewService';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';

export const useReview = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    if (!productId) return;
    setLoading(true);
    const data = await reviewService.getProductReviews(productId);
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // Hàm helper để upload ảnh lên Supabase Storage
  const uploadImages = async (files) => {
    const urls = [];
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `reviews/${fileName}`;

      const { data, error } = await supabase.storage
        .from('products') 
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      
      urls.push(publicUrl);
    }
    return urls;
  };

  const postReview = async (reviewData, imageFiles) => {
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Vui lòng đăng nhập để đánh giá");

      // Bước 1: Upload ảnh nếu có
      let imageUrls = [];
      if (imageFiles && imageFiles.length > 0) {
        imageUrls = await uploadImages(imageFiles);
      }

      // Bước 2: Gửi data + mảng URL ảnh lên Backend
      await reviewService.createReview(session.access_token, {
        ...reviewData,
        images: imageUrls // Gửi mảng các string URL
      });
      
      toast.success("Đánh giá thành công!");
      await fetchReviews();
      return true;
    } catch (error) {
      toast.error(error.message || error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { reviews, loading, submitting, postReview, fetchReviews };
};