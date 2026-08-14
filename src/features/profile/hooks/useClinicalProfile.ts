import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  useFocusEffect,
} from 'expo-router'

import type {
  ClinicalContext,
} from '@/domain/clinical/models/ClinicalContext'

import {
  LOCAL_PROFILE_ID,
} from '@/features/profile/constants'

import {
  clinicalProfileService,
} from '@/features/profile/services'

type Listener = () => void

const listeners = new Set<Listener>()

function notifyProfileChanged() {
  listeners.forEach(listener => {
    listener()
  })
}

function readProfile():
  ClinicalContext | undefined {
  return clinicalProfileService.get(
    LOCAL_PROFILE_ID,
  )
}

export function notifyClinicalProfileChanged() {
  notifyProfileChanged()
}

export function useClinicalProfile() {
  const [profile, setProfile] =
    useState<ClinicalContext | undefined>(
      readProfile(),
    )

  const refresh = useCallback(() => {
    setProfile(readProfile())
  }, [])

  useEffect(() => {
    const listener = () => {
      refresh()
    }

    listeners.add(listener)

    return () => {
      listeners.delete(listener)
    }
  }, [refresh])

  useFocusEffect(
    useCallback(() => {
      refresh()
    }, [refresh]),
  )

  return {
    profile,
    refresh,
  }
}
