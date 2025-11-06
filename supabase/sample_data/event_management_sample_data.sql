-- =====================================================
-- EVENT MANAGEMENT SAMPLE DATA
-- =====================================================
-- This script inserts sample data into the 7 event management tables
-- to test the Event Management tab UI components.
--
-- IMPORTANT: Before running this script, you need to:
-- 1. Replace 'YOUR_EVENT_ID_HERE' with an actual event_id from em_events table
-- 2. Replace 'YOUR_USER_ID_HERE' with an actual user_id from auth.users table
--
-- To find valid IDs, run these queries first:
-- SELECT id, name FROM em_events LIMIT 5;
-- SELECT id, email FROM auth.users WHERE email LIKE '%admin%' LIMIT 5;
-- =====================================================

-- =====================================================
-- 1. CONFERENCE SESSIONS SAMPLE DATA
-- =====================================================
INSERT INTO em_conference_sessions (
  event_id, title, description, session_type, start_time, end_time,
  location, status, speaker_ids, max_attendees, current_attendees,
  tags, created_by
) VALUES
-- Keynote Session (Happening Now)
(
  'YOUR_EVENT_ID_HERE',
  'The Future of AI in Healthcare',
  'Join Dr. Sarah Johnson as she explores how artificial intelligence is revolutionizing patient care, diagnostics, and medical research. This keynote will cover real-world applications and future possibilities.',
  'keynote',
  NOW() - INTERVAL '30 minutes',
  NOW() + INTERVAL '30 minutes',
  'Main Auditorium',
  'happening_now',
  '[]'::jsonb,
  500,
  387,
  '["AI", "Healthcare", "Innovation", "Technology"]'::jsonb,
  'YOUR_USER_ID_HERE'
),
-- Panel Discussion (Upcoming)
(
  'YOUR_EVENT_ID_HERE',
  'Sustainable Business Practices Panel',
  'Industry leaders discuss strategies for building environmentally sustainable and profitable businesses. Topics include carbon neutrality, circular economy, and green technology adoption.',
  'panel',
  NOW() + INTERVAL '2 hours',
  NOW() + INTERVAL '3 hours',
  'Conference Room A',
  'upcoming',
  '[]'::jsonb,
  150,
  92,
  '["Sustainability", "Business", "Environment", "ESG"]'::jsonb,
  'YOUR_USER_ID_HERE'
),
-- Presentation (Completed)
(
  'YOUR_EVENT_ID_HERE',
  'Blockchain Beyond Cryptocurrency',
  'An in-depth look at blockchain applications in supply chain, healthcare, and government services. Learn how distributed ledger technology is solving real-world problems.',
  'presentation',
  NOW() - INTERVAL '3 hours',
  NOW() - INTERVAL '2 hours',
  'Tech Hub Room 2',
  'completed',
  '[]'::jsonb,
  100,
  78,
  '["Blockchain", "Technology", "Innovation"]'::jsonb,
  'YOUR_USER_ID_HERE'
);

