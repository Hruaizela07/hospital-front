import type { LogoutMutation, LogoutMutationVariables } from '~/gql/graphql'
import { useApolloClient, useMutation } from '@apollo/client/react'
import { LOGOUT } from '~/graphql/mutation/logout'
import { replaceSessionUser } from '~/lib/auth-session'

export default function useLogout() {
  const apolloClient = useApolloClient()
  const [logoutMutation, { data, error, loading }] = useMutation<LogoutMutation, LogoutMutationVariables>(LOGOUT)

  const logout = async () => {
    const response = await logoutMutation()
    if (response.data?.logout) {
      await replaceSessionUser(apolloClient, null)
    }
    return response
  }
  return {
    logout,
    data,
    error,
    loading,
  }
}
