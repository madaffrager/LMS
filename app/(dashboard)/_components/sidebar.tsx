import SidebarRoutes from './SidebarRoutes'
import Logo from './logo'

const Sidebar = () => {
  return (
    <div className='h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm'>
        <div className='p-6'><Logo/></div>
        <div className='flex w-full flex-col'>
            <SidebarRoutes />
        </div>
    </div>
  )
}

export default Sidebar