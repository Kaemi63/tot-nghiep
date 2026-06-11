const supabase = require('../config/supabaseClient');

// Helper dùng chung lọc các đơn hàng hợp lệ đem lại doanh thu thực tế
const validOrderCondition = (queryBuilder) => {
  return queryBuilder
    .neq('order_status', 'cancelled')
    .eq('payment_status', 'paid');
};

exports.getRevenueDashboard = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // 1. TỔNG DOANH THU & ĐƠN HÀNG (Tổng quan)
    let baseOrderQuery = supabase
      .from('orders')
      .select('id, total_amount, subtotal, discount_amount, created_at');
    
    baseOrderQuery = validOrderCondition(baseOrderQuery);
    if (startDate) baseOrderQuery = baseOrderQuery.gte('created_at', startDate);
    if (endDate) baseOrderQuery = baseOrderQuery.lte('created_at', endDate);

    const { data: orders, error: ordersError } = await baseOrderQuery;
    if (ordersError) throw ordersError;

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

    // 2. DOANH THU THEO THỜI GIAN (Năm, Quý, Tháng)
    const revenueTimeline = {};
    orders.forEach(order => {
      const date = new Date(order.created_at);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const monthKey = `${year}-${String(month).padStart(2, '0')}`;

      if (!revenueTimeline[monthKey]) revenueTimeline[monthKey] = 0;
      revenueTimeline[monthKey] += Number(order.total_amount);
    });

    const monthlyRevenueArray = Object.keys(revenueTimeline).map(key => ({
      period: key,
      revenue: revenueTimeline[key]
    })).sort((a, b) => a.period.localeCompare(b.period));

    // LẤY DỮ LIỆU LIÊN KẾT ĐỂ PHỤC VỤ CÁC MỤC 3, 4, 5
    let itemsQuery = supabase
      .from('order_items')
      .select(`
        id, total, quantity, product_id, product_name,
        orders!inner(order_status, payment_status, created_at),
        products(
          category_id, brand_id,
          categories(name),
          brands(name, logo_url)
        )
      `);

    // SỬA LỖI TẠI ĐÂY: Thay "->" bằng "." để gán điều kiện lọc lên bảng nhúng liên kết (!inner)
    itemsQuery = itemsQuery
      .neq('orders.order_status', 'cancelled')
      .eq('orders.payment_status', 'paid');
      
    if (startDate) itemsQuery = itemsQuery.gte('orders.created_at', startDate);
    if (endDate) itemsQuery = itemsQuery.lte('orders.created_at', endDate);

    const { data: orderItems, error: itemsError } = await itemsQuery;
    if (itemsError) throw itemsError;

    const categoryRevenue = {};
    const productRevenue = {};
    const brandRevenue = {};

    orderItems.forEach(item => {
      const itemTotal = Number(item.total);
      const itemQty = Number(item.quantity);
      
      const prodInfo = item.products;
      const orderDate = new Date(item.orders.created_at);
      const monthStr = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;

      if (prodInfo) {
        // 3. Doanh thu theo từng NHÓM SẢN PHẨM (categories)
        if (prodInfo.categories) {
          const catName = prodInfo.categories.name;
          if (!categoryRevenue[catName]) categoryRevenue[catName] = { revenue: 0, quantity: 0 };
          categoryRevenue[catName].revenue += itemTotal;
          categoryRevenue[catName].quantity += itemQty;
        }

        // 4. Doanh thu theo TỪNG SẢN PHẨM + THEO THỜI GIAN
        const prodId = item.product_id;
        const prodName = item.product_name;
        if (!productRevenue[prodId]) {
          productRevenue[prodId] = { id: prodId, name: prodName, total_revenue: 0, total_quantity: 0, timeline: {} };
        }
        productRevenue[prodId].total_revenue += itemTotal;
        productRevenue[prodId].total_quantity += itemQty;
        
        if (!productRevenue[prodId].timeline[monthStr]) productRevenue[prodId].timeline[monthStr] = 0;
        productRevenue[prodId].timeline[monthStr] += itemTotal;

        // 5. Doanh thu theo TÊN HÃNG (brands)
        if (prodInfo.brands) {
          const brandName = prodInfo.brands.name;
          const logo = prodInfo.brands.logo_url;
          if (!brandRevenue[brandName]) brandRevenue[brandName] = { brand_name: brandName, logo_url: logo, revenue: 0, quantity: 0 };
          brandRevenue[brandName].revenue += itemTotal;
          brandRevenue[brandName].quantity += itemQty;
        }
      }
    });

    // Chuẩn hóa định dạng mảng để trả về cho Frontend vẽ đồ thị dễ dàng
    const revenueByCategory = Object.keys(categoryRevenue).map(name => ({
      category_name: name,
      ...categoryRevenue[name]
    })).sort((a, b) => b.revenue - a.revenue);

    const revenueByProduct = Object.values(productRevenue)
      .sort((a, b) => b.total_revenue - a.total_revenue);

    const revenueByBrand = Object.values(brandRevenue)
      .sort((a, b) => b.revenue - a.revenue);

    // TRẢ DỮ LIỆU TỔNG HỢP VỀ CLIENT
    return res.status(200).json({
      success: true,
      meta: { startDate: startDate || null, endDate: endDate || null },
      summary: {
        total_revenue: totalRevenue,
        total_orders: totalOrders,
        average_order_value: averageOrderValue
      },
      analytics: {
        revenue_by_time: monthlyRevenueArray,       
        revenue_by_category: revenueByCategory,     
        revenue_by_product: revenueByProduct,      
        revenue_by_brand: revenueByBrand            
      }
    });

  } catch (error) {
    console.error("Lỗi phân tích Dashboard doanh thu:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};