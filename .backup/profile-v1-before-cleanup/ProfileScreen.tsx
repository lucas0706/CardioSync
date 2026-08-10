import {
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

import { AppBooleanField } from '@/components/form/AppBooleanField'

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

    setProfile(current => ({
      ...current,
      ...changes,
    }))
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
            posteriormente el análisis de tus
            mediciones.
          </Text>
        </View>

        <Card>
          <SectionTitle>
            Datos básicos
          </SectionTitle>

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
            label="Peso (kg)"
            placeholder="Ej. 80"
            keyboardType="decimal-pad"
            value={profile.weight}
            onChange={weight =>
              update({ weight })
            }
          />

          <NumberField
            label="IMC"
            placeholder="Ej. 26.1"
            keyboardType="decimal-pad"
            value={profile.bmi}
            onChange={bmi =>
              update({ bmi })
            }
          />
        </Card>

        <Card>
          <SectionTitle>
            Factores de riesgo cardiovascular
          </SectionTitle>

          <AppBooleanField
            label="Tabaquismo"
            value={profile.smoking}
            onChange={smoking =>
              update({ smoking })
            }
          />

          <AppBooleanField
            label="Diabetes"
            value={profile.diabetes}
            onChange={diabetes =>
              update({ diabetes })
            }
          />

          <AppBooleanField
            label="Dislipidemia"
            value={profile.dyslipidemia}
            onChange={dyslipidemia =>
              update({ dyslipidemia })
            }
          />

          <AppBooleanField
            label="Obesidad"
            value={profile.obesity}
            onChange={obesity =>
              update({ obesity })
            }
          />

          <AppBooleanField
            label="Antecedentes familiares de enfermedad cardiovascular"
            value={
              profile.familyHistoryCardiovascularDisease
            }
            onChange={
              familyHistoryCardiovascularDisease =>
                update({
                  familyHistoryCardiovascularDisease,
                })
            }
          />
        </Card>

        <Card>
          <SectionTitle>
            Antecedentes cardiovasculares
          </SectionTitle>

          <AppBooleanField
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

          <AppBooleanField
            label="Insuficiencia cardíaca"
            value={profile.heartFailure}
            onChange={heartFailure =>
              update({ heartFailure })
            }
          />

          <AppBooleanField
            label="Antecedente de ACV"
            value={profile.strokeHistory}
            onChange={strokeHistory =>
              update({ strokeHistory })
            }
          />

          <AppBooleanField
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

          <AppBooleanField
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
          <SectionTitle>
            Situaciones especiales
          </SectionTitle>

          <AppBooleanField
            label="Embarazo"
            value={profile.pregnancy}
            onChange={pregnancy =>
              update({ pregnancy })
            }
          />

          <AppBooleanField
            label="Adulto mayor"
            value={profile.olderAdult}
            onChange={olderAdult =>
              update({ olderAdult })
            }
          />
        </Card>

        <Card>
          <SectionTitle>
            Estilo de vida
          </SectionTitle>

          <TextField
            label="Nivel de actividad física"
            placeholder="Ej. Bajo, moderado, alto"
            value={
              profile.physicalActivityLevel
            }
            onChange={
              physicalActivityLevel =>
                update({
                  physicalActivityLevel,
                })
            }
          />

          <TextField
            label="Consumo de alcohol"
            placeholder="Ej. Ocasional"
            value={
              profile.alcoholConsumption
            }
            onChange={
              alcoholConsumption =>
                update({
                  alcoholConsumption,
                })
            }
          />

          <TextField
            label="Patrón alimentario"
            placeholder="Información relevante"
            value={profile.dietaryPattern}
            onChange={dietaryPattern =>
              update({
                dietaryPattern,
              })
            }
          />
        </Card>

        <Card>
          <SectionTitle>
            Notas
          </SectionTitle>

          <TextField
            label="Información adicional"
            placeholder="Información que quieras registrar"
            multiline
            value={profile.notes}
            onChange={notes =>
              update({ notes })
            }
          />
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

  saved: {
    textAlign: 'center',
  },
})
