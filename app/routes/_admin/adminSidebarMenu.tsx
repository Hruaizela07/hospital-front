import type { ComponentType } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { Building, HeartPlus, LogOut, Notebook, User } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '~/components/ui/sidebar'
import { UserRole } from '~/gql/graphql'
import { ME_QUERY } from '~/graphql/query/me'
import useLogout from '~/hooks/use-logout'
import { readStoredUser } from '~/lib/auth-user'

interface MeQueriesData {
  me: {
    id: string
    role: UserRole
    userName: string
  } | null
}

interface menuItem {
  icon: ComponentType <{ className?: string }>
  roles: UserRole[]
  title: string
  url: string
}

const admin = [UserRole.Admin]
const Admindoctor = [UserRole.Admin, UserRole.Doctors]

const menu: menuItem[] = [
  { icon: HeartPlus, title: 'Doctors', url: '/doctors', roles: admin },
  { icon: Building, title: 'Departments', url: '/departments', roles: admin },
  { icon: User, title: 'Patients', url: '/patients', roles: Admindoctor },
  { icon: Notebook, title: 'Appointments', url: '/appointments', roles: Admindoctor },
  { icon: Notebook, title: 'Duty', url: '/doctorDuty', roles: Admindoctor },
  { icon: Notebook, title: 'Doctor Leaves', url: '/doctor-leaves', roles: admin },
]

export default function AdminSidebarMenu() {
  const navigate = useNavigate()
  const apolloClient = useApolloClient()
  const { isMobile, setOpenMobile, setOpen } = useSidebar()
  const [storedUser] = useState<MeQueriesData['me']>(() => readStoredUser())
  const cachedUser = apolloClient.readQuery<MeQueriesData>({
    query: ME_QUERY,
  })?.me

  const { logout, error, loading } = useLogout()

  const { data } = useQuery<MeQueriesData>(ME_QUERY, {
    fetchPolicy: 'cache-first',
  })

  const user = cachedUser ?? data?.me ?? storedUser
  const adminMenu = menu.filter(item => user && item.roles.includes(user.role))

  const closeResponsiveSidebar = () => {
    if (isMobile) {
      setOpen(false)
      setOpenMobile(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await logout()
      if (response.data?.logout) {
        navigate('/login')
      }
    }
    catch (logoutError) {
      console.error(logoutError)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div>Hospital</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupLabel>Head</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {adminMenu.map((item) => {
              const Icon = item.icon
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={location.pathname.startsWith(item.url)}
                    render={<NavLink to={item.url} />}
                    onClick={closeResponsiveSidebar}
                    tooltip={item.title}
                  >
                    <Icon />
                    <div>{item.title}</div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarFooter>
          {error && (
            <p className="px-2 text-sm text-destructive">{error.message}</p>
          )}
          <Button
            onClick={handleLogout}
            isLoading={loading}
            variant="destructive"
            className="
              w-full border bg-red-600/70 text-white
              group-data-[collapsible=icon]:size-8
              group-data-[collapsible=icon]:p-0
              hover:cursor-pointer hover:bg-red-400
            "
          >
            <LogOut className="" />
            <span className="group-data-[collapsible=icon]:hidden">
              Logout
            </span>
          </Button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}
