import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native'

import { useEffect, useState } from 'react'

import Ionicons from '@expo/vector-icons/Ionicons'

import {
  Screen,
  Text,
} from '@/components/ui'

import {
  getBackupSettings,
  updateBackupSettings,
  type BackupFrequency,
  type BackupSettings,
} from '@/features/backup/services/BackupSettingsService'

import { theme } from '@/theme'

const WEEKDAYS = [
  { value: 0, label: 'Domingo', short: 'Dom' },
  { value: 1, label: 'Lunes', short: 'Lun' },
  { value: 2, label: 'Martes', short: 'Mar' },
  { value: 3, label: 'Miércoles', short: 'Mié' },
  { value: 4, label: 'Jueves', short: 'Jue' },
  { value: 5, label: 'Viernes', short: 'Vie' },
  { value: 6, label: 'Sábado', short: 'Sáb' },
] as const

const AVAILABLE_TIMES = Array.from(
  { length: 24 },
  (_, index) =>
    `${String(index).padStart(2, '0')}:00`,
)

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return 'Todavía no se ejecutó ninguna copia.'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString(
    'es-AR',
    {
      dateStyle: 'short',
      timeStyle: 'short',
    },
  )
}

function FrequencyOption({
  value,
  label,
  selected,
  onPress,
}: {
  value: BackupFrequency
  label: string
  selected: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{
        selected,
      }}
      onPress={onPress}
      style={[
        styles.frequencyOption,
        selected &&
          styles.frequencyOptionSelected,
      ]}
    >
      <View
        style={[
          styles.radioOuter,
          selected &&
            styles.radioOuterSelected,
        ]}
      >
        {selected ? (
          <View
            style={styles.radioInner}
          />
        ) : null}
      </View>

      <Text
        style={[
          styles.frequencyLabel,
          selected &&
            styles.frequencyLabelSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )
}

function WeekdayOption({
  value,
  label,
  short,
  selected,
  onPress,
}: {
  value: number
  label: string
  short: string
  selected: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{
        selected,
      }}
      onPress={onPress}
      style={[
        styles.weekdayOption,
        selected &&
          styles.weekdayOptionSelected,
      ]}
    >
      <Text
        style={[
          styles.weekdayShort,
          selected &&
            styles.weekdayShortSelected,
        ]}
      >
        {short}
      </Text>
    </Pressable>
  )
}

function TimeOption({
  time,
  selected,
  disabled,
  onPress,
}: {
  time: string
  selected: boolean
  disabled: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: selected,
        disabled,
      }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.timeOption,
        selected &&
          styles.timeOptionSelected,
        disabled &&
          styles.timeOptionDisabled,
        pressed &&
          !disabled &&
          styles.timeOptionPressed,
      ]}
    >
      <Text
        style={[
          styles.timeOptionText,
          selected &&
            styles.timeOptionTextSelected,
        ]}
      >
        {time}
      </Text>
    </Pressable>
  )
}

