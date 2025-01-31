// components/ui/accordion.tsx
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

const Accordion = AccordionPrimitive.Root

const AccordionItem = ({ className, ...props }: any) => (
  <AccordionPrimitive.Item
    className={`border-b ${className || ''}`}
    {...props}
  />
)
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = ({ className, children, ...props }: any) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      className={`flex flex-1 items-center justify-between py-4 font-medium 
        transition-all hover:underline [&[data-state=open]>svg]:rotate-180 
        ${className || ''}`}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
)
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = ({ className, children, ...props }: any) => (
  <AccordionPrimitive.Content
    className={`overflow-hidden text-sm transition-all 
      data-[state=closed]:animate-accordion-up 
      data-[state=open]:animate-accordion-down 
      ${className || ''}`}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </AccordionPrimitive.Content>
)
AccordionContent.displayName = "AccordionContent"

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
}