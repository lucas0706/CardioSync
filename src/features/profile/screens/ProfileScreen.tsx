import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native'
import { useEffect, useState } from 'react'

import {
  Screen,
  Text,
  Button,
} from '@/components/ui'

import {
  NumberField,
  TextField,
} from '@/components/ui/form'

import { theme } from '@/theme'

import type { ClinicalContext } from '@/domain/clinical/models/ClinicalContext'

import {
  clinicalProfileService,
} from '../services'

import {
  notifyClinicalProfileChanged,
  useClinicalProfile,
} from '../hooks'

import { LOCAL_PROFILE_ID } from '../constants'

const SEX_OPTIONS = [
  {
    label: 'Masculino',
    value: 'male',
  },
  {
    label: 'Femenino',
    value: 'female',
  },
] as const

interface BooleanFieldProps {
  label: string
  description?: string
  value?: boolean
  onChange: (value: boolean) => void
}

function BooleanField({
  label,
  description,
  value,
  onChange,
}: BooleanFieldProps) {
  return (
    <View style={styles.booleanField}>
      <View style={styles.booleanText}>
        <Text style={styles.fieldLabel}>
          {label}
        </Text>

        {description ? (
          <Text style={styles.booleanDescription}>
            {description}
          </Text>
        ) : null}
      </View>

      <Switch
        value={value === true}
        onValueChange={onChange}
        trackColor={{
          false: '#D1D5DB',
          true: '#22C55E',
        }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#D1D5DB"
        accessibilityLabel={label}
      />
    </View>
  )
}

function SexSelector({
  value,
  onChange,
}: {
  value?: ClinicalContext['sex']
  onChange: (
    value: ClinicalContext['sex'],
  ) => void
}) {
  return (
    <View style={styles.sexField}>
      <Text style={styles.fieldLabel}>
        Sexo
      </Text>

      <View style={styles.sexOptions}>
        {SEX_OPTIONS.map(option => {
          const selected =
            value === option.value

          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{
                selected,
              }}
              onPress={() =>
                onChange(option.value)
              }
              style={[
                styles.sexOption,
                selected &&
                  styles.sexOptionSelected,
              ]}
            >
              <Text
                style={[
                  styles.sexOptionText,
                  selected &&
                    styles.sexOptionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

function calculateBmi(
  height?: number,
  weight?: number,
): number | undefined {
  if (
    height === undefined ||
    weight === undefined ||
    height <= 0 ||
    weight <= 0
  ) {
    return undefined
  }

  const heightMeters =
    height / 100

  const bmi =
    weight /
    (heightMeters * heightMeters)

  return Number(bmi.toFixed(1))
}

export default function ProfileScreen() {
  const {
    profile: storedProfile,
  } = useClinicalProfile()

  const [profile, setProfile] =
    useState<ClinicalContext>({
      patientId: LOCAL_PROFILE_ID,
    })

  const [saved, setSaved] =
    useState(false)

  useEffect(() => {
    if (!storedProfile) {
      return
    }

    setProfile(storedProfile)
    setSaved(true)
  }, [storedProfile])

  const update = (
    changes: Partial<ClinicalContext>,
  ) => {
    setSaved(false)

    setProfile(current => {
      const next = {
        ...current,
        ...changes,
      }

      if (
        'height' in changes ||
        'weight' in changes
      ) {
        next.bmi = calculateBmi(
          next.height,
          next.weight,
        )
      }

      return next
    })
  }

  const save = () => {
    clinicalProfileService.save(profile)
    notifyClinicalProfileChanged()
    setSaved(true)
  }

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            Perfil
          </Text>

          <Text style={styles.subtitle}>
            Tu información para contextualizar
            tu presión arterial.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Datos personales
          </Text>

          <View style={styles.cardContent}>
            <TextField
              label="Nombre"
              placeholder="Ingresá tu nombre"
              value={profile.name}
              onChange={name =>
                update({ name })
              }
            />

            <NumberField
              label="Edad"
              placeholder="Ingresá tu edad"
              value={profile.age}
              onChange={age =>
                update({ age })
              }
            />

            <SexSelector
              value={profile.sex}
              onChange={sex =>
                update({ sex })
              }
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Datos corporales
          </Text>

          <View style={styles.cardContent}>
            <NumberField
              label="Altura (cm)"
              placeholder="Ingresá tu altura"
              keyboardType="decimal-pad"
              value={profile.height}
              onChange={height =>
                update({ height })
              }
            />

            <NumberField
              label="Peso inicial (kg)"
              placeholder="Ingresá tu peso"
              keyboardType="decimal-pad"
              value={profile.weight}
              onChange={weight =>
                update({ weight })
              }
            />

            <View style={styles.bmiCard}>
              <View
                style={styles.bmiHeader}
              >
                <Text
                  style={styles.bmiLabel}
                >
                  IMC
                </Text>

                <Text
                  style={styles.bmiValue}
                >
                  {profile.bmi !==
                  undefined
                    ? profile.bmi
                    : '—'}
                </Text>
              </View>

              <Text
                style={styles.bmiDescription}
              >
                Calculado automáticamente a
                partir de altura y peso.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Factores cardiovasculares
          </Text>

          <View style={styles.cardContent}>
            <BooleanField
              label="Tabaquismo"
              description="Ej.: fumás cigarrillos actualmente."
              value={profile.smoking}
              onChange={smoking =>
                update({ smoking })
              }
            />

            <BooleanField
              label="Diabetes"
              description="Ej.: diabetes tipo 1 o tipo 2 diagnosticada."
              value={profile.diabetes}
              onChange={diabetes =>
                update({ diabetes })
              }
            />

            <BooleanField
              label="Dislipidemia"
              description="Ej.: colesterol o triglicéridos elevados diagnosticados."
              value={
                profile.dyslipidemia
              }
              onChange={dyslipidemia =>
                update({
                  dyslipidemia,
                })
              }
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Antecedentes
          </Text>

          <View style={styles.cardContent}>
            <BooleanField
              label="Enfermedad cardiovascular"
              description="Ej.: infarto, angina, enfermedad coronaria o arritmia diagnosticada."
              value={
                profile.cardiovascularDisease
              }
              onChange={
                cardiovascularDisease =>
                  update({
                    cardiovascularDisease,
                  })
              }
            />

            <BooleanField
              label="Insuficiencia cardíaca"
              description="Ej.: diagnóstico de insuficiencia cardíaca."
              value={
                profile.heartFailure
              }
              onChange={heartFailure =>
                update({
                  heartFailure,
                })
              }
            />

            <BooleanField
              label="Antecedente de ACV"
              description="Ej.: accidente cerebrovascular o ataque cerebral previo."
              value={
                profile.strokeHistory
              }
              onChange={strokeHistory =>
                update({
                  strokeHistory,
                })
              }
            />

            <BooleanField
              label="Enfermedad vascular periférica"
              description="Ej.: enfermedad de las arterias de las piernas."
              value={
                profile.peripheralVascularDisease
              }
              onChange={
                peripheralVascularDisease =>
                  update({
                    peripheralVascularDisease,
                  })
              }
            />

            <BooleanField
              label="Enfermedad renal crónica"
              description="Ej.: enfermedad renal crónica diagnosticada."
              value={
                profile.chronicKidneyDisease
              }
              onChange={
                chronicKidneyDisease =>
                  update({
                    chronicKidneyDisease,
                  })
              }
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Datos automáticos
          </Text>

          <Text style={styles.automaticText}>
            Algunos datos podrán incorporarse
            automáticamente desde Health
            Connect cuando esté disponible.
          </Text>

          <View style={styles.automaticList}>
            <Text style={styles.automaticItem}>
              Peso actual
            </Text>

            <Text style={styles.automaticItem}>
              Frecuencia cardíaca
            </Text>

            <Text style={styles.automaticItem}>
              Actividad física
            </Text>

            <Text style={styles.automaticItem}>
              Sueño
            </Text>

            <Text style={styles.automaticItem}>
              SpO₂
            </Text>
          </View>
        </View>

        <View style={styles.saveSection}>
          <Button
            title="Guardar perfil"
            onPress={save}
          />

          {saved ? (
            <Text style={styles.saved}>
              Perfil guardado correctamente.
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.md,
    paddingBottom:
      theme.spacing.xl * 2,
  },

  header: {
    gap: theme.spacing.xs,
    paddingTop: theme.spacing.md,
    paddingBottom:
      theme.spacing.xs,
  },

  title: {
    fontFamily:
      theme.typography.bold,
    fontSize: 28,
    lineHeight: 34,
    color: theme.colors.text,
  },

  subtitle: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.body,
    lineHeight: 22,
    color:
      theme.colors.textSecondary,
  },

  card: {
    backgroundColor:
      theme.colors.surface,
    borderRadius:
      theme.radius.lg,
    padding:
      theme.spacing.md,
    gap: theme.spacing.md,
    borderWidth: 1,
    borderColor:
      theme.colors.border,
  },

  cardTitle: {
    fontFamily:
      theme.typography.bold,
    fontSize: 22,
    lineHeight: 27,
    color: theme.colors.text,
  },

  cardContent: {
    gap: theme.spacing.md,
  },

  fieldLabel: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.caption,
    lineHeight: 18,
    color: theme.colors.text,
  },

  sexField: {
    gap: theme.spacing.xs,
  },

  sexOptions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  sexOption: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor:
      theme.colors.border,
    borderRadius:
      theme.radius.md,
    backgroundColor:
      theme.colors.background,
  },

  sexOptionSelected: {
    borderColor:
      theme.colors.primary,
    backgroundColor:
      theme.colors.primary,
  },

  sexOptionText: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.body,
    color:
      theme.colors.text,
  },

  sexOptionTextSelected: {
    fontFamily:
      theme.typography.semiBold,
    color: '#FFFFFF',
  },

  booleanField: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },

  booleanText: {
    flex: 1,
    gap: 2,
  },

  booleanDescription: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    lineHeight: 17,
    color:
      theme.colors.textSecondary,
  },

  bmiCard: {
    backgroundColor:
      theme.colors.background,
    borderRadius:
      theme.radius.md,
    padding:
      theme.spacing.md,
    gap: theme.spacing.xs,
  },

  bmiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  bmiLabel: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.caption,
    color:
      theme.colors.textSecondary,
  },

  bmiValue: {
    fontFamily:
      theme.typography.bold,
    fontSize: 24,
    lineHeight: 29,
    color: theme.colors.text,
  },

  bmiDescription: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    lineHeight: 18,
    color:
      theme.colors.textSecondary,
  },

  automaticText: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.body,
    lineHeight: 21,
    color:
      theme.colors.textSecondary,
  },

  automaticList: {
    gap: theme.spacing.xs,
  },

  automaticItem: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    lineHeight: 18,
    color: theme.colors.text,
  },

  saveSection: {
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
  },

  saved: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.small,
    lineHeight: 18,
    textAlign: 'center',
    color: '#16A34A',
  },
})
