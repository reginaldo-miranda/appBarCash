import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  Alert,
  Modal,
  Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { saleService, API_URL, caixaService, getWsUrl } from '../../src/services/api';
import ScreenIdentifier from '../../src/components/ScreenIdentifier';
import { events } from '../../src/utils/eventBus';
import { mesaService } from '../../src/services/api';
import { SafeIcon } from '../../components/SafeIcon';

interface Sale {
  _id: string;
  numeroComanda?: string;
  nomeComanda?: string;
  tipoVenda: string;
  status: string;
  itens: {
    produto?: string;
    nomeProduto: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
    _id: string;
  }[];
  mesa?: { _id?: string; numero?: string; nome?: string; funcionarioResponsavel?: { nome: string }; nomeResponsavel?: string };
  funcionario?: { nome: string };
  // Snapshots adicionados na finalização
  responsavelNome?: string; // cliente
  responsavelFuncionario?: string; // se existir, manter por compatibilidade
  funcionarioNome?: string; // funcionário que finalizou (compatibilidade)
  funcionarioId?: string;
  funcionarioAberturaNome?: string; // funcionário que abriu a mesa
  funcionarioAberturaId?: string;
  subtotal: number;
  desconto: number;
  total: number;
  formaPagamento?: string;
  createdAt: string;
  updatedAt: string;
}

interface CaixaVenda {
  venda: Sale;
  valor: number;
  formaPagamento: string;
  dataVenda: string;
}

