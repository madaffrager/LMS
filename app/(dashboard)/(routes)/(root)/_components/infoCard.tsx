import { IconBadge } from "@/components/IconBadge"
import { Icon, LucideIcon } from "lucide-react"

interface InfoCardProps{
    icon:LucideIcon
    variant:'default'|'success'
    label:string
    numberOfItems:number}
export const InfoCard = ({variant,numberOfItems,label,icon:Icon}:InfoCardProps)=>{
    return (<div className="border rounded-md flex items-center gap-x-2 p-3">
        <IconBadge icon={Icon} variant={variant}/>
        <div>
            <p className="font-medium ">
                {label}
            </p>
            <p className="text-grey-500 text-sm">
                {numberOfItems} {numberOfItems === 1 ? 'course':'courses'}
            </p>
        </div>
    </div>)
}