export default function BackupSettingsScreen() {
  const [
    settings,
    setSettings,
  ] = useState<BackupSettings | null>(null)

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    saving,
    setSaving,
  ] = useState(false)

  useEffect(() => {
    try {
      const current =
        getBackupSettings()

      setSettings(current)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar la configuración.'

      Alert.alert(
        'Error',
        message,
      )
    } finally {
      setLoading(false)
    }
  }, [])

  async function saveSettings(
    changes: Partial<
      Pick<
        BackupSettings,
        'enabled' |
          'frequency' |
          'weekday' |
          'times'
      >
    >,
  ): Promise<void> {
    if (saving) {
      return
    }

    setSaving(true)

    try {
      const updated =
        updateBackupSettings(
          changes,
        )

      setSettings(updated)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la configuración.'

      Alert.alert(
        'Error',
        message,
      )
    } finally {
      setSaving(false)
    }
  }

  function handleToggle(
    enabled: boolean,
  ): void {
    void saveSettings({
      enabled,
    })
  }

  function handleFrequency(
    frequency: BackupFrequency,
  ): void {
    if (
      settings?.frequency ===
      frequency
    ) {
      return
    }

    void saveSettings({
      frequency,
    })
  }

  function handleWeekday(
    weekday: number,
  ): void {
    if (!settings) {
      return
    }

    if (
      settings.weekday ===
      weekday
    ) {
      return
    }

    void saveSettings({
      weekday,
    })
  }

  function handleTimeToggle(
    time: string,
  ): void {
    if (!settings) {
      return
    }

    const isSelected =
      settings.times.includes(time)

    if (isSelected) {
      if (
        settings.times.length === 1
      ) {
        Alert.alert(
          'Horario requerido',
          'Debe quedar al menos un horario configurado.',
        )

        return
      }

      void saveSettings({
        times:
          settings.times.filter(
            (item) => item !== time,
          ),
      })

      return
    }

    if (
      settings.times.length >= 3
    ) {
      Alert.alert(
        'Límite de horarios',
        'Podés configurar hasta 3 horarios de copia por día.',
      )

      return
    }

    void saveSettings({
      times: [
        ...settings.times,
        time,
      ],
    })
  }

  if (loading || !settings) {
    return (
      <Screen>
        <View
          style={styles.loading}
        >
          <ActivityIndicator
            size="small"
            color={
              theme.colors.primary
            }
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Cargando configuración...
          </Text>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <View
          style={styles.container}
        >
          <View
            style={styles.header}
          >
            <Text
              style={styles.title}
            >
              Copias programadas
            </Text>

            <Text
              style={styles.subtitle}
            >
              Configurá los días y horarios
              en los que CardioSync debe
              preparar una copia de seguridad.
            </Text>
          </View>

          <View
            style={styles.infoCard}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={22}
              color={
                theme.colors.primary
              }
            />

            <View
              style={
                styles.infoContent
              }
            >
              <Text
                style={styles.infoTitle}
              >
                Destino
              </Text>

              <Text
                style={
                  styles.infoDescription
                }
              >
                Google Drive
              </Text>

              <Text
                style={
                  styles.infoPath
                }
              >
                Google Drive / CardioSync
                Backups
              </Text>
            </View>
          </View>

          <View
            style={styles.section}
          >
            <Text
              style={styles.sectionLabel}
            >
              PROGRAMACIÓN
            </Text>

            <View
              style={styles.card}
            >
              <View
                style={styles.toggleRow}
              >
                <View
                  style={
                    styles.toggleContent
                  }
                >
                  <Text
                    style={
                      styles.itemTitle
                    }
                  >
                    Copias programadas
                  </Text>

                  <Text
                    style={
                      styles.itemDescription
                    }
                  >
                    {settings.enabled
                      ? 'La programación está activada.'
                      : 'La programación está desactivada.'}
                  </Text>
                </View>

                <Switch
                  value={
                    settings.enabled
                  }
                  onValueChange={
                    handleToggle
                  }
                  disabled={saving}
                  trackColor={{
                    false:
                      theme.colors.border,
                    true:
                      theme.colors.primary,
                  }}
                  thumbColor={
                    theme.colors.surface
                  }
                />
              </View>

              {settings.enabled ? (
                <>
                  <View
                    style={styles.divider}
                  />

                  <View
                    style={
                      styles.settingBlock
                    }
                  >
                    <Text
                      style={
                        styles.settingTitle
                      }
                    >
                      Frecuencia
                    </Text>

                    <View
                      style={
                        styles.frequencyGroup
                      }
                    >
                      <FrequencyOption
                        value="daily"
                        label="Todos los días"
                        selected={
                          settings.frequency ===
                          'daily'
                        }
                        onPress={() =>
                          handleFrequency(
                            'daily',
                          )
                        }
                      />

                      <FrequencyOption
                        value="weekly"
                        label="Una vez por semana"
                        selected={
                          settings.frequency ===
                          'weekly'
                        }
                        onPress={() =>
                          handleFrequency(
                            'weekly',
                          )
                        }
                      />
                    </View>
                  </View>

                  {settings.frequency ===
                  'weekly' ? (
                    <>
                      <View
                        style={styles.divider}
                      />

                      <View
                        style={
                          styles.settingBlock
                        }
                      >
                        <View
                          style={
                            styles.settingTitleRow
                          }
                        >
                          <Text
                            style={
                              styles.settingTitle
                            }
                          >
                            Día
                          </Text>

                          <Text
                            style={
                              styles.selectedValue
                            }
                          >
                            {
                              WEEKDAYS.find(
                                (day) =>
                                  day.value ===
                                  settings.weekday,
                              )?.label
                            }
                          </Text>
                        </View>

                        <View
                          style={
                            styles.weekdayGroup
                          }
                        >
                          {WEEKDAYS.map(
                            (day) => (
                              <WeekdayOption
                                key={
                                  day.value
                                }
                                value={
                                  day.value
                                }
                                label={
                                  day.label
                                }
                                short={
                                  day.short
                                }
                                selected={
                                  settings.weekday ===
                                  day.value
                                }
                                onPress={() =>
                                  handleWeekday(
                                    day.value,
                                  )
                                }
                              />
                            ),
                          )}
                        </View>
                      </View>
                    </>
                  ) : null}

                  <View
                    style={styles.divider}
                  />

                  <View
                    style={
                      styles.settingBlock
                    }
                  >
                    <View
                      style={
                        styles.settingTitleRow
                      }
                    >
                      <Text
                        style={
                          styles.settingTitle
                        }
                      >
                        Horarios
                      </Text>

                      <Text
                        style={
                          styles.selectedValue
                        }
                      >
                        {settings.times.length}
                        /3
                      </Text>
                    </View>

                    <Text
                      style={
                        styles.helperText
                      }
                    >
                      Seleccioná uno, dos o hasta
                      tres horarios por día.
                    </Text>

                    <View
                      style={
                        styles.timeGrid
                      }
                    >
                      {AVAILABLE_TIMES.map(
                        (time) => {
                          const selected =
                            settings.times.includes(
                              time,
                            )

                          const disabled =
                            !selected &&
                            settings.times
                              .length >= 3

                          return (
                            <TimeOption
                              key={time}
                              time={time}
                              selected={
                                selected
                              }
                              disabled={
                                disabled ||
                                saving
                              }
                              onPress={() =>
                                handleTimeToggle(
                                  time,
                                )
                              }
                            />
                          )
                        },
                      )}
                    </View>
                  </View>
                </>
              ) : null}
            </View>
          </View>

          <View
            style={styles.section}
          >
            <Text
              style={styles.sectionLabel}
            >
              CONFIGURACIÓN ACTUAL
            </Text>

            <View
              style={styles.summaryCard}
            >
              <View
                style={
                  styles.summaryRow
                }
              >
                <Text
                  style={
                    styles.summaryLabel
                  }
                >
                  Estado
                </Text>

                <Text
                  style={
                    styles.summaryValue
                  }
                >
                  {settings.enabled
                    ? 'Activada'
                    : 'Desactivada'}
                </Text>
              </View>

              <View
                style={styles.summaryDivider}
              />

              <View
                style={
                  styles.summaryRow
                }
              >
                <Text
                  style={
                    styles.summaryLabel
                  }
                >
                  Frecuencia
                </Text>

                <Text
                  style={
                    styles.summaryValue
                  }
                >
                  {settings.frequency ===
                  'daily'
                    ? 'Todos los días'
                    : `Todos los ${WEEKDAYS.find(
                        (day) =>
                          day.value ===
                          settings.weekday,
                      )?.label.toLowerCase()}`}
                </Text>
              </View>

              <View
                style={styles.summaryDivider}
              />

              <View
                style={
                  styles.summaryRow
                }
              >
                <Text
                  style={
                    styles.summaryLabel
                  }
                >
                  Horarios
                </Text>

                <Text
                  style={
                    styles.summaryValue
                  }
                >
                  {settings.times.join(
                    ' · ',
                  )}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={styles.section}
          >
            <Text
              style={styles.sectionLabel}
            >
              ÚLTIMA EJECUCIÓN
            </Text>

            <View
              style={styles.card}
            >
              <View
                style={styles.statusRow}
              >
                <View
                  style={
                    styles.statusIcon
                  }
                >
                  <Ionicons
                    name={
                      settings.lastStatus ===
                      'success'
                        ? 'checkmark-circle-outline'
                        : settings.lastStatus ===
                            'error'
                          ? 'alert-circle-outline'
                          : 'time-outline'
                    }
                    size={22}
                    color={
                      settings.lastStatus ===
                      'success'
                        ? theme.colors.success
                        : settings.lastStatus ===
                            'error'
                          ? theme.colors.danger
                          : theme.colors.textSecondary
                    }
                  />
                </View>

                <View
                  style={
                    styles.statusContent
                  }
                >
                  <Text
                    style={
                      styles.itemTitle
                    }
                  >
                    {settings.lastStatus ===
                    'success'
                      ? 'Copia realizada correctamente'
                      : settings.lastStatus ===
                          'error'
                        ? 'La última copia tuvo un error'
                        : 'Sin ejecuciones registradas'}
                  </Text>

                  <Text
                    style={
                      styles.statusDescription
                    }
                  >
                    {formatDate(
                      settings.lastRunAt,
                    )}
                  </Text>

                  {settings.lastError ? (
                    <Text
                      style={
                        styles.statusError
                      }
                    >
                      {settings.lastError}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
          </View>

          <View
            style={styles.warningCard}
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={
                theme.colors.textSecondary
              }
            />

            <Text
              style={
                styles.warningText
              }
            >
              La configuración de horarios
              queda guardada localmente.
              La ejecución automática será
              conectada al sistema de copias
              programadas en la siguiente fase.
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 80,
  },

  container: {
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },

  header: {
    gap: theme.spacing.xs,
    paddingTop: theme.spacing.md,
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

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },

  loadingText: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.body,
    color:
      theme.colors.textSecondary,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
  },

  infoContent: {
    flex: 1,
    gap: 2,
  },

  infoTitle: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.body,
    color: theme.colors.text,
  },

  infoDescription: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    color:
      theme.colors.textSecondary,
  },

  infoPath: {
    marginTop: 2,
    fontFamily:
      theme.typography.medium,
    fontSize:
      theme.typography.small,
    color: theme.colors.text,
  },

  section: {
    gap: theme.spacing.sm,
  },

  sectionLabel: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.overline,
    lineHeight: 16,
    letterSpacing: 0.6,
    color:
      theme.colors.textSecondary,
  },

  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor:
      theme.colors.border,
    borderRadius:
      theme.radius.lg,
    backgroundColor:
      theme.colors.surface,
  },

  toggleRow: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal:
      theme.spacing.md,
    paddingVertical:
      theme.spacing.sm,
  },

  toggleContent: {
    flex: 1,
    gap: 2,
  },

  itemTitle: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.body,
    lineHeight: 21,
    color: theme.colors.text,
  },

  itemDescription: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    lineHeight: 18,
    color:
      theme.colors.textSecondary,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: theme.spacing.md,
    backgroundColor:
      theme.colors.border,
  },

  settingBlock: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },

  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },

  settingTitle: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.body,
    color: theme.colors.text,
  },

  selectedValue: {
    fontFamily:
      theme.typography.medium,
    fontSize:
      theme.typography.small,
    color:
      theme.colors.primary,
  },

  frequencyGroup: {
    gap: theme.spacing.xs,
  },

  frequencyOption: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal:
      theme.spacing.sm,
    borderWidth: 1,
    borderColor:
      theme.colors.border,
    borderRadius:
      theme.radius.md,
    backgroundColor:
      theme.colors.surface,
  },

  frequencyOptionSelected: {
    borderColor:
      theme.colors.primary,
    backgroundColor:
      theme.colors.primary + '10',
  },

  radioOuter: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor:
      theme.colors.textSecondary,
    borderRadius: 10,
  },

  radioOuterSelected: {
    borderColor:
      theme.colors.primary,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor:
      theme.colors.primary,
  },

  frequencyLabel: {
    fontFamily:
      theme.typography.medium,
    fontSize:
      theme.typography.body,
    color:
      theme.colors.text,
  },

  frequencyLabelSelected: {
    color:
      theme.colors.primary,
  },

  weekdayGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },

  weekdayOption: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor:
      theme.colors.border,
    borderRadius:
      theme.radius.md,
    backgroundColor:
      theme.colors.surface,
  },

  weekdayOptionSelected: {
    borderColor:
      theme.colors.primary,
    backgroundColor:
      theme.colors.primary + '10',
  },

  weekdayShort: {
    fontFamily:
      theme.typography.semiBold,
    fontSize: 12,
    color:
      theme.colors.textSecondary,
  },

  weekdayShortSelected: {
    color:
      theme.colors.primary,
  },

  helperText: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    lineHeight: 18,
    color:
      theme.colors.textSecondary,
  },

  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },

  timeOption: {
    width: '23%',
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor:
      theme.colors.border,
    borderRadius:
      theme.radius.md,
    backgroundColor:
      theme.colors.surface,
  },

  timeOptionSelected: {
    borderColor:
      theme.colors.primary,
    backgroundColor:
      theme.colors.primary,
  },

  timeOptionPressed: {
    opacity: 0.7,
  },

  timeOptionDisabled: {
    opacity: 0.4,
  },

  timeOptionText: {
    fontFamily:
      theme.typography.medium,
    fontSize:
      theme.typography.small,
    color:
      theme.colors.text,
  },

  timeOptionTextSelected: {
    color: '#FFFFFF',
  },

  summaryCard: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor:
      theme.colors.border,
    borderRadius:
      theme.radius.lg,
    backgroundColor:
      theme.colors.surface,
  },

  summaryRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    paddingHorizontal:
      theme.spacing.md,
  },

  summaryLabel: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    color:
      theme.colors.textSecondary,
  },

  summaryValue: {
    flex: 1,
    textAlign: 'right',
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.small,
    color: theme.colors.text,
  },

  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: theme.spacing.md,
    backgroundColor:
      theme.colors.border,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },

  statusIcon: {
    paddingTop: 1,
  },

  statusContent: {
    flex: 1,
    gap: 3,
  },

  statusDescription: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    lineHeight: 18,
    color:
      theme.colors.textSecondary,
  },

  statusError: {
    marginTop: 4,
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    lineHeight: 18,
    color:
      theme.colors.danger,
  },

  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor:
      theme.colors.border,
    borderRadius:
      theme.radius.lg,
    backgroundColor:
      theme.colors.surface,
  },

  warningText: {
    flex: 1,
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    lineHeight: 18,
    color:
      theme.colors.textSecondary,
  },
})