-- =====================================================
-- 2. LEARNING LABS SAMPLE DATA
-- =====================================================
INSERT INTO em_learning_labs (
  event_id, title, description, instructor_ids, start_time, end_time,
  location, max_capacity, registered_count, registration_status,
  difficulty_level, prerequisites, materials_provided, tags, created_by
) VALUES
-- Beginner Workshop
(
  'YOUR_EVENT_ID_HERE',
  'Introduction to Python Programming',
  'A hands-on workshop for beginners to learn Python fundamentals. No prior programming experience required. Participants will build their first Python application.',
  '[]'::jsonb,
  NOW() + INTERVAL '1 day',
  NOW() + INTERVAL '1 day 3 hours',
  'Learning Lab 1',
  30,
  24,
  'open',
  'beginner',
  'Basic computer skills',
  'Laptop, course materials, certificate of completion',
  '["Python", "Programming", "Beginner", "Coding"]'::jsonb,
  'YOUR_USER_ID_HERE'
),
-- Intermediate Workshop
(
  'YOUR_EVENT_ID_HERE',
  'Advanced Data Analytics with R',
  'Deep dive into statistical analysis and data visualization using R. Learn advanced techniques for data manipulation, modeling, and creating publication-ready visualizations.',
  '[]'::jsonb,
  NOW() + INTERVAL '2 days',
  NOW() + INTERVAL '2 days 4 hours',
  'Learning Lab 2',
  25,
  25,
  'full',
  'intermediate',
  'Basic statistics knowledge, familiarity with programming concepts',
  'R Studio setup guide, datasets, reference materials',
  '["Data Science", "R", "Analytics", "Statistics"]'::jsonb,
  'YOUR_USER_ID_HERE'
),
-- Advanced Workshop
(
  'YOUR_EVENT_ID_HERE',
  'Machine Learning Model Deployment',
  'Learn how to deploy ML models to production environments. Covers containerization, API development, monitoring, and scaling strategies.',
  '[]'::jsonb,
  NOW() + INTERVAL '3 days',
  NOW() + INTERVAL '3 days 5 hours',
  'Tech Lab 3',
  20,
  18,
  'open',
  'advanced',
  'Experience with Python, ML frameworks (TensorFlow/PyTorch), basic DevOps knowledge',
  'Docker setup guide, sample models, deployment templates',
  '["Machine Learning", "DevOps", "Deployment", "Advanced"]'::jsonb,
  'YOUR_USER_ID_HERE'
);

-- =====================================================
-- 3. ROUNDTABLES SAMPLE DATA
-- =====================================================
INSERT INTO em_roundtables (
  event_id, title, topic, moderator_ids, start_time, end_time,
  location, max_participants, current_participants, formation_status,
  discussion_format, target_audience, expected_outcomes, tags, created_by
) VALUES


-- Roundtable 1
(
  'YOUR_EVENT_ID_HERE',
  'Women in Tech Leadership',
  'An intimate discussion about challenges and opportunities for women in technology leadership roles. Share experiences, strategies, and build meaningful connections.',
  '[]'::jsonb,
  NOW() + INTERVAL '1 day 2 hours',
  NOW() + INTERVAL '1 day 3 hours',
  'Executive Lounge',
  15,
  12,
  'forming',
  'moderated_discussion',
  'Women in technology, aspiring leaders, current managers',
  'Networking connections, mentorship opportunities, actionable leadership strategies',
  '["Leadership", "Women in Tech", "Networking", "Career Development"]'::jsonb,
  'YOUR_USER_ID_HERE'
),
-- Roundtable 2
(
  'YOUR_EVENT_ID_HERE',
  'Startup Funding Strategies',
  'Founders and investors discuss various funding approaches from bootstrapping to venture capital. Learn what investors look for and how to prepare your startup for funding.',
  '[]'::jsonb,
  NOW() + INTERVAL '2 days 1 hour',
  NOW() + INTERVAL '2 days 2 hours',
  'Startup Hub',
  12,
  12,
  'confirmed',
  'open_discussion',
  'Startup founders, entrepreneurs, early-stage investors',
  'Understanding funding landscape, investor connections, pitch improvement tips',
  '["Startups", "Funding", "Venture Capital", "Entrepreneurship"]'::jsonb,
  'YOUR_USER_ID_HERE'
),
-- Roundtable 3
(
  'YOUR_EVENT_ID_HERE',
  'Cybersecurity Best Practices',
  'Security experts and IT professionals discuss emerging threats and practical security measures for organizations of all sizes.',
  '[]'::jsonb,
  NOW() + INTERVAL '3 days',
  NOW() + INTERVAL '3 days 90 minutes',
  'Security Room',
  10,
  7,
  'forming',
  'expert_led',
  'IT professionals, security officers, tech managers',
  'Security framework recommendations, threat awareness, implementation strategies',
  '["Cybersecurity", "IT", "Security", "Best Practices"]'::jsonb,
  'YOUR_USER_ID_HERE'
);

