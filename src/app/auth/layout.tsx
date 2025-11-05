export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div 
      className="min-h-screen w-full"
      style={{ 
        background: '#0F1535',
        overflow: 'hidden'
      }}
    >
      {children}
    </div>
  )
}

