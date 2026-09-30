import { ApolloLink, Observable } from '@apollo/client'

export class SessionBoundaryLink extends ApolloLink {
  readonly invalidate: () => void

  constructor() {
    let generation = 0
    super((operation, forward) => new Observable((observer) => {
      const startedInGeneration = generation
      const sessionChanged = () => new Error('Authentication session changed.')
      const subscription = forward(operation).subscribe({
        next: (result) => {
          if (startedInGeneration !== generation) {
            observer.error(sessionChanged())
            return
          }
          observer.next(result)
        },
        error: (error) => {
          observer.error(startedInGeneration === generation ? error : sessionChanged())
        },
        complete: () => observer.complete(),
      })
      return () => subscription.unsubscribe()
    }))
    this.invalidate = () => {
      generation += 1
    }
  }
}
