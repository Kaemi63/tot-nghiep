import { useState, useEffect } from 'react';
import { reviewService } from '../services/reviewService';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';

export const useReview = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Lấy user hiện tại để biết review nào là của mình
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setCurrentUserId(session.user.id);
    });
  }, []);

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

  // Upload ảnh lên Supabase Storage
  const uploadImages = async (files) => {
    const urls = [];
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `reviews/${fileName}`;

      const { error } = await supabase.storage
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

  // Gửi đánh giá mới
  const postReview = async (reviewData, imageFiles) => {
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Vui lòng đăng nhập để đánh giá");

      let imageUrls = [];
      if (imageFiles && imageFiles.length > 0) {
        imageUrls = await uploadImages(imageFiles);
      }

      await reviewService.createReview(session.access_token, {
        ...reviewData,
        images: imageUrls
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

  // Chỉnh sửa đánh giá đã có
  const editReview = async (reviewId, reviewData, imageFiles) => {
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Vui lòng đăng nhập");

      let imageUrls = [];
      if (imageFiles && imageFiles.length > 0) {
        imageUrls = await uploadImages(imageFiles);
      }

      await reviewService.updateReview(session.access_token, reviewId, {
        ...reviewData,
        ...(imageUrls.length > 0 && { images: imageUrls })
      });

      toast.success("Cập nhật đánh giá thành công!");
      await fetchReviews();
      return true;
    } catch (error) {
      toast.error(error.message || error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    reviews,
    loading,
    submitting,
    currentUserId,
    postReview,
    editReview,
    fetchReviews
  };
};
