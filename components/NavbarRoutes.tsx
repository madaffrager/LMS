"use client"

import { UserButton } from "@clerk/nextjs"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { SearchInput } from "./searchInput"

const NavbarRoutes = () => {
  const pathname = usePathname()
  const isTeacherPage = pathname?.startsWith('/teacher')
  const isCoursePage = pathname?.includes('/courses')
  const isSearchPage = pathname === '/search'
  return (
    <>
    {isSearchPage && <div className="hidden md:block">
      <SearchInput/>
      </div>}
      <div className="flex gap-x-2 ml-auto">
        {isCoursePage || isTeacherPage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Disable Teacher Mode
            </Button>
          </Link>
        ) : (
          <div>
            <Link href="/teacher/courses">
              <Button>Enable Teacher Mode</Button>
            </Link>
          </div>
        )}
        <UserButton />
      </div>
    </>
  );
}

export default NavbarRoutes