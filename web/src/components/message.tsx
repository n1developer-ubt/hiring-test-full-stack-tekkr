import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "../lib/utils"
import Spinner from "./ui/spinner"
import { BotIcon, UserIcon } from "lucide-react"
import { ProjectPlanView, parseProjectPlan } from "./project-plan"

export type Message = { role: "user" | "assistant"; content: string }

export function MessageContainer({
   role,
   children,
}: React.PropsWithChildren<{ role: Message["role"] }>) {
   return (
      <div
         className={cn(
            "flex flex-col gap-2",
            role === "user" ? "items-end" : "items-start"
         )}>
         <div className='flex flex-row items-center gap-1 rounded-full bg-accent py-1.5 pe-3 ps-1.5 text-xs font-semibold'>
            {role === "assistant" && (
               <BotIcon className='me-1 inline-block h-4 w-4' />
            )}
            {role === "user" && (
               <UserIcon className='me-1 inline-block h-4 w-4' />
            )}
            {role === "user" ? "You" : "Assistant"}
         </div>
         <div
            className={cn(
               role === "user"
                  ? "pe-2 ps-16"
                  : "flex w-full flex-col items-start pe-16 ps-2"
            )}>
            {children}
         </div>
      </div>
   )
}

export function MessageContent({ content }: { content: string }) {
   const parts = parseProjectPlan(content)

   return (
      <div className='w-full'>
         {parts.map((part, index) => {
            if (part.plan) {
               return <ProjectPlanView key={index} plan={part.plan} />
            }
            if (part.text.trim()) {
               return (
                  <div
                     key={index}
                     className='prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-pre:bg-muted prose-pre:text-foreground prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none'>
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {part.text}
                     </ReactMarkdown>
                  </div>
               )
            }
            return null
         })}
      </div>
   )
}

export function AssistantLoadingIndicator() {
   return (
      <MessageContainer role='assistant'>
         <div className='flex flex-row items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-muted-foreground'>
            <Spinner />
            Working on it...
         </div>
      </MessageContainer>
   )
}
