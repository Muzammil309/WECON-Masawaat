'use client'

import { CheckCircle2, MoreVertical } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface ProjectRow {
  id: string
  name: string
  attendeeCount: number
  budget: string
  completion: number
  avatars?: string[]
}

interface ProjectsTableProps {
  projects: ProjectRow[]
  loading?: boolean
}

export function VisionProjectsTable({ projects, loading = false }: ProjectsTableProps) {
  if (loading) {
    return (
      <div className="vision-glass-card p-[24px]">
        <div className="mb-[24px]">
          <Skeleton className="h-[24px] w-[150px] bg-white/10" />
        </div>
        <div className="space-y-[16px]">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[60px] w-full bg-white/10" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="vision-glass-card p-[24px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-[24px]">
        <div className="flex items-center gap-[8px]">
          <h2
            className="text-[18px] font-bold text-white"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.4' }}
          >
            Projects
          </h2>
          <div className="flex items-center gap-[4px]">
            <CheckCircle2 className="h-[15px] w-[15px] text-[#01B574]" />
            <p
              className="text-[14px] text-[#A0AEC0]"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.4' }}
            >
              <span className="font-bold text-white">{projects.length} done</span>
              <span className="font-medium"> this month</span>
            </p>
          </div>
        </div>
        <button className="text-[#718096] hover:text-white transition-colors">
          <MoreVertical className="h-[20px] w-[20px]" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {/* Table Headers */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-[24px] mb-[16px] pb-[12px] border-b border-white/10">
          <p
            className="text-[10px] font-medium text-[#A0AEC0] tracking-wider"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.5' }}
          >
            COMPANIES
          </p>
          <p
            className="text-[10px] font-medium text-[#A0AEC0] tracking-wider"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.5' }}
          >
            MEMBERS
          </p>
          <p
            className="text-[10px] font-medium text-[#A0AEC0] tracking-wider"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.5' }}
          >
            BUDGET
          </p>
          <p
            className="text-[10px] font-medium text-[#A0AEC0] tracking-wider"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.5' }}
          >
            COMPLETION
          </p>
        </div>

        {/* Table Rows */}
        <div className="space-y-[16px]">
          {projects.length === 0 ? (
            <div className="py-[40px] text-center">
              <p
                className="text-[14px] font-medium text-[#A0AEC0]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                No events found
              </p>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-[24px] items-center py-[12px] border-b border-white/5 last:border-0"
              >
                {/* Event Name with Icon */}
                <div className="flex items-center gap-[12px]">
                  <div className="flex items-center justify-center w-[40px] h-[40px] rounded-[12px] bg-gradient-to-br from-[#4318FF] to-[#7551FF] text-white font-bold text-[16px]">
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <p
                    className="text-[14px] font-medium text-white"
                    style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                  >
                    {project.name}
                  </p>
                </div>

                {/* Attendee Count */}
                <div className="flex items-center gap-[8px]">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-[24px] h-[24px] rounded-full bg-gradient-to-br from-[#4318FF] to-[#7551FF] border-2 border-[#1A1F37] flex items-center justify-center text-white text-[10px] font-bold"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <p
                    className="text-[14px] font-medium text-white"
                    style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                  >
                    {project.attendeeCount}
                  </p>
                </div>

                {/* Budget */}
                <p
                  className="text-[14px] font-bold text-white"
                  style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                >
                  {project.budget}
                </p>

                {/* Completion Progress */}
                <div className="flex items-center gap-[8px]">
                  <div className="flex-1 h-[6px] bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#4318FF] to-[#7551FF] rounded-full transition-all"
                      style={{ width: `${project.completion}%` }}
                    />
                  </div>
                  <p
                    className="text-[14px] font-bold text-white min-w-[40px]"
                    style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                  >
                    {project.completion}%
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