-- =====================================================
-- 4. SKILL CLINICS SAMPLE DATA
-- =====================================================
INSERT INTO em_skill_clinics (
  event_id, title, description, trainer_ids, start_time, end_time,
  location, max_participants, registered_count, skill_category,
  orientation_status, certification_offered, certification_details,
  hands_on_activities, tags, created_by
) VALUES
-- Skill Clinic 1 (with certification)
(
  'YOUR_EVENT_ID_HERE',
  'Public Speaking Mastery',
  'Transform your presentation skills with proven techniques used by professional speakers. Practice in a supportive environment and receive personalized feedback.',
  '[]'::jsonb,
  NOW() + INTERVAL '1 day 4 hours',
  NOW() + INTERVAL '1 day 6 hours',
  'Training Room A',
  20,
  16,
  'Communication',
  'scheduled',
  true,
  'Certificate of Completion in Public Speaking - recognized by Professional Speakers Association',
  'Live presentations, video feedback, impromptu speaking exercises',
  '["Public Speaking", "Communication", "Presentation Skills"]'::jsonb,
  'YOUR_USER_ID_HERE'
),
-- Skill Clinic 2 (no certification)
(
  'YOUR_EVENT_ID_HERE',
  'Agile Project Management Fundamentals',
  'Learn Scrum, Kanban, and other agile methodologies. Understand how to implement agile practices in your team and organization.',
  '[]'::jsonb,
  NOW() + INTERVAL '2 days 3 hours',
  NOW() + INTERVAL '2 days 5 hours',
  'Training Room B',
  25,
  19,
  'Project Management',
  'scheduled',
  false,
  null,
  'Sprint planning simulation, retrospective exercises, Kanban board setup',
  '["Agile", "Scrum", "Project Management", "Kanban"]'::jsonb,
  'YOUR_USER_ID_HERE'
),
-- Skill Clinic 3 (with certification)
(
  'YOUR_EVENT_ID_HERE',
  'Digital Marketing Analytics',
  'Master Google Analytics, social media metrics, and ROI tracking. Learn to make data-driven marketing decisions.',
  '[]'::jsonb,
  NOW() + INTERVAL '3 days 2 hours',
  NOW() + INTERVAL '3 days 4 hours',
  'Digital Lab',
  18,
  15,
  'Marketing',
  'scheduled',
  true,
  'Google Analytics Certification Preparation - includes exam voucher',
  'Live campaign analysis, dashboard creation, A/B testing exercises',
  '["Digital Marketing", "Analytics", "Google Analytics", "Marketing"]'::jsonb,
  'YOUR_USER_ID_HERE'
);

-- =====================================================
-- 5. STARTUP STORIES SAMPLE DATA
-- =====================================================
INSERT INTO em_startup_stories (
  event_id, startup_name, founder_name, description, pitch_duration,
  start_time, location, funding_stage, industry, website_url,
  registration_status, confirmation_status, pitch_deck_url,
  demo_requirements, tags, created_by
) VALUES
-- Startup 1 (Confirmed)
(
  'YOUR_EVENT_ID_HERE',
  'EcoTrack Solutions',
  'Maria Rodriguez',
  'AI-powered carbon footprint tracking for businesses. Our platform helps companies measure, reduce, and offset their environmental impact with real-time analytics and actionable insights.',
  10,
  NOW() + INTERVAL '1 day 5 hours',
  'Startup Stage',
  'Series A',
  'CleanTech',
  'https://ecotrack.example.com',
  'confirmed',
  'confirmed',
  null,
  'Projector for slides, internet connection for live demo',
  '["CleanTech", "AI", "Sustainability", "SaaS"]'::jsonb,
  'YOUR_USER_ID_HERE'
),
-- Startup 2 (Confirmed)
(
  'YOUR_EVENT_ID_HERE',
  'HealthBridge AI',
  'Dr. James Chen',
  'Telemedicine platform connecting patients with specialists worldwide. Using AI to match patients with the right doctors and provide preliminary diagnostics.',
  10,
  NOW() + INTERVAL '1 day 5 hours 15 minutes',
  'Startup Stage',
  'Seed',
  'HealthTech',
  'https://healthbridge.example.com',
  'confirmed',
  'confirmed',
  null,
  'Screen sharing capability, demo account access',
  '["HealthTech", "AI", "Telemedicine", "Healthcare"]'::jsonb,
  'YOUR_USER_ID_HERE'
),
-- Startup 3 (Pending)
(
  'YOUR_EVENT_ID_HERE',
  'EduLearn Pro',
  'Sarah Williams',
  'Personalized learning platform using adaptive algorithms to create custom education paths for students. Gamification meets serious learning outcomes.',
  10,
  NOW() + INTERVAL '1 day 5 hours 30 minutes',
  'Startup Stage',
  'Pre-seed',
  'EdTech',
  'https://edulearn.example.com',
  'confirmed',
  'pending',
  null,
  'Laptop for demo, student sample accounts',
  '["EdTech", "Education", "AI", "Gamification"]'::jsonb,
  'YOUR_USER_ID_HERE'
);

