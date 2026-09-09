import {
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { Card, Screen, Text } from '@/components/ui'

import { VERSION_INFO }
  from '../config/version-info'

import { theme } from '@/theme'

export default function AboutScreen() {
  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.hero}>
            <Image
              source={require('../../../../assets/images/icon.png')}
              style={styles.logo}
            />

            <Text style={styles.title}>
              {VERSION_INFO.appName}
            </Text>

            <Text style={styles.subtitle}>
              {VERSION_INFO.description}
            </Text>
          </View>

          <Card>
            <Text style={styles.sectionTitle}>
              Versión
            </Text>

            <Text>
              Versión {VERSION_INFO.version}
            </Text>

            <Text>
              Lanzamiento:{' '}
              {VERSION_INFO.releaseDate}
            </Text>

            <Text>
              Estado:{' '}
              {VERSION_INFO.status}
            </Text>
          </Card>

          <Card>
            <Text style={styles.sectionTitle}>
              Novedades
            </Text>

            {VERSION_INFO.highlights.map(
              section => (
                <View
                  key={section.title}
                  style={styles.highlight}
                >
                  <Text
                    style={
                      styles.highlightTitle
                    }
                  >
                    {section.title}
                  </Text>

                  {section.items.map(item => (
                    <Text
                      key={item}
                      style={styles.bullet}
                    >
                      • {item}
                    </Text>
                  ))}
                </View>
              ),
            )}
          </Card>

          <Card>
            <Text style={styles.sectionTitle}>
              Información técnica
            </Text>

            <Text>
              Expo SDK:{' '}
              {VERSION_INFO.technical.expoSdk}
            </Text>

            <Text>
              React Native:{' '}
              {VERSION_INFO.technical.reactNative}
            </Text>

            <Text>
              Plataforma:{' '}
              {VERSION_INFO.technical.platform}
            </Text>

            <Text>
              Base de datos:{' '}
              {VERSION_INFO.technical.database}
            </Text>
          </Card>

          <Card>
            <Text style={styles.sectionTitle}>
              Próximamente
            </Text>

            <Text>
              Política de privacidad
            </Text>

            <Text>
              Sitio web oficial
            </Text>

            <Text>
              Contacto
            </Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 40,
  },

  hero: {
    alignItems: 'center',
    gap: 8,
  },

  logo: {
    width: 96,
    height: 96,
  },

  title: {
    fontFamily:
      theme.typography.bold,
    fontSize: 28,
  },

  subtitle: {
    textAlign: 'center',
    color:
      theme.colors.textSecondary,
  },

  sectionTitle: {
    marginBottom: 12,
    fontFamily:
      theme.typography.semiBold,
  },

  highlight: {
    marginBottom: 16,
  },

  highlightTitle: {
    marginBottom: 8,
    fontFamily:
      theme.typography.semiBold,
  },

  bullet: {
    marginBottom: 4,
  },
})
