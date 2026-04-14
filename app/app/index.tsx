import { router } from 'expo-router'
import { Button, Text, View } from 'react-native'

export default function Home() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24 }}>Nerdy Derby</Text>
      <Text>App rodando 🚀</Text>

      <Button
        title="Ir para Settings"
        onPress={() => router.push('../settings')}
      />
    </View>
  )
}