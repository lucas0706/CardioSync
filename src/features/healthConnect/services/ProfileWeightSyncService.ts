import {
  clinicalProfileRepository,
} from '@/core/database/ClinicalProfileRepository'

import {
  LOCAL_PROFILE_ID,
} from '@/features/profile/constants'

import {
  weightSyncService,
} from './WeightSyncService'

export class ProfileWeightSyncService {
  async syncLatestWeight(): Promise<void> {
    const weights =
      await weightSyncService
        .readLast30Days()

    if (
      weights.length === 0
    ) {
      return
    }

    const latestWeight =
      [...weights].sort(
        (a, b) =>
          new Date(
            b.dateTime,
          ).getTime() -
          new Date(
            a.dateTime,
          ).getTime(),
      )[0]

    const profile =
      clinicalProfileRepository
        .getByPatientId(
          LOCAL_PROFILE_ID,
        )

    if (!profile) {
      return
    }

    clinicalProfileRepository.save({
      ...profile,

      weight:
        Number(
          latestWeight.weightKg.toFixed(
            1,
          ),
        ),
    })

    console.log(
      '[HC PROFILE WEIGHT]',
      latestWeight.weightKg,
    )
  }
}

export const
  profileWeightSyncService =
    new ProfileWeightSyncService()
