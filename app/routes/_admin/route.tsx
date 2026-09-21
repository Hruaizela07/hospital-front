import { Outlet } from 'react-router'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import AdminSidebarMenu from './adminSidebarMenu'

export default function Admin() {
  return (
    <div>
      <SidebarProvider>
        <AdminSidebarMenu />
        <main className="flex grow overflow-hidden">
          <SidebarTrigger className="shrink-0" />
          <div className="flex w-full grow flex-col">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}
