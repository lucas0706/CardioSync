import { useCallback, useRef, useState } from 'react'

import type { UpdateCheckResult } from '../services/UpdateCheckerService'

import { UpdateCheckerService } from '../services/UpdateCheckerService'

export function useAppUpdate() {
  const pendingCheck = useRef<Promise<UpdateCheckResult | undefined> | null>(null)
  const [result, setResult] = useState<UpdateCheckResult | undefined>()

  const [checking, setChecking] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const checkForUpdate = useCallback((installedVersion?: string) => {
    if (pendingCheck.current) {
      return pendingCheck.current
    }

    setChecking(true)
    setError(null)

    const request = UpdateCheckerService.check(installedVersion)
      .then((next) => {
        setResult(next)
        return next
      })
      .catch((cause: unknown) => {
        setResult(undefined)
        setError(
          cause instanceof Error ? cause.message : 'No fue posible consultar las actualizaciones.',
        )
        return undefined
      })
      .finally(() => {
        pendingCheck.current = null
        setChecking(false)
      })

    pendingCheck.current = request
    return request
  }, [])

  return {
    result,
    checking,
    error,
    checkForUpdate,
  }
}
