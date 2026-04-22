import { router, usePathname,Stack} from 'expo-router'
import { useEffect, useState } from 'react'
import { Button, Text, View, Image, ImageBackground, TouchableOpacity} from 'react-native'

export default function Home() {
  //Programação Botão
  const [menuLevel, setMenuLevel] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
     
      if (event.key === 'Escape') {
        router.back();
      }

      
      if (pathname === '/') {
        if (event.key === '1') {
          if (menuLevel === 0) {
           
            router.push('../settings');
          } else {
           
            setMenuLevel(0);
            console.log("Funções resetadas!");
          }
        } else if (event.key === '2') {
          router.push('../Cadastro-corrida');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pathname, menuLevel]); 

    return(
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
      style={{ width: 350, height: 350, marginTop: 30}}
      resizeMode='contain'
      
    />
  
    <Image
      source={require('../assets/images/Logo_Fab_LAB_Uni_Facens.svg')}
      style={{ width: 150, height: 100, bottom: 20, right: 75, position: 'absolute'}}
      resizeMode='contain'
      
    />
  

    

    <View style={{ 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 70
    }}>


 <TouchableOpacity
  onPress={() => router.push('../settings')}
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    
   
  }}
>
  <Image
    source={require('../assets/images/botaoconfig.svg')}
    style={{ width: 300, height: 300, marginRight: 8, marginTop:-30}}
    resizeMode='contain'
  />
  
</TouchableOpacity>
<TouchableOpacity
  onPress={() => router.push('../Cadastro-corrida')}
  style={{
    flexDirection: 'row', 
    alignItems: 'center',
    
   
  }}
>
  <Image
    source={require('../assets/images/botaocircuitos.svg')}
    style={{ width: 300, height: 300, marginRight: 8, marginTop:-30 }}
    resizeMode='contain'
  />
  
</TouchableOpacity>



</View>
</View>

   </ImageBackground>
   </View>
   </View>
   
  )
} 