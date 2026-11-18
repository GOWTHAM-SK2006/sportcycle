-- SportCycle E-Commerce Marketplace Database Seed Data
-- Phase 17 - V2__seed_data.sql

-- 1. Roles
INSERT INTO roles (id, name) VALUES 
(1, 'ROLE_CUSTOMER'),
(2, 'ROLE_SELLER'),
(3, 'ROLE_CLUB_ADMIN'),
(4, 'ROLE_ADMIN')
ON CONFLICT (id) DO NOTHING;

-- 2. Initial Users (Default password: password123)
-- BCrypt hash for 'password123': $2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxGQrvkWCh7O
INSERT INTO users (id, full_name, email, password, phone, avatar_url, is_active) VALUES
(1, 'SportCycle Admin', 'admin@sportcycle.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxGQrvkWCh7O', '+91 9876543210', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', true),
(2, 'Rahul Sharma (Seller)', 'seller@sportcycle.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxGQrvkWCh7O', '+91 9876543211', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', true),
(3, 'Vikram Coach (Club Admin)', 'club@sportcycle.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxGQrvkWCh7O', '+91 9876543212', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', true),
(4, 'Priya Patel (Customer)', 'customer@sportcycle.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxGQrvkWCh7O', '+91 9876543213', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', true)
ON CONFLICT (id) DO NOTHING;

-- Map user roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 4), -- Admin has ROLE_ADMIN
(1, 1),
(2, 2), -- Seller has ROLE_SELLER
(2, 1),
(3, 3), -- Club Admin has ROLE_CLUB_ADMIN
(3, 1),
(4, 1)  -- Customer has ROLE_CUSTOMER
ON CONFLICT DO NOTHING;

-- Customer Address
INSERT INTO user_addresses (id, user_id, recipient_name, phone, street, landmark, city, state, postal_code, country, is_default, address_type) VALUES
(1, 4, 'Priya Patel', '+91 9876543213', 'Flat 402, Green Glen Layout, Bellandur', 'Near EcoSpace Tech Park', 'Bengaluru', 'Karnataka', '560103', 'India', true, 'HOME')
ON CONFLICT (id) DO NOTHING;

-- 3. Sellers
INSERT INTO sellers (id, user_id, business_name, seller_type, is_verified, gstin, pan_number, phone, bio, bank_account_number, bank_ifsc, rating, total_sales) VALUES
(1, 2, 'Apex Pro Sports & Gear', 'RETAILER', true, '29AAAAA0000A1Z5', 'ABCDE1234F', '+91 9876543211', 'Authorized retailer and certifier of premium match-grade cricket and badminton gear.', '9876543210001', 'HDFC0001234', 4.90, 142)
ON CONFLICT (id) DO NOTHING;

-- 4. Sports (All 12 Sports specified)
INSERT INTO sports (id, name, slug, description, icon_url, image_url, display_order, is_active) VALUES
(1, 'Cricket', 'cricket', 'English Willow bats, leather balls, protective pads, and match kits.', '🏏', 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=800', 1, true),
(2, 'Football', 'football', 'FIFA standard footballs, cleats, shin guards, and goalkeeper gear.', '⚽', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800', 2, true),
(3, 'Badminton', 'badminton', 'High-tension graphite rackets, feather shuttles, and court shoes.', '🏸', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800', 3, true),
(4, 'Tennis', 'tennis', 'Pro-tour rackets, pressurized tennis balls, dampeners, and bags.', '🎾', 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800', 4, true),
(5, 'Basketball', 'basketball', 'Composite indoor/outdoor basketballs, pro hoops, and jerseys.', '🏀', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', 5, true),
(6, 'Volleyball', 'volleyball', 'Soft-touch competitive volleyballs, nets, knee pads, and accessories.', '🏐', 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800', 6, true),
(7, 'Running', 'running', 'Carbon-plated running shoes, hydration vests, and GPS gear.', '🏃', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800', 7, true),
(8, 'Fitness & Gym', 'fitness', 'Olympic barbells, rubber dumbbells, kettlebells, and bench rigs.', '🏋️', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800', 8, true),
(9, 'Swimming', 'swimming', 'Anti-fog racing goggles, silicone caps, kickboards, and tech suits.', '🏊', 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800', 9, true),
(10, 'Hockey', 'hockey', 'Carbon composite field hockey sticks, turf balls, and goalie sets.', '🏑', 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=800', 10, true),
(11, 'Table Tennis', 'table-tennis', 'ITTF approved rubber paddles, 3-star balls, and rollaway tables.', '🏓', 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800', 11, true),
(12, 'Other Sports', 'other-sports', 'Cycling helmets, squash racquets, archery, and multi-sport gear.', '🎯', 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800', 12, true)
ON CONFLICT (id) DO NOTHING;

-- 5. Categories
INSERT INTO categories (id, sport_id, name, slug, description, image_url, display_order, is_active) VALUES
-- Cricket
(1, 1, 'Cricket Bats', 'cricket-bats', 'English Willow and Kashmir Willow bats.', 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=600', 1, true),
(2, 1, 'Cricket Balls', 'cricket-balls', 'Red, white, and pink match-grade leather balls.', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600', 2, true),
(3, 1, 'Batting Pads & Gloves', 'batting-gear', 'High-density foam protective pads and gloves.', 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=600', 3, true),
(4, 1, 'Cricket Helmets', 'cricket-helmets', 'Titanium and steel grille protective helmets.', 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600', 4, true),
(5, 1, 'Kit Bags', 'cricket-kit-bags', 'Wheelie and duffle equipment bags.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 5, true),
-- Football
(6, 2, 'Footballs', 'footballs', 'FIFA Quality Pro match and training balls.', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600', 1, true),
(7, 2, 'Football Boots', 'football-boots', 'Firm ground, turf, and artificial grass cleats.', 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600', 2, true),
(8, 2, 'Goalkeeper Gloves', 'goalkeeper-gloves', 'Latex palm shock-absorbing keeper gloves.', 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600', 3, true),
-- Badminton
(9, 3, 'Rackets', 'badminton-rackets', 'Even-balance, head-heavy, and speed frames.', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600', 1, true),
(10, 3, 'Shuttlecocks', 'shuttlecocks', 'Goose feather match shuttles and nylon shuttles.', 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=600', 2, true),
(11, 3, 'Badminton Shoes', 'badminton-shoes', 'Non-marking gum rubber sole court shoes.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 3, true),
-- Tennis
(12, 4, 'Tennis Rackets', 'tennis-rackets', 'Spin and control rackets for all levels.', 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600', 1, true),
(13, 4, 'Tennis Balls', 'tennis-balls', 'Extra-duty championship felt balls.', 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600', 2, true),
-- Basketball
(14, 5, 'Basketballs', 'basketballs', 'Size 7 composite indoor and outdoor balls.', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600', 1, true),
-- Fitness
(15, 8, 'Dumbbells & Weights', 'dumbbells-weights', 'Hex cast iron and urethane dumbbells.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600', 1, true)
ON CONFLICT (id) DO NOTHING;

-- 6. Brands
INSERT INTO brands (id, name, slug, logo_url, description, website_url) VALUES
(1, 'MRF Sports', 'mrf', 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=200', 'World renowned cricket gear made with grade 1 English Willow.', 'https://mrf.com'),
(2, 'SG (Sanspareils Greenlands)', 'sg', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200', 'India’s largest and most trusted cricket equipment manufacturer.', 'https://sgcricket.com'),
(3, 'Yonex', 'yonex', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=200', 'World leader in badminton rackets, strings, and court footwear.', 'https://yonex.com'),
(4, 'Wilson', 'wilson', 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=200', 'Championship tennis and basketball manufacturer.', 'https://wilson.com'),
(5, 'Nike', 'nike', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', 'Just Do It. Premium sports apparel, shoes, and equipment.', 'https://nike.com'),
(6, 'Adidas', 'adidas', 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=200', 'Impossible is Nothing. Elite football, running, and training gear.', 'https://adidas.com'),
(7, 'Nivia', 'nivia', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200', 'Official match balls and sports equipment of Indian sports leagues.', 'https://nivia.com')
ON CONFLICT (id) DO NOTHING;

-- 7. Clubs
INSERT INTO clubs (id, admin_user_id, name, slug, sport_id, location, city, state, description, logo_url, banner_url, contact_email, contact_phone, membership_open, member_count, is_verified) VALUES
(1, 3, 'Bangalore Strikers Cricket Club', 'bangalore-strikers-cc', 1, 'Chinnaswamy Stadium Annex, MG Road', 'Bengaluru', 'Karnataka', 'Premier division league cricket club offering elite coaching and match-tested team gear exchange.', 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=300', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200', 'info@bangalorestrikers.com', '+91 9876543212', true, 48, true),
(2, 3, 'Apex Badminton Academy', 'apex-badminton-academy', 3, 'Koramangala Indoor Stadium', 'Bengaluru', 'Karnataka', 'National-level badminton coaching facility with court gear marketplace for academy trainees.', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300', 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=1200', 'contact@apexbadminton.org', '+91 9876543214', true, 85, true),
(3, 3, 'Deccan Dynamos Football Club', 'deccan-dynamos-fc', 2, 'Padukone-Dravid Centre for Sports Excellence', 'Bengaluru', 'Karnataka', 'Youth development academy and competitive football club with certified team gear recycling.', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300', 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=1200', 'support@deccandynamos.com', '+91 9876543215', true, 120, true)
ON CONFLICT (id) DO NOTHING;

-- 8. Products (Both Brand-New and Pre-Owned with verification badges and exact condition levels)
INSERT INTO products (id, seller_id, club_id, sport_id, category_id, brand_id, title, slug, description, product_condition, is_pre_owned, usage_duration_months, wear_details, is_verified, original_price, selling_price, discount_percentage, stock_quantity, sku, sizes, status, is_featured, rating, review_count, location) VALUES
-- Product 1: Brand New Cricket Bat
(1, 1, NULL, 1, 1, 1, 'MRF Genius Grand Edition English Willow Cricket Bat', 'mrf-genius-grand-edition-bat', 'Grade 1 English Willow handcrafted with thick edges, superb balance, and mid-to-low sweet spot preferred by top international batsmen.', 'BRAND_NEW', false, 0, 'Factory wrapped, unopened with authenticity hologram certificate.', true, 28999.00, 24649.00, 15, 8, 'BAT-MRF-GGE-01', 'SH, Harrow, 6', 'ACTIVE', true, 4.90, 24, 'Bengaluru, India'),

-- Product 2: Pre-Owned Like New Cricket Bat
(2, 1, 1, 1, 1, 2, 'SG Sunny Tonny Classic Cricket Bat [Verified Pre-Owned]', 'sg-sunny-tonny-pre-owned', 'Carefully knocked and match-tested Grade 1 willow bat. Knocked in with 10,000 mallet strokes and fitted with anti-scuff sheet.', 'LIKE_NEW', true, 2, 'Only played in 3 club weekend matches. Clean grains, no toe cracks, pristine handle cane.', true, 18500.00, 11999.00, 35, 1, 'BAT-SG-ST-PO2', 'SH', 'ACTIVE', true, 4.80, 8, 'Bengaluru, India'),

-- Product 3: Brand New Badminton Racket
(3, 1, NULL, 3, 9, 3, 'Yonex Astrox 88D Pro 4U Badminton Racket', 'yonex-astrox-88d-pro', 'Rotational Generator System with Namd graphite for lethal counter-attacks and explosive rear-court steep smashes. Made in Japan.', 'BRAND_NEW', false, 0, 'Original box packing, strung at 26 lbs with Yonex BG66 Ultimax.', true, 16990.00, 13590.00, 20, 15, 'RAC-YNX-A88DP', '4U/G5, 3U/G5', 'ACTIVE', true, 5.00, 42, 'Mumbai, India'),

-- Product 4: Pre-Owned Excellent Badminton Racket
(4, 1, 2, 3, 9, 3, 'Yonex Nanoflare 800 LT (3U/G5) [Certified Club Gear]', 'yonex-nanoflare-800-lt-used', 'Ultra-lightweight razor thin aero frame engineered for lightning-quick drives and net control.', 'EXCELLENT', true, 4, 'Very minor paint chip at 2 o clock rim position. Grommets inspected and newly restrung with Aerobite at 27 lbs.', true, 14990.00, 8499.00, 43, 2, 'RAC-YNX-NF800-USED', '3U/G5', 'ACTIVE', true, 4.70, 15, 'Bengaluru, India'),

-- Product 5: Brand New Football Boots
(5, 1, NULL, 2, 7, 5, 'Nike Mercurial Vapor 15 Pro FG Cleats', 'nike-mercurial-vapor-15-pro-fg', 'Zoom Air unit under heel with speed cage architecture. Provides explosive traction on firm natural grass pitches.', 'BRAND_NEW', false, 0, 'New with box and tags, extra insoles included.', true, 12995.00, 10395.00, 20, 12, 'BOOT-NK-MV15P', 'UK 8, UK 9, UK 10, UK 11', 'ACTIVE', true, 4.90, 31, 'Delhi, India'),

-- Product 6: Pre-Owned Good Football
(6, 1, 3, 2, 6, 7, 'Nivia Dominator Official Match Football (Pack of 3)', 'nivia-dominator-match-balls-pack', 'Thermally bonded FIFA quality seamless footballs tested for aerodynamic flight and low water absorption.', 'GOOD', true, 3, 'Used in Academy weekend drills. Maintains 100% bladder pressure retention; cosmetic turf discoloration.', true, 5997.00, 2850.00, 52, 4, 'BALL-NIV-DOM-3PK', 'Size 5', 'ACTIVE', false, 4.50, 9, 'Bengaluru, India'),

-- Product 7: Brand New Tennis Racket
(7, 1, NULL, 4, 12, 4, 'Wilson Pro Staff 97 v14 Tennis Racket', 'wilson-pro-staff-97-v14', 'Paradigm Bending carbon construction giving classic feel and pinpoint precision for aggressive baseline shotmakers.', 'BRAND_NEW', false, 0, 'Unstrung, brand new with certificate.', true, 25999.00, 21999.00, 15, 6, 'RAC-WIL-PS97-14', 'Grip 2 (4 1/4), Grip 3 (4 3/8)', 'ACTIVE', true, 4.90, 19, 'Chennai, India'),

-- Product 8: Pre-Owned Fair Gym Dumbbell Set
(8, 1, NULL, 8, 15, NULL, 'Rubber Coated Hex Dumbbells Pair (15kg x 2)', 'rubber-hex-dumbbells-15kg-pair', 'Commercial gym-grade virgin rubber hex dumbbell pair with contoured ergonomic chrome knurled handles.', 'FAIR', true, 12, 'Surface scuffs on rubber ends from home gym use, knurling is clean and handles are solid with zero wobble.', true, 7500.00, 3999.00, 46, 5, 'WT-HEX-15KG-PAIR', '15kg x 2', 'ACTIVE', false, 4.60, 11, 'Hyderabad, India')
ON CONFLICT (id) DO NOTHING;

-- 9. Product Images
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary) VALUES
-- Product 1
(1, 1, 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=900', 'MRF Genius Grand Edition front view', 1, true),
(2, 1, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=900', 'MRF Genius edge profile and handle', 2, false),
-- Product 2
(3, 2, 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=900', 'SG Sunny Tonny Classic cricket bat', 1, true),
(4, 2, 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=900', 'SG Willow grains detail', 2, false),
-- Product 3
(5, 3, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=900', 'Yonex Astrox 88D Pro racket overview', 1, true),
(6, 3, 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=900', 'Yonex Astrox 88D Pro frame top and strings', 2, false),
-- Product 4
(7, 4, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=900', 'Yonex Nanoflare 800 used condition frame', 1, true),
-- Product 5
(8, 5, 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=900', 'Nike Mercurial Vapor 15 boots', 1, true),
(9, 5, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900', 'Nike studs traction pattern', 2, false),
-- Product 6
(10, 6, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900', 'Nivia Dominator football pack', 1, true),
-- Product 7
(11, 7, 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=900', 'Wilson Pro Staff 97 racket', 1, true),
-- Product 8
(12, 8, 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900', 'Hex Rubber Dumbbells 15kg pair', 1, true)
ON CONFLICT (id) DO NOTHING;

-- 10. Reviews
INSERT INTO reviews (id, product_id, user_id, rating, title, comment, is_verified_purchase) VALUES
(1, 1, 4, 5, 'Incredible balance and punch!', 'The bat arrived fully oiled and taped. The balance in hand is effortless and edges ping like a missile. Worth every rupee.', true),
(2, 2, 4, 5, 'Practically new at a fraction of the cost', 'I was skeptical about buying pre-owned, but the SportCycle verification report was accurate to the millimeter. Sweet spot is huge.', true),
(3, 3, 4, 5, 'Supreme smash power!', 'Astrox 88D Pro delivers crisp feedback. The steep smash angle is noticeably better than my old racket.', true)
ON CONFLICT (id) DO NOTHING;

-- 11. Initial Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, link_url) VALUES
(1, 4, 'Welcome to SportCycle!', 'Explore our multi-sport marketplace. Shop verified equipment or sell your pre-loved gear with 0% listing fee this week.', 'SYSTEM', false, '/products'),
(2, 4, 'Exclusive Club Gear Alert', 'Bangalore Strikers CC just listed 5 tournament-grade bats in the pre-owned section.', 'CLUB', false, '/clubs/bangalore-strikers-cc')
ON CONFLICT (id) DO NOTHING;

-- Reset sequences to prevent key collisions during new inserts
SELECT setval(pg_get_serial_sequence('roles', 'id'), coalesce(max(id), 1)) FROM roles;
SELECT setval(pg_get_serial_sequence('users', 'id'), coalesce(max(id), 1)) FROM users;
SELECT setval(pg_get_serial_sequence('user_addresses', 'id'), coalesce(max(id), 1)) FROM user_addresses;
SELECT setval(pg_get_serial_sequence('sellers', 'id'), coalesce(max(id), 1)) FROM sellers;
SELECT setval(pg_get_serial_sequence('sports', 'id'), coalesce(max(id), 1)) FROM sports;
SELECT setval(pg_get_serial_sequence('categories', 'id'), coalesce(max(id), 1)) FROM categories;
SELECT setval(pg_get_serial_sequence('brands', 'id'), coalesce(max(id), 1)) FROM brands;
SELECT setval(pg_get_serial_sequence('clubs', 'id'), coalesce(max(id), 1)) FROM clubs;
SELECT setval(pg_get_serial_sequence('products', 'id'), coalesce(max(id), 1)) FROM products;
SELECT setval(pg_get_serial_sequence('product_images', 'id'), coalesce(max(id), 1)) FROM product_images;
SELECT setval(pg_get_serial_sequence('reviews', 'id'), coalesce(max(id), 1)) FROM reviews;
SELECT setval(pg_get_serial_sequence('notifications', 'id'), coalesce(max(id), 1)) FROM notifications;

