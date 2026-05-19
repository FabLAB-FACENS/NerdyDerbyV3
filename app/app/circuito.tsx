import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  useWindowDimensions, ImageBackground, Image,
  ScrollView, Platform,
} from 'react-native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';

import LogoNerdyDerby from '../assets/images/Logo_Nerdy_Derby.svg';
import LogoFabLab from '../assets/images/Logo_Fab_LAB_Uni_Facens.svg';

type Carrinho = {
  id: string;
  numero: string;
  nomePiloto: string;
  gifUri: string;
};

type Circuito = {
  id: string;
  nome: string;
  corNome: string;
  dataEvento: string;
  descricao: string;
  fotoFundo: string | null;
  dataCriacao: string;
  carrinhos: Carrinho[];
};

function confirmar(mensagem: string): Promise<boolean> {
  if (Platform.OS === 'web') return Promise.resolve(window.confirm(mensagem));
  const { Alert } = require('react-native');
  return new Promise(resolve => {
    Alert.alert('Atenção', mensagem, [
      { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Confirmar', style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}

async function persistirImagem(uri: string): Promise<string> {
  if (Platform.OS === 'web') return uri;
  try {
    const dir = FileSystem.documentDirectory + 'circuitos/';
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const dest = dir + `img_${Date.now()}.jpg`;
    await FileSystem.copyAsync({ from: uri, to: dest });
    return dest;
  } catch {
    return uri;
  }
}

// ─────────────────────────────────────────────
// TELA DE LISTAGEM
// ─────────────────────────────────────────────
function ListaCircuitos() {
  const { width, height } = useWindowDimensions();
  const [fontsLoaded] = useFonts({ 'MinhaFonte': require('../assets/fonts/Gamer.ttf') });
  const [circuitos, setCircuitos] = useState<Circuito[]>([]);

  const logoSize = width * 0.03;
  const fabLabW  = width * 0.10;
  const fabLabH  = fabLabW * 0.3;
  const btnW     = width * 0.15;
  const btnH     = btnW * 0.30;

  const GAP       = 16;
  const PADDING_H = 32;
  const cardW     = (width - PADDING_H * 2 - GAP * 2) / 3;
  const cardH     = cardW * 0.595;

  const carregarCircuitos = async () => {
    const json = await AsyncStorage.getItem('circuitos');
    setCircuitos(json ? JSON.parse(json) : []);
  };

  useFocusEffect(useCallback(() => { carregarCircuitos(); }, []));

  const excluirCircuito = async (id: string) => {
    const ok = await confirmar('Deseja excluir este circuito?');
    if (!ok) return;
    const json = await AsyncStorage.getItem('circuitos');
    const lista: Circuito[] = json ? JSON.parse(json) : [];
    const nova = lista.filter(c => c.id !== id);
    await AsyncStorage.setItem('circuitos', JSON.stringify(nova));
    setCircuitos(nova);
  };

  if (!fontsLoaded) return null;

  const FOOTER_H   = btnH + 48;
  const TITULO_H   = width * 0.02 + 12 + 90;
  const scrollMaxH = height - TITULO_H - FOOTER_H - -8;

  // Largura da área escura central do fundo (ajuste conforme necessário)
  const LINHA_LARGURA = width * 0.97;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground source={require('../assets/images/Fundo_Tela.png')} style={styles.background} resizeMode="stretch">

        <View style={styles.logoContainer}>
          <LogoNerdyDerby width={logoSize} height={logoSize} />
        </View>

        <View style={listaStyles.tituloContainer}>
          <Image
            source={require('../assets/images/Circuitos.png')}
            style={{ width: width * 0.2, height: width * 0.02 }}
            resizeMode="contain"
          />
        </View>

        {/* Scroll + fade azul na borda inferior */}
        <View style={{ maxHeight: scrollMaxH, position: 'relative' }}>
          <ScrollView
            style={[listaStyles.scroll]}
            contentContainerStyle={listaStyles.grid}
            showsVerticalScrollIndicator={false}
          >
            {circuitos.length === 0 ? (
              <Text style={styles.vazio}>NENHUM CIRCUITO FOI CRIADO.</Text>
            ) : (
              circuitos.map((c) => (
                <View key={c.id} style={[listaStyles.card, { width: cardW, height: cardH }]}>
                  {c.fotoFundo
                    ? <Image source={{ uri: c.fotoFundo }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                    : null
                  }
                  <View style={listaStyles.cardOverlay} />
                  <Text style={[listaStyles.cardNome, { color: c.corNome }]} numberOfLines={2}>{c.nome}</Text>
                  <Text style={listaStyles.cardData} numberOfLines={1}>{c.dataEvento}</Text>
                  <Text style={listaStyles.cardCarrinhos}>{c.carrinhos.length} 🏎️</Text>
                  <View style={listaStyles.cardBotoes}>
                    <TouchableOpacity style={listaStyles.cardBotaoEditar} onPress={() => router.push({ pathname: '/circuito', params: { id: c.id } })}>
                      <Text style={listaStyles.cardBotaoTexto}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={listaStyles.cardBotaoExcluir} onPress={() => excluirCircuito(c.id)}>
                      <Text style={listaStyles.cardBotaoTexto}>🗑️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={listaStyles.cardBotaoCorrida} onPress={() => router.push({ pathname: '/corrida', params: { circuitoId: c.id } })}>
                      <Text style={listaStyles.cardBotaoTexto}>▶</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            <View style={{ height: 8 }} />
          </ScrollView>

          {/* Fade na borda inferior do scroll */}
          <LinearGradient
            colors={['transparent', 'rgba(49,18,185,0.85)', 'rgb(49,18,185)']}
            style={listaStyles.fadeBorda}
            pointerEvents="none"
          />
        </View>

        {/* Rodapé */}
        <View style={listaStyles.rodape}>
          {/* Linha azul centralizada com a largura da área escura do fundo */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              alignSelf: 'center',
              width: LINHA_LARGURA,
              height: 3,
              backgroundColor: 'rgb(47, 1, 255)',
            }}
          />

          <View style={listaStyles.rodapeConteudo}>
            <TouchableOpacity onPress={() => router.back()}>
              <Image source={require('../assets/images/Botao__Voltar.png')} style={{ width: btnW, height: btnH }} resizeMode="contain" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push({ pathname: '/circuito', params: { id: 'novo' } })}
              activeOpacity={0.75}
            >
              <Image source={require('../assets/images/Botao__Novo_Circuito.png')} style={{ width: btnW, height: btnH }} resizeMode="contain" />
            </TouchableOpacity>

            <LogoFabLab width={fabLabW} height={fabLabH} />
          </View>
        </View>

      </ImageBackground>
    </View>
  );
}

// ─────────────────────────────────────────────
// CÂMERA GIF
// ─────────────────────────────────────────────
const TOTAL_FRAMES   = 12;
const FRAME_INTERVAL = 250;

function CameraGif({ onCapturado, onCancelar }: { onCapturado: (uri: string) => void; onCancelar: () => void }) {
  const cameraRef   = useRef<CameraView>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [gravando, setGravando]   = useState(false);
  const [progresso, setProgresso] = useState(0);

  const capturarFrames = async () => {
    if (!cameraRef.current) return;
    setGravando(true); setProgresso(0);
    const captured: string[] = [];
    let count = 0;
    intervalRef.current = setInterval(async () => {
      if (!cameraRef.current) return;
      try {
        const foto = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: false, skipProcessing: true });
        if (foto?.uri) {
          captured.push(foto.uri); count++; setProgresso(count);
          if (count >= TOTAL_FRAMES) {
            clearInterval(intervalRef.current!); setGravando(false);
            const path = FileSystem.documentDirectory + `gif_${Date.now()}.json`;
            await FileSystem.writeAsStringAsync(path, JSON.stringify(captured));
            onCapturado(path);
          }
        }
      } catch { clearInterval(intervalRef.current!); setGravando(false); }
    }, FRAME_INTERVAL);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
      <View style={camStyles.overlay}>
        <Text style={camStyles.instrucao}>Aponte para o carrinho na mesa giratória</Text>
        {gravando ? (
          <View style={camStyles.progressoBox}>
            <Text style={camStyles.progressoTexto}>Capturando {progresso}/{TOTAL_FRAMES} frames...</Text>
            <View style={camStyles.barraFundo}>
              <View style={[camStyles.barraPreenchida, { width: `${(progresso / TOTAL_FRAMES) * 100}%` as any }]} />
            </View>
          </View>
        ) : (
          <TouchableOpacity style={camStyles.botaoCapturar} onPress={capturarFrames}>
            <Text style={camStyles.botaoCapturarTexto}>⏺ CAPTURAR GIF</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={camStyles.botaoCancelar} onPress={onCancelar}>
          <Text style={camStyles.botaoCancelarTexto}>✕ Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const camStyles = StyleSheet.create({
  overlay:            { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  instrucao:          { color: '#fff', fontSize: 16, fontFamily: 'MinhaFonte', marginBottom: 16, textAlign: 'center' },
  progressoBox:       { width: '100%', alignItems: 'center', marginBottom: 16 },
  progressoTexto:     { color: '#fff', fontSize: 14, fontFamily: 'MinhaFonte', marginBottom: 8 },
  barraFundo:         { width: '100%', height: 10, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 5 },
  barraPreenchida:    { height: 10, backgroundColor: '#00ff88', borderRadius: 5 },
  botaoCapturar:      { backgroundColor: 'rgba(49,5,242,0.9)', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 40, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(42,12,172,1)' },
  botaoCapturarTexto: { color: '#fff', fontSize: 20, fontFamily: 'MinhaFonte' },
  botaoCancelar:      { backgroundColor: 'rgba(180,0,0,0.8)', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32 },
  botaoCancelarTexto: { color: '#fff', fontSize: 16, fontFamily: 'MinhaFonte' },
});

// ─────────────────────────────────────────────
// PREVIEW GIF
// ─────────────────────────────────────────────
function GifPreview({ uri, style }: { uri: string; style?: any }) {
  const [frameAtual, setFrameAtual] = useState(0);
  const [frames, setFrames]         = useState<string[]>([]);

  useEffect(() => {
    if (!uri?.endsWith('.json')) return;
    FileSystem.readAsStringAsync(uri).then(d => { try { setFrames(JSON.parse(d)); } catch {} }).catch(() => {});
  }, [uri]);

  useEffect(() => {
    if (!frames.length) return;
    const t = setInterval(() => setFrameAtual(f => (f + 1) % frames.length), FRAME_INTERVAL);
    return () => clearInterval(t);
  }, [frames]);

  if (!frames.length) return (
    <View style={[style, { backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>sem gif</Text>
    </View>
  );
  return <Image source={{ uri: frames[frameAtual] }} style={style} resizeMode="cover" />;
}

// ─────────────────────────────────────────────
// FORMULÁRIO — layout 50 / 50
// ─────────────────────────────────────────────
function FormularioCircuito({ id }: { id: string }) {
  const modoEdicao = id !== 'novo';
  const { width, height } = useWindowDimensions();
  const [fontsLoaded] = useFonts({ 'MinhaFonte': require('../assets/fonts/Gamer.ttf') });

  const [nomeCircuito, setNomeCircuito] = useState('');
  const [corNome, setCorNome]           = useState('#ffffff');
  const [dataEvento, setDataEvento]     = useState('');
  const [descricao, setDescricao]       = useState('');
  const [fotoFundo, setFotoFundo]       = useState<string | null>(null);
  const [carrinhos, setCarrinhos]       = useState<Carrinho[]>([]);

  const [codigoManual, setCodigoManual]       = useState('');
  const [numeroCarrinho, setNumeroCarrinho]   = useState('');
  const [nomePiloto, setNomePiloto]           = useState('');
  const [gifCarrinho, setGifCarrinho]         = useState<string | null>(null);
  const [scannerAberto, setScannerAberto]     = useState(false);
  const [cameraGifAberta, setCameraGifAberta] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  const logoSize = width * 0.03;
  const fabLabW  = width * 0.10;
  const fabLabH  = fabLabW * 0.3;
  const btnW     = width * 0.15;
  const btnH     = btnW * 0.20;

  const HEADER_H = 70;
  const TITULO_H = 56;
  const FOOTER_H = btnH + 32;
  const painelH  = height - HEADER_H - TITULO_H - FOOTER_H;

  useEffect(() => {
    if (!modoEdicao) return;
    AsyncStorage.getItem('circuitos').then(json => {
      if (!json) return;
      const lista = JSON.parse(json);
      const c = lista.find((x: any) => x.id === id);
      if (c) {
        setNomeCircuito(c.nome);
        setCorNome(c.corNome);
        setDataEvento(c.dataEvento);
        setDescricao(c.descricao);
        setFotoFundo(c.fotoFundo);
        setCarrinhos(c.carrinhos);
      }
    });
  }, [id]);

  if (!fontsLoaded) return null;

  const escolherFoto = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!r.canceled) {
      const uri = await persistirImagem(r.assets[0].uri);
      setFotoFundo(uri);
    }
  };

  const onQrScanned = ({ data }: { data: string }) => { setScannerAberto(false); setNumeroCarrinho(data); };

  const adicionarCarrinho = () => {
    const numero = numeroCarrinho.trim() || codigoManual.trim();
    if (!numero || !nomePiloto.trim()) {
      Platform.OS === 'web' ? window.alert('Preencha número e piloto.') : require('react-native').Alert.alert('Atenção', 'Preencha número e piloto.');
      return;
    }
    setCarrinhos(prev => [...prev, { id: Date.now().toString(), numero, nomePiloto: nomePiloto.trim(), gifUri: gifCarrinho ?? '' }]);
    setNumeroCarrinho(''); setCodigoManual(''); setNomePiloto(''); setGifCarrinho(null);
  };

  const cancelarCriacao = async () => {
    const ok = await confirmar('Deseja cancelar? Os dados não serão salvos.');
    if (ok) router.replace('/circuito');
  };

  const salvarCircuito = async () => {
    if (!nomeCircuito.trim()) {
      Platform.OS === 'web' ? window.alert('Informe o nome do circuito.') : require('react-native').Alert.alert('Atenção', 'Informe o nome do circuito.');
      return;
    }
    const json = await AsyncStorage.getItem('circuitos');
    const lista = json ? JSON.parse(json) : [];
    if (modoEdicao) {
      const i = lista.findIndex((c: any) => c.id === id);
      if (i !== -1) lista[i] = { ...lista[i], nome: nomeCircuito.trim(), corNome, dataEvento, descricao, fotoFundo, carrinhos };
    } else {
      lista.push({ id: Date.now().toString(), nome: nomeCircuito.trim(), corNome, dataEvento, descricao, fotoFundo, dataCriacao: new Date().toLocaleDateString('pt-BR'), carrinhos });
    }
    await AsyncStorage.setItem('circuitos', JSON.stringify(lista));
    if (Platform.OS === 'web') { window.alert(modoEdicao ? 'Atualizado!' : 'Criado!'); router.replace('/circuito'); }
    else require('react-native').Alert.alert('Sucesso', modoEdicao ? 'Circuito atualizado!' : 'Circuito criado!', [{ text: 'OK', onPress: () => router.replace('/circuito') }]);
  };

  if (scannerAberto) return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} onBarcodeScanned={onQrScanned} barcodeScannerSettings={{ barcodeTypes: ['qr'] }} />
      <TouchableOpacity style={styles.fecharScanner} onPress={() => setScannerAberto(false)}>
        <Text style={styles.fecharScannerTexto}>✕ Fechar</Text>
      </TouchableOpacity>
    </View>
  );

  if (cameraGifAberta) return (
    <CameraGif onCapturado={uri => { setGifCarrinho(uri); setCameraGifAberta(false); }} onCancelar={() => setCameraGifAberta(false)} />
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground source={require('../assets/images/Fundo_Tela.png')} style={styles.background} resizeMode="stretch">

        <View style={styles.logoContainer}>
          <LogoNerdyDerby width={logoSize} height={logoSize} />
        </View>

        <View style={{ height: HEADER_H }} />
        <Text style={styles.secaoTitulo}>
          {modoEdicao ? '✏️ EDITAR CIRCUITO' : 'CRIAR CIRCUITO'}
        </Text>

        <View style={[formStyles.paineis, { height: painelH }]}>

          {/* PAINEL ESQUERDO */}
          <ScrollView style={formStyles.painel} contentContainerStyle={formStyles.painelConteudo} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Nome do Circuito</Text>
            <TextInput style={styles.input} value={nomeCircuito} onChangeText={setNomeCircuito} placeholder="Ex: Circuito Alpha" placeholderTextColor="rgba(255,255,255,0.3)" />

            <Text style={styles.label}>Data do Evento</Text>
            <TextInput style={styles.input} value={dataEvento} onChangeText={setDataEvento} placeholder="DD/MM/AAAA" placeholderTextColor="rgba(255,255,255,0.3)" keyboardType="numeric" />

            <Text style={styles.label}>Descrição</Text>
            <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} value={descricao} onChangeText={setDescricao} placeholder="Descrição do evento..." placeholderTextColor="rgba(255,255,255,0.3)" multiline />

            <Text style={styles.label}>Cor do Nome</Text>
            <View style={styles.coresRow}>
              {['#ffffff','#ff0000','#00ff00','#00bfff','#ffff00','#ff8c00','#ff00ff'].map(cor => (
                <TouchableOpacity key={cor} style={[styles.corBolinha, { backgroundColor: cor }, corNome === cor && styles.corSelecionada]} onPress={() => setCorNome(cor)} />
              ))}
            </View>

            <Text style={styles.label}>Foto de Fundo</Text>
            <TouchableOpacity style={styles.botaoMidia} onPress={escolherFoto}>
              {fotoFundo
                ? <Image source={{ uri: fotoFundo }} style={{ width: '100%', height: 110, borderRadius: 6 }} resizeMode="cover" />
                : <Text style={styles.botaoMidiaTexto}>📷 Escolher da galeria</Text>
              }
            </TouchableOpacity>
          </ScrollView>

          <View style={formStyles.divisor} />

          {/* PAINEL DIREITO */}
          <ScrollView style={formStyles.painel} contentContainerStyle={formStyles.painelConteudo} showsVerticalScrollIndicator={false}>
            <Text style={[styles.secaoTitulo, { fontSize: 26, marginBottom: 8 }]}>CADASTRAR CARRINHO</Text>

            <Text style={styles.label}>Nº Carrinho</Text>
            <View style={styles.qrRow}>
              <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} value={codigoManual} onChangeText={setCodigoManual} placeholder="Código" placeholderTextColor="rgba(255,255,255,0.3)" keyboardType="numeric" />
              <TouchableOpacity style={styles.botaoQr} onPress={async () => { if (!permission?.granted) await requestPermission(); setScannerAberto(true); }}>
                <Text style={styles.botaoQrTexto}>📷</Text>
              </TouchableOpacity>
            </View>
            {numeroCarrinho ? <Text style={styles.qrLido}>✅ QR: {numeroCarrinho}</Text> : null}

            <Text style={styles.label}>Nome do Piloto</Text>
            <TextInput style={styles.input} value={nomePiloto} onChangeText={setNomePiloto} placeholder="Piloto" placeholderTextColor="rgba(255,255,255,0.3)" />

            <Text style={styles.label}>GIF do Carrinho</Text>
            <TouchableOpacity style={styles.botaoMidia} onPress={async () => { if (!permission?.granted) await requestPermission(); setCameraGifAberta(true); }}>
              {gifCarrinho
                ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <GifPreview uri={gifCarrinho} style={{ width: 50, height: 50, borderRadius: 6 }} />
                    <Text style={styles.botaoMidiaTexto}>✅ GIF capturado!</Text>
                  </View>
                : <Text style={styles.botaoMidiaTexto}>📸 Abrir câmera</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarCarrinho}>
              <Text style={styles.botaoAdicionarTexto}>+ ADICIONAR CARRINHO</Text>
            </TouchableOpacity>

            {carrinhos.length > 0 && (
              <View style={styles.carrinhoLista}>
                <Text style={styles.label}>Adicionados:</Text>
                {carrinhos.map(c => (
                  <View key={c.id} style={styles.carrinhoItem}>
                    <GifPreview uri={c.gifUri} style={styles.carrinhoGif} />
                    <Text style={styles.carrinhoItemTexto}>#{c.numero} — {c.nomePiloto}</Text>
                    <TouchableOpacity onPress={() => setCarrinhos(prev => prev.filter(x => x.id !== c.id))}>
                      <Text style={{ color: '#ff4444', fontSize: 18 }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>

        {/* Rodapé */}
        <View style={formStyles.rodape}>
          <TouchableOpacity style={styles.botaoCancelar} onPress={cancelarCriacao}>
            <Text style={styles.botaoCancelarTexto}>✕ CANCELAR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoSalvar} onPress={salvarCircuito}>
            <Text style={styles.botaoSalvarTexto}>{modoEdicao ? '✔ SALVAR' : '✔ CRIAR'}</Text>
          </TouchableOpacity>

          {modoEdicao && (
            <TouchableOpacity style={styles.botaoIniciar} onPress={() => router.push({ pathname: '/corrida', params: { circuitoId: id } })}>
              <Text style={styles.botaoIniciarTexto}>▶ CORRIDA</Text>
            </TouchableOpacity>
          )}

          <View style={{ position: 'absolute', right: 27, bottom: 8 }}>
            <LogoFabLab width={fabLabW} height={fabLabH} />
          </View>
        </View>

      </ImageBackground>
    </View>
  );
}

// ─────────────────────────────────────────────
// ENTRY POINT
// ─────────────────────────────────────────────
export default function Circuito() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  if (!id) return <ListaCircuitos />;
  return <FormularioCircuito id={id} />;
}

// ─────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container:          { flex: 1 },
  background:         { flex: 1, width: '100%', height: '100%' },
  logoContainer:      { alignItems: 'center', position: 'absolute', top: 20, alignSelf: 'center', zIndex: 10 },
  secaoTitulo:        { color: '#fff', fontSize: 58, fontFamily: 'MinhaFonte', textAlign: 'center', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(42,12,172,1)', paddingBottom: 6 },
  label:              { color: 'rgba(255,255,255,0.98)', fontSize: 32, fontFamily: 'MinhaFonte', marginBottom: 4, marginTop: 8 },
  input:              { backgroundColor: 'rgb(0,0,0)', borderRadius: 8, borderWidth: 1, borderColor: 'rgb(49,14,204)', color: '#fff', fontSize: 20, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 4, fontFamily: 'MinhaFonte' },
  coresRow:           { flexDirection: 'row', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  corBolinha:         { width: 28, height: 28, borderRadius: 14 },
  corSelecionada:     { borderWidth: 3, borderColor: '#fff' },
  botaoMidia:         { backgroundColor: 'rgba(44,0,242,0.8)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(42,12,172,1)', padding: 12, alignItems: 'center', marginBottom: 4 },
  botaoMidiaTexto:    { color: '#fff', fontSize: 26, fontFamily: 'MinhaFonte' },
  qrRow:              { flexDirection: 'row', gap: 8, marginBottom: 4 },
  botaoQr:            { backgroundColor: 'rgba(42,8,191,0.8)', borderRadius: 8, paddingHorizontal: 14, justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(42,12,172,1)' },
  botaoQrTexto:       { color: '#fff', fontSize: 28 },
  qrLido:             { color: '#00ff88', fontSize: 22, fontFamily: 'MinhaFonte', marginBottom: 4 },
  botaoAdicionar:     { backgroundColor: 'rgba(49,5,242,0.8)', borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: 'rgba(42,12,172,1)' },
  botaoAdicionarTexto:{ color: '#fff', fontSize: 30, fontFamily: 'MinhaFonte' },
  carrinhoLista:      { marginTop: 10 },
  carrinhoItem:       { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(15,12,1,0.82)', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, marginBottom: 5, gap: 8 },
  carrinhoGif:        { width: 40, height: 40, borderRadius: 6 },
  carrinhoItemTexto:  { color: '#fff', fontSize: 18, fontFamily: 'MinhaFonte', flex: 1 },
  botaoSalvar:        { backgroundColor: 'rgba(4,200,92,0.8)', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 36, alignItems: 'center', borderWidth: 1, borderColor: '#00b450', },
  botaoSalvarTexto:   { color: '#fff', fontSize: 20, fontFamily: 'MinhaFonte' },
  botaoCancelar:      { backgroundColor: 'rgba(227,7,7,0.8)', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 36, alignItems: 'center', borderWidth: 1, borderColor: '#b40000' },
  botaoCancelarTexto: { color: '#fff', fontSize: 20, fontFamily: 'MinhaFonte' },
  botaoIniciar:       { backgroundColor: 'rgba(42,12,172,0.8)', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 36, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(42,12,172,1)' },
  botaoIniciarTexto:  { color: '#fff', fontSize: 20, fontFamily: 'MinhaFonte' },
  fecharScanner:      { position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(0,0,0,0.7)', padding: 12, borderRadius: 8 },
  fecharScannerTexto: { color: '#fff', fontSize: 16 },
  vazio:              { color: 'rgba(255,255,255,0.85)', textAlign: 'center', fontFamily: 'MinhaFonte', fontSize: 60, marginTop: 170 },
});

const formStyles = StyleSheet.create({
  paineis:        { flexDirection: 'row', marginHorizontal: 12 },
  painel:         { flex: 1 },
  painelConteudo: { paddingHorizontal: 14, paddingBottom: 12, },
  divisor:        { width: 2, backgroundColor: 'rgba(42,12,172,0.8)', marginVertical:4 },
  rodape:         {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 24,
    paddingVertical: 14,
    paddingTop: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderTopWidth: 0,
    marginVertical: -15, // removido — a linha agora é uma View separada
  },
});

const listaStyles = StyleSheet.create({
  tituloContainer: { alignItems: 'center', marginTop: 90, marginBottom: 12 },
  scroll:          { paddingHorizontal: 32 },
  grid:            { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'flex-start' },
  card:            { borderRadius: 10, borderWidth: 3, borderColor: 'rgb(49,18,185)', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, justifyContent: 'space-between' },
  cardOverlay:     { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  cardNome:        { fontSize: 46, fontFamily: 'MinhaFonte', zIndex: 1 },
  cardData:        { color: 'rgba(255,255,255,0.9)', fontSize: 32, fontFamily: 'MinhaFonte', zIndex: 1 },
  cardCarrinhos:   { color: 'rgba(255,255,255,0.9)', fontSize: 53, fontFamily: 'MinhaFonte', zIndex: 1 },
  cardBotoes:      { flexDirection: 'row', gap: 8, zIndex: 1 },
  cardBotaoEditar:  { backgroundColor: 'rgba(47, 0, 255, 0.73)', borderRadius: 6, padding: 6 },
  cardBotaoExcluir: { backgroundColor: 'rgba(255, 0, 0, 0.6)', borderRadius: 6, padding: 6 },
  cardBotaoCorrida: { backgroundColor: 'rgba(0, 255, 42, 0.58)', borderRadius: 6, padding: 6 },
  cardBotaoTexto:   { fontSize: 20 },
  rodape: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'column',           // coluna: linha azul em cima, botões embaixo
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    borderTopWidth: 0,
    marginHorizontal: 24,
    marginVertical: 20,                 // sem borda — usamos a View abaixo
  },
  rodapeConteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 12,
    width: '100%',
  },
  
});