import getFriendlyErrorMessage from './get-friendly-error-message'

export default function getSubmitErrorMessage(
  error: unknown,
  fallbackMessage = 'Something went wrong. Please try again.',
) {
  return getFriendlyErrorMessage(error, fallbackMessage)
}
