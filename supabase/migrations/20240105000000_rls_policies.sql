ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_select_public" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "products_select_own" ON public.products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "products_insert_own" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "products_update_own" ON public.products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "products_delete_own" ON public.products
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "products_select_published" ON public.products
  FOR SELECT USING (is_published = true);

CREATE POLICY "sales_select_own" ON public.sales
  FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "sales_insert_any" ON public.sales
  FOR INSERT WITH CHECK (true);

CREATE POLICY "analytics_select_own" ON public.analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "analytics_insert_any" ON public.analytics
  FOR INSERT WITH CHECK (true);
