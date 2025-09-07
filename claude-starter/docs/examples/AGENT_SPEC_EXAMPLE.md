# Example Agent Specification: LocalCraft Norge

*This is an example output from the Claude Code Agent Spec Generator GPT*

## Project: LocalCraft Norge

### Executive Summary
LocalCraft Norge is a marketplace platform connecting Norwegian craftsmen and artisans with customers seeking unique, handmade products. The platform emphasizes local production, sustainability, and preserving traditional Norwegian crafts while making them accessible to modern consumers.

### Target Users
- Primary:  Norwegian consumers aged 25-55 interested in quality handmade products, sustainability, and supporting local artisans
- Secondary: Tourists seeking authentic Norwegian crafts and international customers interested in Scandinavian design

### Core Value Proposition
LocalCraft Norge solves the discovery problem for both artisans and consumers - artisans struggle to reach customers beyond local markets, while consumers have difficulty finding authentic, quality handmade products. The platform provides trust through reviews, secure payments, and quality guarantees.

## Technology Stack

### Frontend
- Framework: React 18 with TypeScript (strict mode)
- Build Tool: Vite
- Styling: Tailwind CSS 4 + shadcn/ui
- State Management: Zustand for cart, Context API for auth
- Routing: React Router v6
- Forms: react-hook-form with zod validation
- Images: Cloudinary for optimization and CDN

### Backend
- Platform: Supabase
  - Database: PostgreSQL with RLS policies
  - Authentication: Supabase Auth with email/password, Google, and BankID
  - Storage: Supabase Storage for product images
  - Realtime: For order status updates
  - Edge Functions: Payment processing, email notifications, image processing

### External Services
- Payment: Stripe + Vipps (Norwegian mobile payment)
- Email: Resend for transactional emails
- Analytics: Plausible Analytics
- Monitoring: Sentry
- Maps: Mapbox for artisan locations

## Features Priority Matrix

### MVP (Phase 1) - Essential Features

1. **User Registration & Profiles**
   - Description: Separate registration flows for buyers and artisans with profile management
   - User Story: As a user, I want to create an account and manage my profile so that I can buy or sell on the platform
   - Acceptance Criteria:
     - [ ] Email/password and social login options
     - [ ] Separate onboarding for buyers and sellers
     - [ ] Profile photo upload and basic info
     - [ ] Email verification required
     - [ ] Norwegian BankID integration for sellers (trust)
   - Technical Notes: Use Supabase Auth with custom claims for user roles

2. **Product Catalog**
   - Description: Browse and search handmade products with filtering
   - User Story: As a buyer, I want to browse products by category and search so that I can find what I'm looking for
   - Acceptance Criteria:
     - [ ] Grid/list view toggle
     - [ ] Filter by category, price, location, materials
     - [ ] Sort by price, newest, popularity
     - [ ] Product quick view modal
     - [ ] Image zoom functionality
   - Technical Notes: Implement Algolia for search or use PostgreSQL full-text search

3. **Product Management (Sellers)**
   - Description: Artisans can list, edit, and manage their products
   - User Story: As an artisan, I want to list my products with photos and descriptions so that customers can purchase them
   - Acceptance Criteria:
     - [ ] Multi-image upload (up to 8 images)
     - [ ] Rich text description editor
     - [ ] Inventory tracking
     - [ ] Category and tag selection
     - [ ] Pricing in NOK with optional EUR/USD display
     - [ ] Mark as made-to-order vs. in stock
   - Technical Notes: Image optimization using Supabase Edge Functions

4. **Shopping Cart & Checkout**
   - Description: Standard e-commerce cart with multiple payment options
   - User Story: As a buyer, I want to add items to cart and checkout securely
   - Acceptance Criteria:
     - [ ] Persistent cart across sessions
     - [ ] Guest checkout option
     - [ ] Shipping address management
     - [ ] Stripe and Vipps payment integration
     - [ ] Order confirmation email
   - Technical Notes: Cart state in Zustand, synced to database for logged-in users

