const UNAUTHENTICATED_MESSAGE = 'Unauthenticated.'
const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal server error'

export function isUnauthenticatedErrorMessage(message?: string) {
  return message?.trim() === UNAUTHENTICATED_MESSAGE
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function collectStringMessages(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value]
  }

  if (Array.isArray(value)) {
    return value.flatMap(item => collectStringMessages(item))
  }

  if (isRecord(value)) {
    return Object.values(value).flatMap(item => collectStringMessages(item))
  }

  return []
}

function getGraphQLErrors(error: unknown): unknown[] {
  if (!isRecord(error)) {
    return []
  }

  const errors = error.errors ?? error.graphQLErrors

  return Array.isArray(errors) ? errors : []
}

function getValidationMessage(error: unknown) {
  const messages = getGraphQLErrors(error).flatMap((graphqlError) => {
    if (!isRecord(graphqlError) || !isRecord(graphqlError.extensions)) {
      return []
    }

    return [
      ...collectStringMessages(graphqlError.extensions.validation),
      ...collectStringMessages(graphqlError.extensions.errors),
    ]
  })

  return messages.find(Boolean)
}

function getGraphQLMessage(error: unknown) {
  return getGraphQLErrors(error)
    .map((graphqlError) => {
      if (!isRecord(graphqlError)) {
        return undefined
      }

      return typeof graphqlError.message === 'string' ? graphqlError.message : undefined
    })
    .find(message => message && message !== INTERNAL_SERVER_ERROR_MESSAGE)
}

export default function getFriendlyErrorMessage(
  error: unknown,
  fallbackMessage = 'Something went wrong. Please try again.',
  unauthenticatedMessage = 'Please log in to continue.',
) {
  const validationMessage = getValidationMessage(error)

  if (validationMessage) {
    return validationMessage
  }

  const graphQLMessage = getGraphQLMessage(error)

  if (graphQLMessage) {
    return isUnauthenticatedErrorMessage(graphQLMessage)
      ? unauthenticatedMessage
      : graphQLMessage
  }

  if (error instanceof Error) {
    if (error.message === INTERNAL_SERVER_ERROR_MESSAGE) {
      return fallbackMessage
    }

    return isUnauthenticatedErrorMessage(error.message)
      ? unauthenticatedMessage
      : error.message
  }

  return fallbackMessage
}
