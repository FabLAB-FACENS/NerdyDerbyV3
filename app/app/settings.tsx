import { router, usePathname,Stack} from 'expo-router'
import { useEffect, useState } from 'react'
import { Button, Text, View, Image, ImageBackground, TouchableOpacity} from 'react-native'

export default function Settings() {
  const [statusESP, setStatusESP] = useState<'desligado' | 'atualizando' | 'ligado'>('desligado')

  const atualizarESP = async () => {
    setStatusESP('atualizando')

    try {
      const controller = new AbortController()

      const timeout = setTimeout(() => {
        controller.abort()
      }, 3000)

      // 🔴 TROQUE PELO IP DO SEU ESP
      const response = await fetch('http://192.168.0.100/status', {
        signal: controller.signal
      })

      clearTimeout(timeout)

      if (response.ok) {
        setStatusESP('ligado')
      } else {
        setStatusESP('desligado')
      }

    } catch (error) {
      setStatusESP('desligado')
    }
  }

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
      style={{ width: 50, height: 350, marginTop: -600, position: 'absoulute'}}
      resizeMode='contain'
      
    />
  
    <Image
      source={require('../assets/images/Logo_Fab_LAB_Uni_Facens.svg')}
      style={{ width: 150, height: 100, bottom: 20, right: 75, position: 'absolute'}}
      resizeMode='contain'
      
    />
   
   
    {/*titulos*/}
    <View style={{  flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    
    }}>
 
     <Image
      source={require('../assets/images/Chegada.png')}
       style={{ width: 200, height: 40,left: -600,  marginTop:-180,position:'absolute'}}
    resizeMode='contain'
    />
    
     <Image
      source={require('../assets/images/GIF.png')}
       style={{ width: 200, height: 30, marginTop:-190, position:'absolute'}}
    resizeMode='contain'
    />
    <Image
      source={require('../assets/images/Largada.png')}
       style={{ width: 200, height: 40, right: -600, marginTop:-190, position:'absolute'}}
    resizeMode='contain'
    />
    
    
    {/*status*/}
    <View style={{  flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    }}>
      <Image
      source={statusESP === 'desligado'
                ? require('../assets/images/ESP-Status-Desligado.png')
                : statusESP === 'atualizando'
                ? require('../assets/images/ESP-Status-Atualizando.png')
                : require('../assets/images/ESP-Status-Ligado.png')
      }
       style={{ width: 350, height:300, right: 325, marginTop:130, position:'absolute'}}
    resizeMode='contain'
    />

     <Image
      source={statusESP === 'atualizando'
                ? require('../assets/images/GIF-Status-Atualizando.png')
                : require('../assets/images/GIF-Status-Desligado.png')
            }
       style={{ width: 340, height: 300,  marginTop:130, position:'absolute'}}
    resizeMode='contain'
    />

    <Image
      source={statusESP === 'desligado'
                ? require('../assets/images/ESP-Status-Desligado.png')
                : statusESP === 'atualizando'
                ? require('../assets/images/ESP-Status-Atualizando.png')
                : require('../assets/images/ESP-Status-Ligado.png')
            }
       style={{ width: 350, height: 300, left: 325, marginTop:130, position:'absolute'}}
    resizeMode='contain'
    />

    

      
   
   <View style={{  flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    
    }}>

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

 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  
  <TouchableOpacity
   onPress={atualizarESP}
    style={{
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Image
      source={require('../assets/images/Atualizar.png')}
      style={{ width: 350, height: 200, position:'absolute', marginTop:650}}
      resizeMode='contain'
    />
  </TouchableOpacity>






</View>
 </View>
</View>
</View>
</View>
  
</ImageBackground>
    </View>
    </View>
     
    
  
  )
}