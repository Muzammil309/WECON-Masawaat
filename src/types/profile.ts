// =====================================================
// Profile & Gamification Types
// =====================================================

export interface EnhancedProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'admin' | 'speaker' | 'attendee'
  
  // Enhanced fields
  company: string | null
  bio: string | null
  networking_interests: string[] // Array of interest tags
  linkedin_url: string | null
  twitter_url: string | null
  github_url: string | null
  website_url: string | null
  phone: string | null
  job_title: string | null
  location: string | null
  timezone: string
  preferences: UserPreferences
  total_points: number
  profile_completed: boolean
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  notifications?: {
    email?: boolean
    push?: boolean
    sms?: boolean
  }
  theme?: 'light' | 'dark' | 'system'
  language?: string
  timezone?: string
  privacy?: {
    show_email?: boolean
    show_phone?: boolean
    allow_networking?: boolean
  }
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string // Lucide icon name or emoji
  category: 'networking' | 'attendance' | 'engagement' | 'achievement'
  points: number
  criteria: BadgeCriteria
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  color: string // Tailwind color name
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BadgeCriteria {
  sessions_attended?: number
  connections?: number
  questions_asked?: number
  polls_voted?: number
  resources_downloaded?: number
  booths_visited?: number
  days_before_event?: number
  ticket_type?: string
  is_speaker?: boolean
  attendance_rate?: number
  [key: string]: any // Allow custom criteria
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  progress: Record<string, any>
  is_displayed: boolean
  
  // Joined data
  badge?: Badge
}

export interface PointsEntry {
  id: string
  user_id: string
  event_id: string | null
  activity_type: ActivityType
  points: number
  metadata: Record<string, any>
  created_at: string
}

export type ActivityType =
  | 'session_attendance'
  | 'networking_connection'
  | 'poll_participation'
  | 'question_asked'
  | 'resource_download'
  | 'booth_visit'
  | 'profile_completion'
  | 'event_registration'
  | 'referral'
  | 'social_share'

// =====================================================
// Form Types
// =====================================================

export interface ProfileFormData {
  full_name: string
  email: string
  company?: string
  job_title?: string
  bio?: string
  location?: string
  phone?: string
  linkedin_url?: string
  twitter_url?: string
  github_url?: string
  website_url?: string
  networking_interests: string[]
  timezone?: string
}

export interface AvatarUploadResult {
  url: string
  path: string
  error?: string
}

// =====================================================
// API Response Types
// =====================================================

export interface ProfileResponse {
  profile: EnhancedProfile
  badges: UserBadge[]
  total_points: number
  rank?: number // User's rank in leaderboard
}

export interface LeaderboardEntry {
  user_id: string
  full_name: string
  avatar_url: string | null
  company: string | null
  total_points: number
  rank: number
  badges_count: number
}

export interface BadgeProgress {
  badge: Badge
  current_progress: number
  required_progress: number
  percentage: number
  is_earned: boolean
}

// =====================================================
// Utility Types
// =====================================================

export interface ProfileCompletionStatus {
  is_complete: boolean
  completion_percentage: number
  missing_fields: string[]
  suggestions: string[]
}

export const INTEREST_CATEGORIES = [
  'Technology',
  'AI & Machine Learning',
  'Web Development',
  'Mobile Development',
  'DevOps',
  'Cloud Computing',
  'Cybersecurity',
  'Data Science',
  'Blockchain',
  'IoT',
  'AR/VR',
  'Gaming',
  'Design',
  'Marketing',
  'Sales',
  'Product Management',
  'Entrepreneurship',
  'Finance',
  'Healthcare',
  'Education',
  'Sustainability',
  'Social Impact',
] as const

export type InterestCategory = typeof INTEREST_CATEGORIES[number]

export const BADGE_RARITIES = {
  common: {
    color: 'gray',
    label: 'Common',
    gradient: 'from-gray-400 to-gray-600',
  },
  rare: {
    color: 'blue',
    label: 'Rare',
    gradient: 'from-blue-400 to-blue-600',
  },
  epic: {
    color: 'purple',
    label: 'Epic',
    gradient: 'from-purple-400 to-purple-600',
  },
  legendary: {
    color: 'amber',
    label: 'Legendary',
    gradient: 'from-amber-400 to-amber-600',
  },
} as const

export const ACTIVITY_POINTS = {
  session_attendance: 10,
  networking_connection: 15,
  poll_participation: 5,
  question_asked: 8,
  resource_download: 3,
  booth_visit: 12,
  profile_completion: 50,
  event_registration: 20,
  referral: 25,
  social_share: 10,
} as const

