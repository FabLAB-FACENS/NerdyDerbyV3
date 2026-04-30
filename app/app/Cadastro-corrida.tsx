import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { View, Image, ImageBackground, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';

import LogoNerdyDerby from '../assets/images/Logo_Nerdy_Derby.svg';
import LogoFabLab from '../assets/images/Logo_Fab_LAB_Uni_Facens.svg';

export default function Settings() {
  const { width, height } = useWindowDimensions();

  const logoSize  = width * 0.03;
  const fabLabW   = width * 0.10;
  const fabLabH   = fabLabW * 0.3;
  const btnW      = width * 0.15;
  const btnH      = btnW * 0.35;
  const btnAtualizarW = width * 0.25; 
  const btnAtualizarH = btnAtualizarW * 0.55;
 

  
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


        {/* Logo FabLab — canto inferior direito */}
        <View style={styles.fabLabContainer}>
          <LogoFabLab width={fabLabW} height={fabLabH} />
        </View>

        {/* BOTÃO VOLTAR — canto inferior esquerdo */}
<View style={styles.botaoVoltarContainer}>
  <TouchableOpacity onPress={() => router.back()}>
    <Image
      source={require('../assets/images/Botao__Voltar.png')}
      style={{ width: btnW, height: btnH }}
      resizeMode="contain"
    />
  </TouchableOpacity>
</View>

{/* BOTÃO ATUALIZAR — centro inferior */}
<View style={styles.botaoAtualizarContainer}>
  <TouchableOpacity 
  onPress={() => router.push('../circuito.tsx')}
  >
  
    <Image
      source={require('../assets/images/Atualizar.png')}
      style={{ width: btnAtualizarW, height: btnAtualizarH }}
      resizeMode="contain"
    />
  </TouchableOpacity>
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
    gap: 24,
    paddingVertical: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: -575,
  },
  titlesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  fabLabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
 botaoVoltarContainer: {
  position: 'absolute',
  bottom: 24,
  left: 28,
},
botaoAtualizarContainer: {
  position: 'absolute',
  bottom: 24,
  alignSelf: 'center',
},



});