-- =====================================================
-- 6. EXHIBITORS SAMPLE DATA
-- =====================================================
INSERT INTO em_exhibitors (
  event_id, company_name, description, tier, booth_number, booth_size,
  industry, website_url, logo_url, contact_person, contact_email,
  contact_phone, social_media, status, special_requirements, created_by
) VALUES
-- Diamond Tier
(
  'YOUR_EVENT_ID_HERE',
  'TechCorp Global',
  'Leading provider of enterprise cloud solutions and AI-powered business intelligence platforms. Serving Fortune 500 companies worldwide.',
  'diamond',
  'A-101',
  '20x20',
  'Enterprise Software',
  'https://techcorp.example.com',
  null,
  'Jennifer Smith',
  'jennifer.smith@techcorp.example.com',
  '+1-555-0101',
  '{"linkedin": "techcorp-global", "twitter": "@techcorp", "facebook": "techcorpglobal"}'::jsonb,
  'confirmed',
  'Power outlets (20), high-speed internet, demo stations (5), meeting room access',
  'YOUR_USER_ID_HERE'
),
-- Platinum Tier
(
  'YOUR_EVENT_ID_HERE',
  'InnovateLabs Inc',
  'Cutting-edge IoT solutions for smart cities and industrial automation. Transforming how businesses operate with connected devices.',
  'platinum',
  'B-205',
  '15x15',
  'IoT & Hardware',
  'https://innovatelabs.example.com',
  null,
  'Michael Chen',
  'michael.chen@innovatelabs.example.com',
  '+1-555-0202',
  '{"linkedin": "innovatelabs", "twitter": "@innovatelabs"}'::jsonb,
  'confirmed',
  'Power outlets (15), internet, product display area',
  'YOUR_USER_ID_HERE'
),
-- Gold Tier
(
  'YOUR_EVENT_ID_HERE',
  'DataViz Solutions',
  'Beautiful data visualization tools for businesses. Turn complex data into actionable insights with our award-winning platform.',
  'gold',
  'C-310',
  '10x10',
  'Data Analytics',
  'https://dataviz.example.com',
  null,
  'Sarah Johnson',
  'sarah.j@dataviz.example.com',
  '+1-555-0303',
  '{"linkedin": "dataviz-solutions", "twitter": "@dataviz"}'::jsonb,
  'confirmed',
  'Power outlets (10), internet, monitor stands (3)',
  'YOUR_USER_ID_HERE'
),
-- Silver Tier
(
  'YOUR_EVENT_ID_HERE',
  'CloudSecure Systems',
  'Cybersecurity solutions for cloud infrastructure. Protect your data with our comprehensive security suite.',
  'silver',
  'D-415',
  '8x8',
  'Cybersecurity',
  'https://cloudsecure.example.com',
  null,
  'David Martinez',
  'david.m@cloudsecure.example.com',
  '+1-555-0404',
  '{"linkedin": "cloudsecure"}'::jsonb,
  'confirmed',
  'Power outlets (8), internet',
  'YOUR_USER_ID_HERE'
),
-- Bronze Tier
(
  'YOUR_EVENT_ID_HERE',
  'StartupHub Accelerator',
  'Supporting early-stage startups with mentorship, funding, and resources. Join our community of innovative entrepreneurs.',
  'bronze',
  'E-520',
  '6x6',
  'Startup Ecosystem',
  'https://startuphub.example.com',
  null,
  'Emily Brown',
  'emily.brown@startuphub.example.com',
  '+1-555-0505',
  '{"linkedin": "startuphub", "twitter": "@startuphub", "instagram": "startuphub"}'::jsonb,
  'confirmed',
  'Power outlets (5), internet, banner stand',
  'YOUR_USER_ID_HERE'
);

