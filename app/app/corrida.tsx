import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  useWindowDimensions, ImageBackground, Image,
} from 'react-native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LogoNerdyDerby from '../assets/images/Logo_Nerdy_Derby.svg';
import LogoFabLab from '../assets/images/Logo_Fab_LAB_Uni_Facens.svg';

export default function Corrida() {
  const { circuitoId } = useLocalSearchParams<{ circuitoId: string }>();
  const { width, height } = useWindowDimensions();
  const [fontsLoaded] = useFonts({ 'MinhaFonte': require('../assets/fonts/Gamer.ttf') });

  const [nomeCircuito, setNomeCircuito] = useState('');
  const [corNome, setCorNome]           = useState('#ffffff');
  const [fotoFundo, setFotoFundo]       = useState<string | null>(null);

  const [tempo, setTempo]       = useState(0); // em milissegundos
  const [rodando, setRodando]   = useState(false);
  const intervalo = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const carregar = async () => {
      const json = await AsyncStorage.getItem('circuitos');
      if (json) {
        const lista = JSON.parse(json);
        const c = lista.find((x: any) => x.id === circuitoId);
        if (c) { setNomeCircuito(c.nome); setCorNome(c.corNome); setFotoFundo(c.fotoFundo); }
      }
    };
    carregar();
  }, []);

  const iniciar = () => {
    setRodando(true);
    intervalo.current = setInterval(() => setTempo(t => t + 10), 10);
  };

  const pausar = () => {
    setRodando(false);
    if (intervalo.current) clearInterval(intervalo.current);
  };

  const resetar = () => {
    pausar();
    setTempo(0);
  };

  const formatar = (ms: number) => {
    const min  = Math.floor(ms / 60000).toString().padStart(2, '0');
    const seg  = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    const cent = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${min}:${seg}.${cent}`;
  };

  if (!fontsLoaded) return null;

  const logoSize = width * 0.03;
  const fabLabW  = width * 0.10;
  const fabLabH  = fabLabW * 0.3;
  const btnW     = width * 0.15;
  const btnH     = btnW * 0.35;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={fotoFundo ? { uri: fotoFundo } : require('../assets/images/Fundo_Tela.png')}
        style={styles.background}
        resizeMode="stretch"
      >
        <View style={styles.overlay} />

        <View style={styles.logoContainer}>
          <LogoNerdyDerby width={logoSize} height={logoSize} />
        </View>

        <Text style={[styles.nomeCircuito, { color: corNome }]}>#{nomeCircuito}</Text>
        <Text style={styles.labelCorrida}>CORRIDA EM ANDAMENTO</Text>

        {/* Cronômetro */}
        <View style={styles.cronometroBox}>
          <Text style={styles.cronometroTexto}>{formatar(tempo)}</Text>
        </View>

        {/* Controles */}
        <View style={styles.controlesRow}>
          {!rodando ? (
            <TouchableOpacity style={[styles.botaoControle, { backgroundColor: 'rgba(0,180,80,0.85)' }]} onPress={iniciar}>
              <Text style={styles.botaoControleTexto}>▶ INICIAR</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.botaoControle, { backgroundColor: 'rgba(200,100,0,0.85)' }]} onPress={pausar}>
              <Text style={styles.botaoControleTexto}>⏸ PAUSAR</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.botaoControle, { backgroundColor: 'rgba(180,0,0,0.85)' }]} onPress={resetar}>
            <Text style={styles.botaoControleTexto}>↺ RESET</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.botaoVoltarContainer}>
          <TouchableOpacity onPress={() => { pausar(); router.back(); }}>
            <Image source={require('../assets/images/Botao__Voltar.png')} style={{ width: btnW, height: btnH }} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <View style={styles.fabLabContainer}>
          <LogoFabLab width={fabLabW} height={fabLabH} />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  logoContainer: { position: 'absolute', top: 20, zIndex: 10 },
  nomeCircuito: { fontSize: 38, fontFamily: 'MinhaFonte', zIndex: 10, marginTop: -60 },
  labelCorrida: { color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'MinhaFonte', zIndex: 10, marginBottom: 32 },
  cronometroBox: {
    backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 16,
    borderWidth: 2, borderColor: 'rgba(42,12,172,1)',
    paddingVertical: 32, paddingHorizontal: 48,
    marginBottom: 40, zIndex: 10,
  },
  cronometroTexto: { color: '#fff', fontSize: 64, fontFamily: 'MinhaFonte', letterSpacing: 4 },
  controlesRow: { flexDirection: 'row', gap: 20, zIndex: 10 },
  botaoControle: {
    borderRadius: 10, paddingVertical: 16, paddingHorizontal: 32,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  botaoControleTexto: { color: '#fff', fontSize: 20, fontFamily: 'MinhaFonte' },
  fabLabContainer: { position: 'absolute', bottom: 24, right: 24, zIndex: 10 },
  botaoVoltarContainer: { position: 'absolute', bottom: 24, left: 28, zIndex: 10 },
});