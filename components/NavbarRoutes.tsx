"use client"

import { UserButton } from "@clerk/nextjs"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import Link from "next/link"

const NavbarRoutes = () => {
  const pathname = usePathname()
  const isTeacherPage = pathname?.startsWith('/teacher')
  const isPlayerPage = pathname?.includes('/chapter')
  return (
    <div className="flex gap-x-2 ml-auto">
      {(isPlayerPage || isTeacherPage )? (<Link href="/"><Button size="sm" variant="ghost"><LogOut className="h-4 w-4 mr-2"/>Teacher Mode OFF</Button></Link>):(<div><Link href="/teacher/courses"><Button>Teacher Mode ON</Button></Link></div>)
      }
      <UserButton />
    </div>
  )
}

export default NavbarRoutes