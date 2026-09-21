import type { ComponentType } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { Building, HeartPlus } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router'
import { Sidebar, SidebarContent, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '~/components/ui/sidebar'
import { UserRole } from '~/gql/graphql'
import { ME_QUERY } from '~/graphql/query/me'
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

const menu: menuItem[] = [
  { icon: HeartPlus, title: 'Doctors', url: '/doctors', roles: admin },
  { icon: Building, title: 'Departments', url: '/departments', roles: admin },
]

export default function AdminSidebarMenu() {
  // const navigate = useNavigate()
  const apolloClient = useApolloClient()
  const { isMobile, setOpenMobile, setOpen } = useSidebar()
  const [storedUser] = useState<MeQueriesData['me']>(() => readStoredUser())
  const cachedUser = apolloClient.readQuery<MeQueriesData>({
    query: ME_QUERY,
  })?.me

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
      </SidebarContent>
    </Sidebar>
  )
}
