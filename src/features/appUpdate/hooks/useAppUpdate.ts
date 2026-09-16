import {
  useCallback,
  useState,
} from 'react'

import type {
  UpdateCheckResult,
} from '../services/UpdateCheckerService'

import {
  UpdateCheckerService,
} from '../services/UpdateCheckerService'

export function useAppUpdate() {
  const [
    result,
    setResult,
  ] = useState<
    UpdateCheckResult | undefined
  >()

  const [
    checking,
    setChecking,
  ] = useState(false)

  const checkForUpdate =
    useCallback(async () => {
      setChecking(true)

      try {
        const next =
          await UpdateCheckerService.check()

        setResult(next)

        return next
      } finally {
        setChecking(false)
      }
    }, [])

  return {
    result,
    checking,
    checkForUpdate,
  }
}
