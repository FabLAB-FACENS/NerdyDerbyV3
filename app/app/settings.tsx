import { router, usePathname,Stack} from 'expo-router'
import { useEffect, useState } from 'react'
import { Button, Text, View, Image, ImageBackground, TouchableOpacity} from 'react-native'

export default function Settings() {
  return (
    <View style={{ flex: 1 }}>
        {/* Esta linha abaixo remove o cabeçalho "index" */}
        <Stack.Screen options={{ headerShown: false }} />
     <View style={{ flex: 1}}>


 <ImageBackground
  source={require('../assets/images/Fundo_Tela.png')}
  style={{
    flex: 1,
    width: '100%',
    height: '100%',
  }}
  resizeMode="stretch"
  imageStyle={{
    resizeMode: 'stretch',
  }}
>
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    
    <Image
      source={require('../assets/images/Logo_Nerdy_Derby.svg')}
      style={{ width: 50, height: 350, marginTop: -600}}
      resizeMode='contain'
      
    />
  
    <Image
      source={require('../assets/images/Logo_Fab_LAB_Uni_Facens.svg')}
      style={{ width: 150, height: 100, bottom: 20, right: 75, position: 'absolute'}}
      resizeMode='contain'
      
    />

<TouchableOpacity
  onPress={() => router.back()}
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    
   
  }}
>
  <Image
    source={require('../assets/images/Botao__Voltar.png')}
     style={{ width: 200, height: 100, bottom: -475, left: -725, position: 'absolute'}}
      resizeMode='contain'
  />
  
</TouchableOpacity>










</View>
  
</ImageBackground>
    </View>
    </View>
    
  
  )
}