// components/ui/priority-select.tsx
"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertCircle, AlertTriangle, Circle, Flag, Timer } from "lucide-react"

const PRIORITIES = ['0', '1', '2', '3', '4'] as const
type Priority = typeof PRIORITIES[number]

const PRIORITY_LABELS: Record<Priority, string> = {
  '0': 'No Priority',
  '1': 'Urgent',
  '2': 'High',
  '3': 'Medium',
  '4': 'Low',
}

const PRIORITY_COLORS: Record<Priority, string> = {
  '0': 'bg-gray-100 text-gray-600',
  '1': 'bg-red-100 text-red-700',
  '2': 'bg-orange-100 text-orange-700',
  '3': 'bg-blue-100 text-blue-700',
  '4': 'bg-green-100 text-green-700',
}

const PRIORITY_ICONS: Record<Priority, React.ReactNode> = {
  '0': <Circle className="w-4 h-4" />,
  '1': <AlertCircle className="w-4 h-4 text-red-600" />,
  '2': <AlertTriangle className="w-4 h-4 text-orange-600" />,
  '3': <Timer className="w-4 h-4 text-blue-600" />,
  '4': <Flag className="w-4 h-4 text-green-600" />,
}

interface PrioritySelectProps {
  value: Priority
  onChange: (value: Priority) => void
  className?: string
}

export function PrioritySelect({ value, onChange, className }: PrioritySelectProps) {
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      const key = e.key;
      if (PRIORITIES.includes(key as Priority)) {
        onChange(key as Priority);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onChange]);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`
        ${className}
        group
        transition-all duration-200
        hover:ring-2 hover:ring-offset-2 hover:ring-gray-200
        focus:ring-2 focus:ring-offset-2 focus:ring-gray-300
      `}>
        <SelectValue>
          <div className="flex items-center space-x-2">
            <div className={`
              ${PRIORITY_COLORS[value]}
              p-1.5 rounded-full
              transition-colors duration-200
              group-hover:opacity-80
            `}>
              {PRIORITY_ICONS[value]}
            </div>
            <span className="text-sm font-medium text-gray-900">
              {PRIORITY_LABELS[value]}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white border-gray-200 shadow-lg">
        {(Object.entries(PRIORITY_LABELS) as [Priority, string][]).map(([priority, label]) => (
          <SelectItem 
            key={priority} 
            value={priority}
            className={`
              relative
              transition-all duration-150
              cursor-pointer
              rounded-nav
              hover:bg-black/5 hover:backdrop-blur-nav-hover
            `}
          >
            <div className="flex items-center space-x-2 px-3 py-1.5">
              <div className={`
                ${PRIORITY_COLORS[priority]}
                p-1.5 rounded-full
                transition-colors duration-200
              `}>
                {PRIORITY_ICONS[priority]}
              </div>
              <span className="text-sm font-medium text-[rgba(29,29,31,0.88)]">
                {label}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { PRIORITIES, type Priority, PRIORITY_LABELS }