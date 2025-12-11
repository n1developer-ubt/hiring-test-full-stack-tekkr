import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "./ui/select"
import { useModelsQuery } from "../data/queries/models"
import Spinner from "./ui/spinner"

interface Props {
   value: string
   onChange: (value: string) => void
}

export function ModelSelector({ value, onChange }: Props) {
   const { data: models, isLoading } = useModelsQuery()

   if (isLoading) {
      return (
         <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Spinner />
            Loading models...
         </div>
      )
   }

   return (
      <Select value={value} onValueChange={onChange}>
         <SelectTrigger className='w-[200px]'>
            <SelectValue placeholder='Select a model' />
         </SelectTrigger>
         <SelectContent>
            {models?.map((model) => (
               <SelectItem key={model.id} value={model.id}>
                  {model.name}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   )
}
