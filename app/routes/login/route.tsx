import type { LoginMutation, LoginMutationVariables, MeQuery } from '~/gql/graphql'
import { useApolloClient, useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import z from 'zod'
import { Button } from '~/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { LOGINMUTATION } from '~/graphql/mutation/login-mutation'
import { ME_QUERY } from '~/graphql/query/me'
import { storeUser } from '~/lib/auth-user'

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
      }
    }
    catch (err) {
      console.error(err)
    }
  }

  if (loading)
    return 'Submitting...'
  if (error)
    return `Submission error! ${error.message}`
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
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid>
                <FieldLabel htmlFor="username">UserName</FieldLabel>
                <Input id="username" aria-invalid />
                <FieldDescription>
                  This field must be filled out.
                </FieldDescription>
              </Field>
              <Field data-invalid>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" aria-invalid />
                <FieldDescription>
                  This field must be filled out.
                </FieldDescription>
              </Field>
              <Button>Login</Button>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  )
}
