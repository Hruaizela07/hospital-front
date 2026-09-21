import type { LoginMutation, LoginMutationVariables, MeQuery } from '~/gql/graphql'
import { useApolloClient, useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import z from 'zod'
import { Button } from '~/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { LOGINMUTATION } from '~/graphql/mutation/login-mutation'
import { ME_QUERY } from '~/graphql/query/me'
import { getRoleHomePath, storeUser } from '~/lib/auth-user'
import { safeRedirect } from '~/lib/utils/safe-redirect'

const schema = z.object({
  username: z.string().min(2, 'must be atlest 2 word'),
  password: z.string().min(8, 'must be atlest 8 word'),
})

export type schemaTypeLogin = z.infer<typeof schema>

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const apolloClient = useApolloClient()

  const [login, { loading, error }] = useMutation<LoginMutation, LoginMutationVariables>(LOGINMUTATION, {
    onError: () => toast.error('Invalid username or password'),
  })

  const form = useForm<schemaTypeLogin>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  useEffect(() => {
    const cacheMe = apolloClient.readQuery<MeQuery>({
      query: ME_QUERY,
    })?.me

    if (!cacheMe) {
      return
    }

    storeUser(cacheMe)
  })

  const onSubmit = async (value: schemaTypeLogin) => {
    try {
      const response = await login({
        variables: {
          username: value.username,
          password: value.password,
        },
      })
      if (response.data?.login) {
        const user = response.data.login

        apolloClient.writeQuery({
          query: ME_QUERY,
          data: {
            me: user,
          },
        })
        storeUser(user)
        toast.success(`Welcome back, ${user.userName}.`)
        form.reset()

        const params = new URLSearchParams(location.search)
        const fallbackPath = getRoleHomePath(user.role)
        navigate(safeRedirect(params.get('from'), fallbackPath), { replace: true })
      }
    }
    catch (err) {
      console.error(err)
    }
  }

  return (
    <div
      className="
        flex min-h-screen w-screen flex-col items-center justify-center
      "

    >
      <div className="
        mx-auto flex min-w-90 flex-col items-center justify-center
      "
      >
        <h1>Welcome Back</h1>
        <p>Login to continue</p>
        <div className="w-full">
          {error && (
            <p className="text-sm text-destructive">
              Invalid username or password
            </p>
          )}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">UserName</FieldLabel>
                <Input id="username" disabled={loading} {...form.register('username')} />
                <FieldError errors={[form.formState.errors.username]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" disabled={loading} {...form.register('password')} />
                <FieldError errors={[form.formState.errors.password]} />
              </Field>
              <Button type="submit" variant="default" disabled={loading}>Login</Button>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  )
}
