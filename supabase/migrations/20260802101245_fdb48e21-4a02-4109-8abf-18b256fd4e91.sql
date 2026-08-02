-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin','editor','user');
CREATE TYPE public.content_status AS ENUM ('draft','published');
CREATE TYPE public.page_format AS ENUM ('html','markdown');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "user_roles_admin_write" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- PORTFOLIO
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  cover_url TEXT,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'Web',
  tech TEXT[] NOT NULL DEFAULT '{}',
  client TEXT,
  year INTEGER,
  live_url TEXT,
  repo_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  status public.content_status NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_items TO authenticated;
GRANT ALL ON public.portfolio_items TO service_role;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio_public_read" ON public.portfolio_items FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "portfolio_admin_read" ON public.portfolio_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "portfolio_admin_write" ON public.portfolio_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_portfolio_updated BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- BLOG
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  cover_url TEXT,
  body TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  status public.content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  reading_minutes INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog_public_read" ON public.blog_posts FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "blog_admin_read" ON public.blog_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "blog_admin_write" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_blog_updated BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PAGES
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  format public.page_format NOT NULL DEFAULT 'markdown',
  body TEXT NOT NULL DEFAULT '',
  status public.content_status NOT NULL DEFAULT 'draft',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT ALL ON public.pages TO service_role;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pages_public_read" ON public.pages FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "pages_admin_read" ON public.pages FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "pages_admin_write" ON public.pages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_pages_updated BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CONTACT
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  handled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_anyone_insert" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contact_admin_read" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "contact_admin_write" ON public.contact_messages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- SEED PORTFOLIO
INSERT INTO public.portfolio_items (slug,title,summary,description,cover_url,category,tech,client,year,live_url,featured,status,sort_order) VALUES
('faraji-logistics','Faraji Logistics','Company website for a leading Bangladeshi supply chain and freight forwarding firm.','## Overview\n\nFaraji Logistics is one of the leading Supply Chain Management companies in Bangladesh, with a decade of expertise in transportation, freight forwarding and customs clearing.\n\n## What I built\n\n- Corporate website with service taxonomy and news section\n- Shipment tracking entry point wired to their internal system\n- Quote request funnel with lead capture\n- Fully responsive layout and on-page SEO\n\n## Result\n\nA credible digital front door that converts enquiries into quote requests.','/__l5e/assets-v1/64992cca-4f9e-4782-b05d-4fe727eb40a2/faraji.jpg','Company Website','{"React","Tailwind CSS","Node.js","SEO"}','Faraji Logistics',2024,'https://farajilogistic.com',true,'published',1),
('gulf-union-gate','Gulf Union Gate','Corporate site for a business consultancy operating across the Gulf region.','## Overview\n\nGulf Union Gate helps companies build brand awareness and credibility while connecting with customers, stakeholders and potential employees.\n\n## What I built\n\n- Dark, high-contrast brand experience with animated hero\n- Metrics band with animated counters\n- Consultation booking flow\n- Multi-device responsive layout\n\n## Result\n\nA premium consultancy presence that signals scale and trust.','/__l5e/assets-v1/20875b58-28a8-448b-8fa8-f592c6159a4c/gulf-union.jpg','Company Website','{"React","Framer Motion","Tailwind CSS"}','Gulf Union Gate',2024,'https://gulfuniongate.com',true,'published',2),
('red-bolt-it','Red Bolt IT','Tech agency website with a playful, motion-led identity.','## Overview\n\nRedBolt IT turns ideas into real products through web and software development services.\n\n## What I built\n\n- Motion-led hero with gradient blob and 3D emoji accents\n- Service and portfolio architecture\n- Sticky social/contact rail\n- Products section with lead capture\n\n## Result\n\nA distinctive agency brand that stands out in a crowded market.','/__l5e/assets-v1/41d6f11b-e7a9-4354-bcb5-167b7961e04d/redbolt.jpg','Tech Agency','{"React","GSAP","Tailwind CSS"}','RedBolt IT',2023,'https://redboltit.com',true,'published',3),
('tachtonic','TachTonic','Full e-commerce storefront for a consumer electronics retailer.','## Overview\n\nTachTonic is a multi-category electronics store covering laptops, phones, cameras, drones and audio.\n\n## What I built\n\n- Category tree with mega navigation and faceted filtering\n- Promotional carousels and countdown deal blocks\n- Cart, wishlist, compare and multi-currency support\n- Checkout and order tracking\n\n## Result\n\nA complete retail experience built for catalogue scale.','/__l5e/assets-v1/aa26511a-06d4-4fb0-8de4-a973c7b7f486/tachtonic.jpg','E-Commerce','{"React","TypeScript","PostgreSQL","Stripe"}','TachTonic',2024,NULL,true,'published',4),
('wanchi-steel','Wanchi Group','Group-of-companies website for a 50-year industrial machinery manufacturer.','## Overview\n\nWanchi Steel Industrial Co. Ltd carries a 50-year legacy of innovation in heavy industrial machinery manufacturing.\n\n## What I built\n\n- Group structure with nested company and facility sections\n- Product category taxonomy\n- Corporate responsibility and facilities showcases\n- Bilingual-ready content structure with quote funnel\n\n## Result\n\nA heavy-industry presence that communicates scale and reliability.','/__l5e/assets-v1/208b692d-2f99-43c8-ada4-977805f89c92/wanchi.jpg','Group of Company','{"React","Tailwind CSS","CMS"}','Wanchi Steel',2024,NULL,true,'published',5),
('aidite-dental','Aidite Dental','Product-led website for a dental materials manufacturer.','## Overview\n\nAidite manufactures zirconia and advanced ceramic materials for dentistry and medical implants.\n\n## What I built\n\n- Product catalogue with material specification pages\n- Resource and technical documentation hub\n- Clean clinical visual language with search\n- Distributor and contact routing\n\n## Result\n\nA technical product site that serves both clinicians and distributors.','/__l5e/assets-v1/91f0cafd-e6bf-432e-962c-1a08eb5ff49f/aidite.jpg','Dental / Medical','{"React","Tailwind CSS","Search"}','Aidite Dental',2023,NULL,true,'published',6);

