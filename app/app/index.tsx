import { router, usePathname, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ImageBackground, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';

import LogoNerdyDerby from '../assets/images/Logo_Nerdy_Derby.svg';
import LogoFabLab from '../assets/images/Logo_Fab_LAB_Uni_Facens.svg';
import BotaoConfig from '../assets/images/botaoconfig.svg';
import BotaoCircuitos from '../assets/images/botaocircuitos.svg';


export default function Home() {
  const [menuLevel, setMenuLevel] = useState(0);
  const pathname = usePathname();
  const { width } = useWindowDimensions();
 

  const logoSize   = width * 0.25;
  const btnSize    = width *0.17; 
  const fabLabW    = width * 0.10;
  const fabLabH    = fabLabW * 0.3;


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
          }
        } else if (event.key === '2') {
          router.push('../Cadastro-corrida');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pathname, menuLevel]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        source={require('../assets/images/Fundo_Tela.png')}
        style={styles.background}
        resizeMode="stretch"
      >
        {/* Logo principal */}
        <View style={styles.logoContainer}>
          <LogoNerdyDerby width={logoSize} height={logoSize} />
        </View>

        {/* Botões de navegação */}
        <View style={styles.botoesContainer}>
          <TouchableOpacity
            onPress={() => router.push('../settings')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <BotaoConfig width={btnSize} height={btnSize} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('../Cadastro-corrida')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <BotaoCircuitos width={btnSize} height={btnSize} />
          </TouchableOpacity>
        </View>

        {/* Logo FabLab — canto inferior direito */}
        <View style={styles.fabLabContainer}>
          <LogoFabLab width={fabLabW} height={fabLabH} />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 32,
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 180,
  },
  fabLabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});