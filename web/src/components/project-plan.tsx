import { useState } from "react"
import { ChevronDown } from "lucide-react"
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from "./ui/collapsible"
import { Card, CardContent, CardHeader } from "./ui/card"
import { cn } from "../lib/utils"
import { ProjectPlan as ProjectPlanType, Workstream } from "../data/types"

interface Props {
   plan: ProjectPlanType
}

export function ProjectPlanView({ plan }: Props) {
   return (
      <div className='my-4 w-full rounded-lg border bg-muted/30 p-4'>
         <h3 className='mb-4 text-lg font-semibold'>Project Workstreams</h3>
         <div className='flex flex-col gap-3'>
            {plan.workstreams.map((workstream, index) => (
               <WorkstreamCard
                  key={index}
                  workstream={workstream}
                  letter={String.fromCharCode(65 + index)}
               />
            ))}
         </div>
      </div>
   )
}

interface WorkstreamCardProps {
   workstream: Workstream
   letter: string
}

function WorkstreamCard({ workstream, letter }: WorkstreamCardProps) {
   const [isOpen, setIsOpen] = useState(false)

   return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className='w-full'>
         <Card className='w-full'>
            <CollapsibleTrigger asChild>
               <CardHeader className='cursor-pointer hover:bg-accent/50 transition-colors'>
                  <div className='flex items-center justify-between'>
                     <div className='flex items-center gap-3'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium'>
                           {letter}
                        </div>
                        <span className='font-medium'>{workstream.title}</span>
                     </div>
                     <ChevronDown
                        className={cn(
                           "h-5 w-5 text-muted-foreground transition-transform",
                           isOpen && "rotate-180"
                        )}
                     />
                  </div>
               </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
               <CardContent className='pt-0'>
                  <p className='mb-4 text-sm text-muted-foreground'>
                     {workstream.description}
                  </p>
                  {workstream.deliverables &&
                     workstream.deliverables.length > 0 && (
                        <div className='border-t pt-4'>
                           <h4 className='mb-3 text-sm font-semibold'>
                              Deliverables
                           </h4>
                           <div className='flex flex-col gap-3'>
                              {workstream.deliverables.map(
                                 (deliverable, index) => (
                                    <div
                                       key={index}
                                       className='flex flex-col gap-1'>
                                       <span className='text-sm font-medium'>
                                          {deliverable.title}
                                       </span>
                                       <span className='text-sm text-muted-foreground'>
                                          {deliverable.description}
                                       </span>
                                    </div>
                                 )
                              )}
                           </div>
                        </div>
                     )}
               </CardContent>
            </CollapsibleContent>
         </Card>
      </Collapsible>
   )
}

export function parseProjectPlan(
   content: string
): { text: string; plan: ProjectPlanType | null }[] {
   const parts: { text: string; plan: ProjectPlanType | null }[] = []
   const regex = /```project-plan\n([\s\S]*?)```/g
   let lastIndex = 0
   let match

   while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
         parts.push({ text: content.slice(lastIndex, match.index), plan: null })
      }

      try {
         const planJson = JSON.parse(match[1])
         parts.push({ text: "", plan: planJson })
      } catch {
         parts.push({ text: match[0], plan: null })
      }

      lastIndex = regex.lastIndex
   }

   if (lastIndex < content.length) {
      parts.push({ text: content.slice(lastIndex), plan: null })
   }

   return parts
}