5. **Order Management**
   - Description: Track and manage orders for both buyers and sellers
   - User Story: As a user, I want to track my orders and communicate about them
   - Acceptance Criteria:
     - [ ] Order status tracking (pending, processing, shipped, delivered)
     - [ ] Shipping tracking integration
     - [ ] Basic messaging between buyer and seller
     - [ ] Order history
   - Technical Notes: Realtime updates using Supabase subscriptions

### Phase 2 - Growth Features
- Advanced search with visual similarity
- Seller analytics dashboard
- Wishlist and favorites
- Product reviews and ratings
- Commission-based revenue model
- Featured products and promotions
- Mobile app (React Native)

### Phase 3 - Scale Features
- International shipping
- Multi-currency support
- Seller verification badges
- Virtual craft fairs/events
- AR product preview
- Subscription boxes
- B2B wholesale features

## Database Schema

```sql
-- Users extension
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  is_seller BOOLEAN DEFAULT FALSE,
  shop_name TEXT,
  shop_description TEXT,
  location_city TEXT,
  location_region TEXT,
  bank_account_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_nb TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES categories(id),
  icon_name TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_nok DECIMAL(10,2) NOT NULL,
  inventory_count INTEGER DEFAULT 0,
  is_made_to_order BOOLEAN DEFAULT FALSE,
  production_time_days INTEGER,
  category_id UUID REFERENCES categories(id),
  tags TEXT[],
  materials TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold_out')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Images
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal_nok DECIMAL(10,2) NOT NULL,
  shipping_nok DECIMAL(10,2) NOT NULL,
  tax_nok DECIMAL(10,2) NOT NULL,
  total_nok DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  seller_id UUID NOT NULL REFERENCES profiles(id),
  quantity INTEGER NOT NULL,
  price_nok DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews (Phase 2)
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  order_item_id UUID REFERENCES order_items(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  seller_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Security Rules
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Products policies  
CREATE POLICY "Products viewable by everyone"
  ON products FOR SELECT
  USING (status = 'active' OR seller_id = auth.uid());

CREATE POLICY "Sellers can manage own products"
  ON products FOR ALL
  USING (seller_id = auth.uid());

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (buyer_id = auth.uid() OR EXISTS (
    SELECT 1 FROM order_items 
    WHERE order_items.order_id = orders.id 
    AND order_items.seller_id = auth.uid()
  ));
```

## UI/UX Requirements

### Design System
- Theme: Light with dark mode support
- Primary Color: #0F172A (Norwegian midnight blue)
- Secondary Color: #DC2626 (Norwegian flag red)
- Typography: Inter for UI, Playfair Display for headings
- Components: shadcn/ui with Nordic-inspired customizations

### Key Pages/Screens

1. **Homepage**
   - URL: /
   - Hero section with featured artisans
   - Category grid
   - Trending products carousel
   - Newsletter signup
   - Trust indicators (secure payment, quality guarantee)

2. **Product Listing**
   - URL: /products
   - Filterable grid layout
   - Sticky filter sidebar on desktop, modal on mobile
   - Infinite scroll or pagination
   - Quick add to cart

3. **Product Detail**
   - URL: /products/[slug]
   - Image gallery with zoom
   - Product info and variations
   - Seller information card
   - Related products
   - Reviews section (Phase 2)

4. **Seller Dashboard**
   - URL: /seller/dashboard
   - Sales overview cards
   - Recent orders table
   - Quick actions (add product, view messages)
   - Performance metrics

5. **Shopping Cart**
   - URL: /cart
   - Line items with seller grouping
   - Shipping calculator
   - Promotion code input
   - Clear CTAs for checkout

## Implementation Notes

### Developer Guidance
- Start with: User authentication and basic product listing
- Use Supabase RLS for all data security
- Implement image optimization early (crucial for marketplace)
- Set up error tracking with Sentry from day one
- Create reusable components for product cards, modals
- Implement proper SEO with meta tags and structured data

### Potential Challenges
- BankID integration requires approval process
- Handling multiple sellers in one order (split payments)
- Image storage costs at scale
- Norwegian-specific: Shipping integrations with Posten/Bring

### Don't Forget
- Cookie consent banner (GDPR)
- Terms of service and privacy policy pages
- Seller onboarding flow with guidelines
- Email templates for all transactional emails
- Product search indexing strategy
- Mobile-first approach (60% of traffic expected on mobile)