-- =====================================================
-- 7. FOOD VENDORS SAMPLE DATA
-- =====================================================
INSERT INTO em_food_vendors (
  event_id, vendor_name, description, cuisine_type, menu_items,
  booth_number, booth_size, operating_hours_start, operating_hours_end,
  average_price_range, dietary_options, accepts_cash, accepts_card,
  accepts_mobile_payment, contact_person, contact_phone, status,
  special_requirements, created_by
) VALUES
-- Food Vendor 1 (Budget)
(
  'YOUR_EVENT_ID_HERE',
  'Street Tacos Express',
  'Authentic Mexican street tacos made fresh to order. Family recipes passed down through generations.',
  'Mexican',
  '["Carne Asada Tacos", "Al Pastor Tacos", "Vegetarian Tacos", "Quesadillas", "Chips & Guacamole", "Horchata", "Mexican Coke"]'::jsonb,
  'F-01',
  '10x8',
  '08:00',
  '18:00',
  'budget',
  '["Vegetarian", "Gluten-Free Options"]'::jsonb,
  true,
  true,
  true,
  'Carlos Rodriguez',
  '+1-555-0601',
  'confirmed',
  'Water hookup, propane connection, waste disposal',
  'YOUR_USER_ID_HERE'
),
-- Food Vendor 2 (Moderate)
(
  'YOUR_EVENT_ID_HERE',
  'Green Bowl Cafe',
  'Healthy bowls, smoothies, and salads. Organic ingredients sourced from local farms.',
  'Healthy/Organic',
  '["Acai Bowl", "Buddha Bowl", "Quinoa Salad", "Green Smoothie", "Protein Bowl", "Cold Pressed Juice", "Vegan Wraps"]'::jsonb,
  'F-02',
  '10x8',
  '07:00',
  '17:00',
  'moderate',
  '["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free", "Organic"]'::jsonb,
  true,
  true,
  true,
  'Amanda Green',
  '+1-555-0602',
  'confirmed',
  'Refrigeration, power outlets (15A), water hookup',
  'YOUR_USER_ID_HERE'
),
-- Food Vendor 3 (Premium)
(
  'YOUR_EVENT_ID_HERE',
  'Artisan Pizza Co',
  'Wood-fired Neapolitan pizzas with premium imported ingredients. Certified by Associazione Verace Pizza Napoletana.',
  'Italian',
  '["Margherita Pizza", "Prosciutto & Arugula", "Truffle Mushroom", "Quattro Formaggi", "Caprese Salad", "Tiramisu", "Italian Sodas"]'::jsonb,
  'F-03',
  '12x10',
  '11:00',
  '20:00',
  'premium',
  '["Vegetarian Options", "Gluten-Free Crust Available"]'::jsonb,
  true,
  true,
  true,
  'Marco Rossi',
  '+1-555-0603',
  'confirmed',
  'Wood-fired oven setup area, propane connection, ventilation, power outlets (20A)',
  'YOUR_USER_ID_HERE'
);

-- =====================================================
-- END OF SAMPLE DATA
-- =====================================================
--
-- NEXT STEPS:
-- 1. Find your event_id: SELECT id, name FROM em_events LIMIT 5;
-- 2. Find your user_id: SELECT id, email FROM auth.users WHERE email LIKE '%admin%' LIMIT 5;
-- 3. Replace 'YOUR_EVENT_ID_HERE' and 'YOUR_USER_ID_HERE' in this script
-- 4. Run this script in Supabase SQL Editor
-- 5. Verify data was inserted: SELECT COUNT(*) FROM em_conference_sessions;
-- 6. Navigate to /dashboard/vision and click "Event Management" tab to see the data
-- =====================================================

