# Event Management Sample Data

This directory contains SQL scripts to populate the Event Management tables with realistic sample data for testing the UI components.

## 📁 Files

- **`find_ids_helper.sql`** - Helper queries to find required IDs from your database
- **`event_management_sample_data.sql`** - Main script with sample data for all 7 tables

## 🎯 What Sample Data is Included

### 1. **Conference Sessions** (3 records)
- ✅ Keynote: "The Future of AI in Healthcare" (Happening Now)
- ✅ Panel: "Sustainable Business Practices Panel" (Upcoming)
- ✅ Presentation: "Blockchain Beyond Cryptocurrency" (Completed)

### 2. **Learning Labs** (3 records)
- ✅ Beginner: "Introduction to Python Programming"
- ✅ Intermediate: "Advanced Data Analytics with R" (Full capacity)
- ✅ Advanced: "Machine Learning Model Deployment"

### 3. **Roundtables** (3 records)
- ✅ "Women in Tech Leadership" (Forming)
- ✅ "Startup Funding Strategies" (Confirmed)
- ✅ "Cybersecurity Best Practices" (Forming)

### 4. **Skill Clinics** (3 records)
- ✅ "Public Speaking Mastery" (With Certification)
- ✅ "Agile Project Management Fundamentals" (No Certification)
- ✅ "Digital Marketing Analytics" (With Certification)

### 5. **Startup Stories** (3 records)
- ✅ EcoTrack Solutions - CleanTech (Series A, Confirmed)
- ✅ HealthBridge AI - HealthTech (Seed, Confirmed)
- ✅ EduLearn Pro - EdTech (Pre-seed, Pending)

### 6. **Exhibitors** (5 records - one from each tier)
- 💎 Diamond: TechCorp Global - Enterprise Software
- ⭐ Platinum: InnovateLabs Inc - IoT & Hardware
- 🥇 Gold: DataViz Solutions - Data Analytics
- 🥈 Silver: CloudSecure Systems - Cybersecurity
- 🥉 Bronze: StartupHub Accelerator - Startup Ecosystem

### 7. **Food Vendors** (3 records - different price ranges)
- 💵 Budget: Street Tacos Express - Mexican
- 💰 Moderate: Green Bowl Cafe - Healthy/Organic
- 💎 Premium: Artisan Pizza Co - Italian

## 🚀 Quick Start Guide

### Step 1: Find Required IDs

1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the contents of **`find_ids_helper.sql`**
3. Run the script
4. Copy the following values from the results:
   - **event_id** (from query 1)
   - **user_id** (from query 2)

### Step 2: Update Sample Data Script

1. Open **`event_management_sample_data.sql`** in your code editor
2. Use **Find & Replace** (Ctrl+H or Cmd+H):
   - Find: `YOUR_EVENT_ID_HERE`
   - Replace with: Your actual event_id (e.g., `550e8400-e29b-41d4-a716-446655440000`)
3. Use **Find & Replace** again:
   - Find: `YOUR_USER_ID_HERE`
   - Replace with: Your actual user_id (e.g., `123e4567-e89b-12d3-a456-426614174000`)
4. Save the file

### Step 3: Insert Sample Data

1. Go back to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the **entire contents** of the updated **`event_management_sample_data.sql`**
3. Click **Run** or press **Ctrl+Enter**
4. Wait for the success message: "Success. No rows returned"

### Step 4: Verify Data Insertion

Run this query in SQL Editor to verify:

```sql
SELECT 
  'em_conference_sessions' as table_name, COUNT(*) as records FROM em_conference_sessions
UNION ALL
SELECT 'em_learning_labs', COUNT(*) FROM em_learning_labs
UNION ALL
SELECT 'em_roundtables', COUNT(*) FROM em_roundtables
UNION ALL
SELECT 'em_skill_clinics', COUNT(*) FROM em_skill_clinics
UNION ALL
SELECT 'em_startup_stories', COUNT(*) FROM em_startup_stories
UNION ALL
SELECT 'em_exhibitors', COUNT(*) FROM em_exhibitors
UNION ALL
SELECT 'em_food_vendors', COUNT(*) FROM em_food_vendors;
```

**Expected Result:**
```
em_conference_sessions  | 3
em_learning_labs        | 3
em_roundtables          | 3
em_skill_clinics        | 3
em_startup_stories      | 3
em_exhibitors           | 5
em_food_vendors         | 3
```

### Step 5: View in Dashboard

1. Navigate to **https://wecon-masawaaat.vercel.app/dashboard/vision**
2. Click on the **"Event Management"** tab (9th tab)
3. Explore all 7 sub-tabs to see the sample data displayed

## 🔍 Troubleshooting

### Error: "violates foreign key constraint"
- **Cause:** Invalid `event_id` or `created_by` user_id
- **Solution:** Re-run `find_ids_helper.sql` and verify you're using correct IDs

### Error: "duplicate key value violates unique constraint"
- **Cause:** Sample data already exists
- **Solution:** Either delete existing data or skip this step

### No data showing in dashboard
- **Cause:** RLS policies might be filtering data
- **Solution:** Verify you're logged in as an admin user

## 🗑️ Cleanup (Optional)

To remove all sample data:

```sql
DELETE FROM em_conference_sessions WHERE title LIKE '%AI in Healthcare%';
DELETE FROM em_learning_labs WHERE title LIKE '%Python Programming%';
DELETE FROM em_roundtables WHERE title LIKE '%Women in Tech%';
DELETE FROM em_skill_clinics WHERE title LIKE '%Public Speaking%';
DELETE FROM em_startup_stories WHERE startup_name LIKE '%EcoTrack%';
DELETE FROM em_exhibitors WHERE company_name LIKE '%TechCorp%';
DELETE FROM em_food_vendors WHERE vendor_name LIKE '%Street Tacos%';
```

## 📝 Notes

- All timestamps use `NOW()` + intervals, so sessions will appear as upcoming/happening/completed relative to when you insert the data
- JSONB fields are properly formatted for tags, menu items, social media, etc.
- All exhibitor tiers are represented to test the tier grouping feature
- Different price ranges for food vendors test the price badge display
- Certification flags vary to test conditional badge rendering

## ✅ Success Criteria

After inserting sample data, you should see:
- ✅ Conference Sessions tab shows 3 sessions with different statuses and types
- ✅ Learning Labs tab shows 3 labs with different difficulty levels
- ✅ Roundtables tab shows 3 discussions with participant counts
- ✅ Skill Clinics tab shows 3 clinics (2 with certification badges)
- ✅ Startup Stories tab shows 3 startups with different funding stages
- ✅ Exhibitors tab shows 5 companies grouped by tier (Diamond → Bronze)
- ✅ Food Court tab shows 3 vendors with different price ranges and payment options

