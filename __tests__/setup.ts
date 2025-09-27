import '@testing-library/jest-dom'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      signInWithOAuth: jest.fn(),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        download: jest.fn(),
        remove: jest.fn(),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'mock-url' } }),
      })),
    },
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
      track: jest.fn(),
    })),
    removeAllChannels: jest.fn(),
  }),
}))

// Mock toast notifications
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
  Toaster: () => null,
}))

// Mock QR code generation
jest.mock('qrcode', () => ({
  toCanvas: jest.fn((canvas, text, options, callback) => {
    if (callback) callback(null)
  }),
}))

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => children,
  BarChart: ({ children }: any) => ({ type: 'div', props: { 'data-testid': 'bar-chart', children } }),
  Bar: () => ({ type: 'div', props: { 'data-testid': 'bar' } }),
  XAxis: () => ({ type: 'div', props: { 'data-testid': 'x-axis' } }),
  YAxis: () => ({ type: 'div', props: { 'data-testid': 'y-axis' } }),
  CartesianGrid: () => ({ type: 'div', props: { 'data-testid': 'cartesian-grid' } }),
  Tooltip: () => ({ type: 'div', props: { 'data-testid': 'tooltip' } }),
  PieChart: ({ children }: any) => ({ type: 'div', props: { 'data-testid': 'pie-chart', children } }),
  Pie: () => ({ type: 'div', props: { 'data-testid': 'pie' } }),
  Cell: () => ({ type: 'div', props: { 'data-testid': 'cell' } }),
  LineChart: ({ children }: any) => ({ type: 'div', props: { 'data-testid': 'line-chart', children } }),
  Line: () => ({ type: 'div', props: { 'data-testid': 'line' } }),
}))

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest.fn((date, formatStr) => {
    if (formatStr === 'PPP') return 'January 1, 2024'
    if (formatStr === 'PPp') return 'January 1, 2024 at 12:00 PM'
    if (formatStr === 'HH:mm') return '12:00'
    if (formatStr === 'p') return '12:00 PM'
    return '2024-01-01'
  }),
  isAfter: jest.fn(() => false),
  isBefore: jest.fn(() => false),
  addMinutes: jest.fn((date, minutes) => date),
  isSameDay: jest.fn(() => false),
}))

// Suppress console errors during tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