-- SEED BLOG
INSERT INTO public.blog_posts (slug,title,excerpt,body,tags,status,published_at,reading_minutes) VALUES
('shipping-motion-that-earns-its-keep','Shipping motion that earns its keep','Most portfolio animation is decoration. Here is the test I run before a single tween ships.','Motion is a language, not a garnish. Before I keep an animation in a build, it has to answer one of three questions.\n\n## 1. Does it explain a relationship?\n\nA card that grows out of the row it belongs to tells the user where they are. A card that fades in from nowhere tells them nothing.\n\n## 2. Does it absorb latency?\n\nA staggered reveal buys 300ms of perceived speed while data settles. That is real value.\n\n## 3. Does it survive `prefers-reduced-motion`?\n\nIf the page collapses without motion, the motion was carrying structure it should not have been carrying.\n\nEverything else gets cut.','{"Motion","Frontend","Craft"}','published',now() - interval '9 days',4),
('computer-vision-in-production','What computer vision actually costs in production','Model accuracy is the easy part. The hard part is everything wrapped around it.','A research notebook that hits 96% mAP is not a product. Here is what the remaining work looks like.\n\n## Data drift is the real adversary\n\nYour camera gets moved. The lighting changes with the season. Accuracy quietly decays and nobody notices until a customer does.\n\n## Latency budgets are architectural\n\nOnce inference has to run at the edge, quantisation, batching and frame skipping stop being optimisations and become design constraints.\n\n## Observability beats accuracy\n\nI would take a slightly worse model with confidence histograms and drift alerts over a better model I cannot inspect.\n\nBuild the loop before you tune the model.','{"Computer Vision","AI","Engineering"}','published',now() - interval '3 days',5);