export default function CaixaScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vendas, setVendas] = useState<Sale[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('dinheiro');

  const [caixaVendas, setCaixaVendas] = useState<CaixaVenda[]>([]);
  const [hasCaixaAberto, setHasCaixaAberto] = useState<boolean>(false);
  // Map de detalhes de mesa por venda._id (quando populate faltar)
  const [mesaInfoBySale, setMesaInfoBySale] = useState<Record<string, any>>({});
  // Filtro por data (padrão hoje)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [marks, setMarks] = useState<Record<string, boolean>>({});
  const [markFilter, setMarkFilter] = useState<'all' | 'marked' | 'unmarked'>('all');
  const [paymentFilterWeb, setPaymentFilterWeb] = useState<'all' | 'dinheiro' | 'cartao' | 'pix'>('all');
  
  // Novo estado para filtro de exibição (Abertas vs Registradas)
  const [displayFilter, setDisplayFilter] = useState<'all' | 'open' | 'registered'>('all');

  // Helpers e cálculos para filtro por data e subtotais
  const formatSelectedDate = selectedDate.toLocaleDateString('pt-BR');
  const prevDay = () => setSelectedDate((d: Date) => new Date(d.getTime() - 86400000));
  const nextDay = () => setSelectedDate((d: Date) => new Date(d.getTime() + 86400000));

  const filteredCaixaVendas: CaixaVenda[] = caixaVendas.filter((cv: CaixaVenda) => {
    const dv = new Date(cv.dataVenda || cv.venda?.createdAt);
    const matchDate = dv.toDateString() === selectedDate.toDateString();

    if (!matchDate) return false;

    if (Platform.OS !== 'web') {
      return true;
    }

    const isMarked = !!marks[saleKey(cv.venda)];
    const matchMark =
      markFilter === 'all' ||
      (markFilter === 'marked' ? isMarked : !isMarked);

    const method = String(cv.formaPagamento || '').toLowerCase();
    const matchPayment =
      paymentFilterWeb === 'all' || method === paymentFilterWeb;

    return matchMark && matchPayment;
  });

  const paymentTotals: Record<string, number> = filteredCaixaVendas.reduce((acc: Record<string, number>, cv: CaixaVenda) => {
    const m = String(cv.formaPagamento || '').toLowerCase();
    const v = Number(cv.valor ?? cv.venda?.total ?? 0);
    acc[m] = (acc[m] || 0) + v;
    return acc;
  }, {} as Record<string, number>);

  const formatMethodLabel = (m: string) => {
    const cleaned = (m || '').trim();
    if (!cleaned) return 'Indefinido';
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  };

  const loadVendas = async () => {
    try {
      setLoading(true);
      console.log('🔄 Carregando vendas abertas do Caixa...');
      console.log('🔗 API_URL:', API_URL);

      const response = await saleService.open();
      const abertas = response.data || [];
      console.log('✅ Vendas abertas carregadas:', abertas);

      if (Array.isArray(abertas) && abertas.length > 0) {
        setVendas(abertas);
        console.log(`📊 ${abertas.length} vendas abertas encontradas`);
      } else {
        console.log('⚠️ Nenhuma venda com status "aberta". Tentando fallback status="aberto"...');
        const respFallback = await saleService.list({ status: 'aberto' });
        const abertasFallback = respFallback.data || [];
        console.log('✅ Fallback vendas abertas (status="aberto"):', abertasFallback);
        setVendas(abertasFallback);
        console.log(`📊 ${abertasFallback.length} vendas (status="aberto") encontradas`);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar vendas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as vendas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadCaixaAberto = async () => {
    try {
      console.log('🔄 Buscando caixa aberto e vendas registradas...');
      const resp = await caixaService.statusAberto();
      const caixaData = resp.data;
      setHasCaixaAberto(true);

      const vendasRegistradas: CaixaVenda[] = (caixaData?.vendas || []).map((v: any) => ({
        venda: v.venda,
        valor: v.valor,
        formaPagamento: v.formaPagamento,
        dataVenda: v.dataVenda,
      }));
      setCaixaVendas(vendasRegistradas);
      console.log(`🧾 ${vendasRegistradas.length} vendas registradas no caixa aberto`);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        console.log('ℹ️ Nenhum caixa aberto no momento.');
        setHasCaixaAberto(false);
        setCaixaVendas([]);
      } else {
        console.error('❌ Erro ao buscar caixa aberto:', error);
      }
    }
  };

  // Atualizações sem spinner para evitar flicker
  const softRefreshVendas = async () => {
    try {
      const response = await saleService.open();
      const abertas = response.data || [];
      setVendas((prev) => {
        const byId = new Map<string, any>();
        prev.forEach((v: any) => byId.set(String((v as any)?._id || (v as any)?.id), v));
        abertas.forEach((v: any) => byId.set(String((v as any)?._id || (v as any)?.id), v));
        return Array.from(byId.values());
      });
    } catch {}
  };

  const softRefreshCaixa = async () => {
    try {
      const resp = await caixaService.statusAberto();
      const caixaData = resp.data;
      setHasCaixaAberto(true);
      const vendasRegistradas: CaixaVenda[] = (caixaData?.vendas || []).map((v: any) => ({
        venda: v.venda,
        valor: v.valor,
        formaPagamento: v.formaPagamento,
        dataVenda: v.dataVenda,
      }));
      setCaixaVendas(vendasRegistradas);
    } catch {}
  };

  const calcularTotal = (venda: Sale) => {
    return venda.itens.reduce((total, item) => {
      return total + (item.precoUnitario * item.quantidade);
    }, 0);
  };

  const finalizarVenda = async () => {
    if (!selectedSale) return;

    try {
      console.log('🔄 Finalizando venda:', selectedSale._id);
      console.log('💳 Método de pagamento:', paymentMethod);

      const response = await saleService.finalize(selectedSale._id, {
        formaPagamento: paymentMethod
      });

      console.log('✅ Venda finalizada com sucesso:', response);
      
      Alert.alert('Sucesso', 'Venda finalizada com sucesso!');
      setModalVisible(false);
      setSelectedSale(null);
      await loadVendas(); // Recarregar a lista
      await loadCaixaAberto(); // Atualizar vendas registradas no caixa
      
    } catch (error: any) {
      console.error('❌ Erro ao finalizar venda:', error);
      
      let errorMessage = 'Erro desconhecido';
      if (error.response) {
        errorMessage = error.response.data?.error || `Erro ${error.response.status}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Erro', `Não foi possível finalizar a venda: ${errorMessage}`);
    }
  };

  const abrirModalFinalizacao = (venda: Sale) => {
    setSelectedSale(venda);
    setPaymentMethod('dinheiro');
    setModalVisible(true);
  };

  const persistMarks = (next: Record<string, boolean>) => {
    if (Platform.OS === 'web') {
      try {
        window.localStorage.setItem('caixaMarks', JSON.stringify(next));
      } catch (e) {
        console.log('Falha ao salvar marcas', e);
      }
    }
  };

  const toggleMark = (saleId: string) => {
    setMarks(prev => {
      const next = { ...prev, [saleId]: !prev[saleId] };
      persistMarks(next);
      return next;
    });
  };

  useEffect(() => {
    loadVendas();
    loadCaixaAberto();
    const unsubscribe = events.on('caixa:refresh', () => onRefresh());
    return () => unsubscribe && unsubscribe();
  }, []);

  useEffect(() => {
    let since = Date.now();
    const t = setInterval(async () => {
      try {
        const res = await saleService.updates(since);
        const updates = res?.data?.updates || [];
        if (updates.length) {
          since = res?.data?.now || Date.now();
          // Buscar somente vendas alteradas e mesclar sem spinner
          const ids: string[] = updates.map((u: any) => String(u.id));
          const results = await Promise.all(ids.map((id) => saleService.getById(id)));
          const changed = results.map((r) => r.data).filter(Boolean);
          if (changed.length) {
            setVendas((prev) => {
              const byId = new Map<string, any>();
              prev.forEach((v: any) => byId.set(String((v as any)?._id || (v as any)?.id), v));
              changed.forEach((v: any) => byId.set(String((v as any)?._id || (v as any)?.id), v));
              return Array.from(byId.values());
            });
          }
          await softRefreshCaixa();
        }
      } catch {}
    }, 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // WS para mobile/ExpoGo (bidirecional)
    try {
      const url = getWsUrl();
      if (url) {
        const ws = new (globalThis as any).WebSocket(url);
        ws.onmessage = async (e: any) => {
          try {
            const msg = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
            if (msg?.type === 'sale:update') {
              const id = String(msg?.payload?.id || '');
              if (!id) return;
              const r = await saleService.getById(id);
              const v = r.data;
              if (v) {
                setVendas((prev) => {
                  const byId = new Map<string, any>();
                  prev.forEach((x: any) => byId.set(String((x as any)?._id || (x as any)?.id), x));
                  byId.set(String(v._id || v.id), v);
                  return Array.from(byId.values());
                });
                await softRefreshCaixa();
              }
            }
          } catch {}
        };
        return () => { try { ws.close(); } catch {} };
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        const saved = window.localStorage.getItem('caixaMarks');
        if (saved) setMarks(JSON.parse(saved));
      } catch (e) {
        console.log('Falha ao carregar marcas do localStorage', e);
      }
    }
  }, []);

  // Quando caixaVendas atualiza, buscar mesa faltando populate
  useEffect(() => {
    const fetchMissingMesa = async () => {
      try {
        const tasks = caixaVendas
          .filter(cv => {
            const mesaRef: any = cv?.venda?.mesa;
            if (!mesaRef) return false;
            // Buscar quando for string (ObjectId) OU quando vier objeto incompleto (sem funcionarioResponsavel.nome ou nomeResponsavel)
            if (typeof mesaRef === 'string') return true;
            if (typeof mesaRef === 'object') {
              const hasFuncNome = !!mesaRef?.funcionarioResponsavel?.nome && String(mesaRef?.funcionarioResponsavel?.nome).trim().length > 0;
              const hasRespNome = !!mesaRef?.nomeResponsavel && String(mesaRef?.nomeResponsavel).trim().length > 0;
              // Se faltar algum dos nomes, tentar buscar detalhes completos
              return !(hasFuncNome && hasRespNome);
            }
            return false;
          })
          .map(async (cv) => {
            const mesaRef: any = cv?.venda?.mesa;
            const mesaId = typeof mesaRef === 'string' ? mesaRef : mesaRef?._id;
            if (!mesaId) return;
            try {
              const resp = await mesaService.getById(mesaId);
              const mesaData = resp?.data?.data || resp?.data; // algumas rotas retornam { data }
              if (mesaData && mesaData._id) {
                setMesaInfoBySale(prev => ({ ...prev, [saleKey(cv.venda)]: mesaData }));
              }
            } catch (e) {
              console.warn('Falha ao buscar detalhes da mesa', mesaId, e);
            }
          });
        await Promise.all(tasks);
      } catch (err) {
        console.warn('Erro ao resolver mesas sem populate:', err);
      }
    };

    if (caixaVendas.length > 0) {
      fetchMissingMesa();
    }
  }, [caixaVendas]);

  // Helper para título da venda evitando "Mesa undefined"
  const getVendaTitle = (venda: Sale) => {
    // Preferir presença de venda.mesa ao invés de tipoVenda
    if (venda.mesa) {
      const nomeMesa = venda.mesa?.nome;
      const numeroMesa = venda.mesa?.numero;
      if (nomeMesa) return nomeMesa;
      if (numeroMesa != null) return `Mesa ${numeroMesa}`;
      return 'Mesa';
    }
    // Quando for comanda, explicitar “Comanda” no título
    if (venda.nomeComanda) return `Comanda ${venda.nomeComanda}`;
    if (venda.numeroComanda) return `Comanda ${venda.numeroComanda}`;
    return 'Comanda';
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadVendas();
    loadCaixaAberto();
  };

  // Recarrega ao focar na tela (útil após fechar mesa em outra aba)
  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
      return () => {};
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Carregando vendas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenIdentifier screenName="Caixa" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Sistema de Caixa</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <SafeIcon name="refresh" size={20} color="#2196F3" fallbackText="↻" />
        </TouchableOpacity>
      </View>

      {/* Componente de Filtro de Exibição */}
      <View style={styles.viewFilterContainer}>
         <TouchableOpacity 
            style={[styles.viewFilterOption, displayFilter === 'all' && styles.viewFilterOptionSelected]}
            onPress={() => setDisplayFilter('all')}
         >
             <Text style={[styles.viewFilterText, displayFilter === 'all' && styles.viewFilterTextSelected]}>Todos</Text>
         </TouchableOpacity>
         <TouchableOpacity 
            style={[styles.viewFilterOption, displayFilter === 'open' && styles.viewFilterOptionSelected]}
            onPress={() => setDisplayFilter('open')}
         >
             <Text style={[styles.viewFilterText, displayFilter === 'open' && styles.viewFilterTextSelected]}>Vendas Abertas</Text>
         </TouchableOpacity>
         <TouchableOpacity 
            style={[styles.viewFilterOption, displayFilter === 'registered' && styles.viewFilterOptionSelected]}
            onPress={() => setDisplayFilter('registered')}
         >
             <Text style={[styles.viewFilterText, displayFilter === 'registered' && styles.viewFilterTextSelected]}>Vendas Registradas</Text>
         </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Vendas abertas para finalizar */}
        {(displayFilter === 'all' || displayFilter === 'open') && (
        <>
            <Text style={[styles.sectionTitle]}>Vendas em aberto</Text>
            {vendas.length === 0 ? (
            <View style={styles.emptyContainer}>
                <SafeIcon name="receipt-outline" size={64} color="#ccc" fallbackText="🧾" />
                <Text style={styles.emptyText}>Nenhuma venda em aberto</Text>
            </View>
            ) : (
            <View style={styles.listGrid}>
                {vendas.map((venda) => (
                <View key={venda._id} style={styles.vendaCard}>
                    <View style={styles.rowLine}>
                    <Text style={styles.vendaTitle}>
                        {getVendaTitle(venda)}
                    </Text>
                    <View style={styles.rowRight}>
                        <Text style={styles.vendaTotal}>
                        R$ {calcularTotal(venda).toFixed(2)}
                        </Text>
                        <TouchableOpacity
                        style={styles.rowAction}
                        onPress={() => abrirModalFinalizacao(venda)}
                        accessibilityLabel="Finalizar venda"
                        >
                        <SafeIcon name="checkmark-circle" size={20} color="#4CAF50" fallbackText="✓" />
                        </TouchableOpacity>
                    </View>
                    </View>
                    <View style={styles.rowLine}>
                    <Text style={styles.vendaInfoCompact}>
                        Itens: {venda.itens.length} | Funcionário: {venda.funcionario?.nome || 'N/A'}
                    </Text>
                    </View>
                </View>
                ))}
            </View>
            )}
        </>
        )}

        {/* Vendas registradas no Caixa aberto */}
        {(displayFilter === 'all' || displayFilter === 'registered') && (
        <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Vendas registradas no Caixa</Text>
            {!hasCaixaAberto ? (
            <View style={styles.emptyContainer}>
                <SafeIcon name="cash-outline" size={64} color="#ccc" fallbackText="＄" />
                <Text style={styles.emptyText}>Nenhum caixa aberto</Text>
            </View>
            ) : (
            <>
                <View style={styles.filterBar}>
                <TouchableOpacity onPress={prevDay} accessibilityLabel="Dia anterior">
                    <SafeIcon name="chevron-back" size={20} color="#333" fallbackText="‹" />
                </TouchableOpacity>
                <Text style={styles.dateDisplay}>{formatSelectedDate}</Text>
                <TouchableOpacity onPress={nextDay} accessibilityLabel="Próximo dia">
                    <SafeIcon name="chevron-forward" size={20} color="#333" fallbackText="›" />
                </TouchableOpacity>
                </View>

                <View style={styles.summaryBar}>
                {Object.entries(paymentTotals as Record<string, number>).length === 0 ? (
                    <Text style={styles.summaryItem}>Sem subtotais</Text>
                ) : (
                    Object.entries(paymentTotals as Record<string, number>).map(([method, total]) => (
                    <Text key={method} style={styles.summaryItem}>
                        {formatMethodLabel(method)}: R$ {total.toFixed(2)}
                    </Text>
                    ))
                )}
                </View>

                {Platform.OS === 'web' && (
                <View style={styles.webFilterContainer}>
                    <View style={styles.webFilterGroup}>
                        <TouchableOpacity
                            style={[styles.miniFilterButton, markFilter === 'all' && styles.miniFilterButtonSelected]}
                            onPress={() => setMarkFilter('all')}
                        >
                            <Text style={[styles.miniFilterText, markFilter === 'all' && styles.miniFilterTextSelected]}>Todos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.miniFilterButton, markFilter === 'marked' && styles.miniFilterButtonSelected]}
                            onPress={() => setMarkFilter('marked')}
                        >
                            <Text style={[styles.miniFilterText, markFilter === 'marked' && styles.miniFilterTextSelected]}>Marcados</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.miniFilterButton, markFilter === 'unmarked' && styles.miniFilterButtonSelected]}
                            onPress={() => setMarkFilter('unmarked')}
                        >
                            <Text style={[styles.miniFilterText, markFilter === 'unmarked' && styles.miniFilterTextSelected]}>Não marcados</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.webFilterGroup}>
                        {['all', 'dinheiro', 'cartao', 'pix', 'cashback'].map((method) => (
                            <TouchableOpacity
                                key={method}
                                style={[styles.miniFilterButton, paymentFilterWeb === method && styles.miniFilterButtonSelected]}
                                onPress={() => setPaymentFilterWeb(method as any)}
                            >
                                <Text style={[styles.miniFilterText, paymentFilterWeb === method && styles.miniFilterTextSelected]}>
                                    {method === 'all' ? 'Todas' : method.charAt(0).toUpperCase() + method.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                )}

                {filteredCaixaVendas.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <SafeIcon name="list-outline" size={64} color="#ccc" fallbackText="≡" />
                    <Text style={styles.emptyText}>Nenhuma venda registrada no caixa</Text>
                </View>
                ) : (
                <View style={styles.listGrid}>
                    {filteredCaixaVendas.map((cv, idx) => {
                    const mesaObj: any = mesaInfoBySale[saleKey(cv.venda)] || ((cv.venda.mesa && typeof cv.venda.mesa === 'object') ? cv.venda.mesa : undefined);
                    const clean = (s: any) => (typeof s === 'string' ? s.trim() : '');
                    const nomeRespMesa = clean(mesaObj?.nomeResponsavel);
                    const nomeFuncMesa = clean(mesaObj?.funcionarioResponsavel?.nome);
                    let responsavel = 
                        nomeRespMesa ||
                        clean(cv.venda?.responsavelNome) ||
                        'N/A';
                    let funcionario = 
                        nomeFuncMesa ||
                        clean(cv.venda?.funcionario?.nome) ||
                        clean((cv.venda as any)?.funcionarioAberturaNome) ||
                        clean((cv.venda as any)?.funcionarioNome) ||
                        'N/A';
                    if (responsavel !== 'N/A' && funcionario !== 'N/A' && responsavel === funcionario) {
                        const respAlt = clean(cv.venda?.responsavelNome);
                        if (respAlt && respAlt !== funcionario) {
                        responsavel = respAlt;
                        } else {
                        responsavel = 'N/A';
                        }
                    }
                    return (
                        <View key={`${saleKey(cv.venda)}-${idx}`} style={styles.vendaCard}>
                        <View style={styles.rowLine}>
                            <Text style={styles.vendaTitle}>
                            {mesaObj
                                ? (mesaObj?.nome || (mesaObj?.numero != null ? `Mesa ${mesaObj?.numero}` : 'Mesa'))
                                : getVendaTitle(cv.venda)}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.vendaTotal}>R$ {cv.valor.toFixed(2)}</Text>
                            {Platform.OS === 'web' && (
                                <TouchableOpacity
                                style={styles.rowAction}
                                onPress={() => toggleMark(saleKey(cv.venda))}
                                accessibilityLabel={marks[saleKey(cv.venda)] ? 'Desmarcar' : 'Marcar'}
                                >
                                <SafeIcon
                                    name={marks[saleKey(cv.venda)] ? 'checkbox' : 'square-outline'}
                                    size={18}
                                    color={marks[saleKey(cv.venda)] ? '#2196F3' : '#999'}
                                    fallbackText={marks[saleKey(cv.venda)] ? '☑' : '☐'}
                                />
                                </TouchableOpacity>
                            )}
                            </View>
                        </View>
                        <View style={styles.rowLine}>
                            <Text style={styles.vendaInfoCompact}>
                            Resp: {responsavel} | Atend: {funcionario} | Pgto: {cv.formaPagamento} | Itens: {cv.venda?.itens?.length ?? 0}
                            </Text>
                        </View>
                        </View>
                    );
                    })}
                </View>
                )}
            </>
            )}
        </>
        )}

      </ScrollView>

      {/* Modal de Finalização */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Finalizar Venda</Text>
            
            {selectedSale && (
              <View style={styles.modalInfo}>
                <Text style={styles.modalInfoText}>
                  {getVendaTitle(selectedSale)}
                </Text>
                <Text style={styles.modalInfoText}>
                  Total: R$ {calcularTotal(selectedSale).toFixed(2)}
                </Text>
              </View>
            )}
            
            <Text style={styles.paymentLabel}>Forma de Pagamento:</Text>
            
            <View style={styles.paymentOptions}>
              {['dinheiro', 'cartao', 'pix'].map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.paymentOption,
                    paymentMethod === method && styles.paymentOptionSelected
                  ]}
                  onPress={() => setPaymentMethod(method)}
                >
                  <Text style={[
                    styles.paymentOptionText,
                    paymentMethod === method && styles.paymentOptionTextSelected
                  ]}>
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={finalizarVenda}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9', // Fundo levemente mais escuro para contraste das linhas brancas
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  
  // Header Compacto
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 12,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    zIndex: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  refreshButton: {
    padding: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  content: {
    flex: 1,
    paddingHorizontal: 12, // Padding lateral reduzido
    paddingTop: 8,
  },

  // Filtros Compactos
  viewFilterContainer: {
     flexDirection: 'row',
     backgroundColor: '#E2E8F0',
     padding: 2,
     borderRadius: 8,
     marginHorizontal: 12,
     marginTop: 8,
     marginBottom: 4,
     height: 32, // Altura fixa reduzida
  },
  viewFilterOption: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 6,
  },
  viewFilterOptionSelected: {
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 1,
  },
  viewFilterText: {
      fontSize: 12, // Fonte menor
      fontWeight: '600',
      color: '#64748B',
  },
  viewFilterTextSelected: {
      color: '#0F172A', // Texto preto suave
      fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    marginTop: 8,
    paddingHorizontal: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 8,
  },

  // Lista / Linhas Ultra Compactas
  listGrid: {
    flexDirection: 'column', // Mudança para coluna (lista vertical)
    paddingBottom: 12, // Reduzido de 24
  },
  vendaCard: {
    backgroundColor: '#fff',
    borderRadius: 6, // Bordas ainda menos arredondadas
    paddingVertical: 4, // Reduzido de 8 para 4 (metade)
    paddingHorizontal: 8, // Reduzido de 12 para 8
    marginBottom: 2, // Margem mínima entre itens (reduzido de 4)
    width: '100%', // Largura total
    borderLeftWidth: 3, // Reduzido de 4
    borderLeftColor: '#10B981', // Verde
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row', // Layout horizontal
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02, // Sombra ainda mais sutil
    shadowRadius: 1,
    elevation: 1,
  },
  // Reorganização interna do card para linha única
  rowLine: {
    flex: 1, // Ocupa o espaço disponível
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vendaTitle: {
    fontSize: 13, // Fonte levemente reduzida (era 14)
    fontWeight: '700',
    color: '#1E293B',
    minWidth: 70, // Largura mínima reduzida
  },
  // Container para informações secundárias na mesma linha ou logo abaixo
  vendaInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8, // Reduzido de 12
    marginRight: 8, // Reduzido de 12
    gap: 4, // Reduzido de 8
    overflow: 'hidden',
  },
  vendaInfoCompact: {
    fontSize: 10, // Fonte reduzida (era 11)
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 4, // Reduzido de 6
    paddingVertical: 1, // Reduzido de 2
    borderRadius: 3, // Reduzido de 4
  },
  
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // Reduzido de 8
  },
  vendaTotal: {
    fontSize: 13, // Reduzido de 14
    fontWeight: '700',
    color: '#059669', // Verde mais escuro para contraste em texto pequeno
    minWidth: 60, // Reduzido de 70
    textAlign: 'right',
  },
  rowAction: {
    padding: 2, // Reduzido de 4
  },

  // Filtros e Resumo (Vendas Registradas)
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 6, // Reduzido de 8
    borderRadius: 8,
    marginBottom: 6, // Reduzido de 8
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateDisplay: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  summaryBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4, // Reduzido de 6
    marginBottom: 8, // Reduzido de 12
  },
  summaryItem: {
    fontSize: 10, // Reduzido de 11
    fontWeight: '600',
    color: '#334155',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 6, // Reduzido de 8
    paddingVertical: 2, // Reduzido de 4
    borderRadius: 10, // Reduzido de 12
  },
  
  // Modal de Finalização (Mantido estilo, mas ajustado levemente)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: Platform.OS === 'web' ? '380px' : '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalInfo: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalInfoText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '600',
    marginBottom: 2,
  },
  paymentLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20,
  },
  paymentOption: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  paymentOptionSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#F0F9FF',
    borderWidth: 2,
  },
  paymentOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  paymentOptionTextSelected: {
    color: '#0369A1',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#10B981',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  
  // Novos estilos compactos para filtro web
  webFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8, // Reduzido de 12
    marginBottom: 4, // Reduzido de 8
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  webFilterGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2, // Reduzido de 4
    alignItems: 'center',
    padding: 2,
    backgroundColor: '#F1F5F9',
    borderRadius: 6, // Reduzido de 8
  },
  miniFilterButton: {
    paddingHorizontal: 6, // Reduzido de 8
    paddingVertical: 3, // Reduzido de 5
    borderRadius: 4, // Reduzido de 6
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 0,
  },
  miniFilterButtonSelected: {
    backgroundColor: '#fff',
    borderColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 1, // Reduzido de 2
    elevation: 1,
  },
  miniFilterText: {
    fontSize: 10, // Reduzido de 11
    fontWeight: '600',
    color: '#64748B',
  },
  miniFilterTextSelected: {
    color: '#0F172A',
    fontWeight: '700',
  },
});

const saleKey = (v: Sale) => String((v as any)?._id || (v as any)?.id || '');


