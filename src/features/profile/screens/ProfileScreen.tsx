import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { useEffect, useState } from 'react'
import { router } from 'expo-router'

import {
  Screen,
  Text,
  Card,
  Button,
  SectionTitle,
} from '@/components/ui'

import {
  NumberField,
  SelectField,
  TextField,
} from '@/components/ui/form'

import type { ClinicalContext } from '@/domain/clinical/models/ClinicalContext'

import {
  clinicalProfileService,
} from '../services'

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
  value?: boolean
  onChange: (value: boolean) => void
}

function BooleanField({
  label,
  value,
  onChange,
}: BooleanFieldProps) {
  return (
    <View style={styles.booleanContainer}>
      <Text style={styles.booleanLabel}>
        {label}
      </Text>

      <View style={styles.booleanOptions}>
        <Pressable
          onPress={() => onChange(true)}
          style={[
            styles.booleanOption,
            value === true &&
              styles.booleanSelected,
          ]}
        >
          <Text>Sí</Text>
        </Pressable>

        <Pressable
          onPress={() => onChange(false)}
          style={[
            styles.booleanOption,
            value === false &&
              styles.booleanSelected,
          ]}
        >
          <Text>No</Text>
        </Pressable>
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

  const heightMeters = height / 100

  const bmi =
    weight /
    (heightMeters * heightMeters)

  return Number(bmi.toFixed(1))
}

export default function ProfileScreen() {
  const [profile, setProfile] =
    useState<ClinicalContext>({
      patientId: LOCAL_PROFILE_ID,
    })

  const [saved, setSaved] =
    useState(false)

  useEffect(() => {
    const existing =
      clinicalProfileService.get(
        LOCAL_PROFILE_ID,
      )

    if (existing) {
      setProfile(existing)
    }
  }, [])

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
    setSaved(true)
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.header}>
          <Text variant="h1">
            Perfil clínico
          </Text>

          <Text>
            Estos datos permiten contextualizar
            el análisis de tus mediciones.
          </Text>
        </View>

        <Card>
          <SectionTitle
            title="Datos básicos"
          />

          <TextField
            label="Nombre"
            placeholder="Ej. Lucas"
            value={profile.name}
            onChange={name =>
              update({ name })
            }
          />

          <NumberField
            label="Edad"
            placeholder="Ej. 55"
            value={profile.age}
            onChange={age =>
              update({ age })
            }
          />

          <SelectField
            label="Sexo"
            value={profile.sex}
            options={SEX_OPTIONS}
            onChange={sex =>
              update({ sex })
            }
          />
        </Card>

        <Card>
          <SectionTitle
            title="Datos antropométricos"
          />

          <NumberField
            label="Altura (cm)"
            placeholder="Ej. 175"
            keyboardType="decimal-pad"
            value={profile.height}
            onChange={height =>
              update({ height })
            }
          />

          <NumberField
            label="Peso inicial (kg)"
            placeholder="Ej. 80"
            keyboardType="decimal-pad"
            value={profile.weight}
            onChange={weight =>
              update({ weight })
            }
          />

          <View style={styles.bmiContainer}>
            <Text style={styles.bmiLabel}>
              IMC calculado
            </Text>

            <Text variant="h2">
              {profile.bmi !== undefined
                ? profile.bmi
                : '--'}
            </Text>
          </View>

          <Text>
            El IMC se calcula automáticamente
            a partir de altura y peso.
          </Text>
        </Card>

        <Card>
          <SectionTitle
            title="Factores de riesgo cardiovascular"
          />

          <BooleanField
            label="Tabaquismo"
            value={profile.smoking}
            onChange={smoking =>
              update({ smoking })
            }
          />

          <BooleanField
            label="Diabetes"
            value={profile.diabetes}
            onChange={diabetes =>
              update({ diabetes })
            }
          />

          <BooleanField
            label="Dislipidemia"
            value={profile.dyslipidemia}
            onChange={dyslipidemia =>
              update({ dyslipidemia })
            }
          />
        </Card>

        <Card>
          <SectionTitle
            title="Antecedentes cardiovasculares"
          />

          <BooleanField
            label="Enfermedad cardiovascular"
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
            value={profile.heartFailure}
            onChange={heartFailure =>
              update({ heartFailure })
            }
          />

          <BooleanField
            label="Antecedente de ACV"
            value={profile.strokeHistory}
            onChange={strokeHistory =>
              update({ strokeHistory })
            }
          />

          <BooleanField
            label="Enfermedad vascular periférica"
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
        </Card>

        <Card>
          <SectionTitle
            title="Datos automáticos"
          />

          <Text>
            Estos datos no se cargan manualmente.
          </Text>

          <Text>
            Peso actual, frecuencia cardíaca,
            actividad física, sueño y SpO₂
            aparecerán cuando Health Connect
            esté disponible y entregue esos datos.
          </Text>
        </Card>

        <Button
          title="Guardar perfil"
          onPress={save}
        />

        {saved ? (
          <Text style={styles.saved}>
            Perfil guardado correctamente.
          </Text>
        ) : null}

        <Button
          title="Volver"
          onPress={() => router.back()}
        />
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 40,
  },

  header: {
    gap: 8,
  },

  booleanContainer: {
    gap: 6,
  },

  booleanLabel: {
    fontSize: 14,
    fontWeight: '600',
  },

  booleanOptions: {
    flexDirection: 'row',
    gap: 8,
  },

  booleanOption: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },

  booleanSelected: {
    borderColor: '#2563EB',
  },

  bmiContainer: {
    gap: 6,
  },

  bmiLabel: {
    fontWeight: '600',
  },

  saved: {
    textAlign: 'center',
  },
})
