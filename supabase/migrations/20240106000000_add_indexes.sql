CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_products_is_published ON public.products(is_published);
CREATE INDEX idx_sales_seller_id ON public.sales(seller_id);
CREATE INDEX idx_sales_product_id ON public.sales(product_id);
CREATE INDEX idx_analytics_product_id ON public.analytics(product_id);
CREATE INDEX idx_analytics_created_at ON public.analytics(created_at);
