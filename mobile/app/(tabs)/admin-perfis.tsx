import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeIcon } from '../../components/SafeIcon';
import api from '../../src/services/api';
import ScreenIdentifier from '../../src/components/ScreenIdentifier';

interface Role {
  id: number;
  nome: string;
  descricao: string;
  permissoes: {
    produtos: boolean;
    funcionarios: boolean;
    clientes: boolean;
    vendas: boolean;
    relatorios: boolean;
    configuracoes: boolean;
  };
  ativo: boolean;
}

const PERMISSION_LABELS: Record<string, string> = {
  produtos: 'Gerenciar Produtos',
  funcionarios: 'Gerenciar Funcionários',
  clientes: 'Gerenciar Clientes',
  vendas: 'Realizar Vendas',
  relatorios: 'Acessar Relatórios',
  configuracoes: 'Acessar Configurações',
};

export default function AdminPerfisScreen() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Form State
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [permissoes, setPermissoes] = useState<any>({
    produtos: false,
    funcionarios: false,
    clientes: false,
    vendas: false,
    relatorios: false,
    configuracoes: false,
  });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/roles');
      setRoles(res.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os perfis.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setNome(role.nome);
      setDescricao(role.descricao || '');
      setPermissoes(role.permissoes || {});
    } else {
      setEditingRole(null);
      setNome('');
      setDescricao('');
      setPermissoes({
        produtos: false,
        funcionarios: false,
        clientes: false,
        vendas: false,
        relatorios: false,
        configuracoes: false,
      });
    }
    setModalVisible(true);
  };

  const handeSave = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Informe o nome do perfil.');
      return;
    }

    try {
      const payload = {
        nome,
        descricao,
        permissoes,
        ativo: true
      };

      if (editingRole) {
        await api.put(`/roles/${editingRole.id}`, payload);
        Alert.alert('Sucesso', 'Perfil atualizado!');
      } else {
        await api.post('/roles', payload);
        Alert.alert('Sucesso', 'Perfil criado!');
      }
      setModalVisible(false);
      loadRoles();
    } catch (error: any) {
      console.error(error);
      Alert.alert('Erro', error?.response?.data?.error || 'Erro ao salvar perfil.');
    }
  };

  const handleDelete = (role: Role) => {
    Alert.alert(
      'Excluir Perfil',
      `Deseja realmente excluir "${role.nome}"? Usuários vinculados a ele podem ficar sem acesso.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/roles/${role.id}`);
              Alert.alert('Sucesso', 'Perfil removido.');
              loadRoles();
            } catch (e: any) {
               Alert.alert('Erro', e?.response?.data?.error || 'Erro ao excluir.');
            }
          }
        }
      ]
    );
  };

  const togglePermission = (key: string) => {
    setPermissoes((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenIdentifier screenName="Gerenciar Perfis" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Perfis de Acesso</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal()}>
          <SafeIcon name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Novo Perfil</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {roles.map((role) => (
           <View key={role.id} style={styles.card}>
              <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.roleName}>{role.nome}</Text>
                    {role.descricao ? <Text style={styles.roleDesc}>{role.descricao}</Text> : null}
                  </View>
                  <View style={styles.actions}>
                      <TouchableOpacity onPress={() => handleOpenModal(role)} style={styles.actionBtn}>
                          <SafeIcon name="create-outline" size={20} color="#2196F3" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(role)} style={styles.actionBtn}>
                          <SafeIcon name="trash-outline" size={20} color="#F44336" />
                      </TouchableOpacity>
                  </View>
              </View>
              <View style={styles.permsSummary}>
                 {Object.entries(role.permissoes).map(([key, value]) => {
                     if (!value) return null;
                     return (
                       <View key={key} style={styles.permTag}>
                          <Text style={styles.permText}>{PERMISSION_LABELS[key] || key}</Text>
                       </View>
                     );
                 })}
              </View>
           </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
         <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
               <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{editingRole ? 'Editar Perfil' : 'Novo Perfil'}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <SafeIcon name="close" size={24} color="#333" />
                  </TouchableOpacity>
               </View>
               
               <ScrollView style={styles.modalBody}>
                  <Text style={styles.label}>Nome do Perfil</Text>
                  <TextInput 
                    style={styles.input} 
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Ex: Gerente, Vendedor..."
                  />

                  <Text style={styles.label}>Descrição (Opcional)</Text>
                  <TextInput 
                    style={styles.input} 
                    value={descricao}
                    onChangeText={setDescricao}
                    placeholder="Descrição breve..."
                  />

                  <Text style={[styles.label, { marginTop: 16, marginBottom: 8 }]}>Permissões</Text>
                  {Object.keys(PERMISSION_LABELS).map((key) => (
                      <TouchableOpacity 
                        key={key} 
                        style={styles.switchRow}
                        onPress={() => togglePermission(key)}
                      >
                         <Text style={styles.switchLabel}>{PERMISSION_LABELS[key]}</Text>
                         <Switch 
                            value={permissoes[key]} 
                            onValueChange={() => togglePermission(key)}
                            trackColor={{ false: "#ccc", true: "#81D4FA" }}
                            thumbColor={permissoes[key] ? "#2196F3" : "#f4f3f4"}
                         />
                      </TouchableOpacity>
                  ))}
               </ScrollView>

               <TouchableOpacity style={styles.saveButton} onPress={handeSave}>
                  <Text style={styles.saveButtonText}>Salvar Perfil</Text>
               </TouchableOpacity>
            </View>
         </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  addButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    gap: 6
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  roleName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  roleDesc: { fontSize: 14, color: '#666', marginTop: 2 },
  actions: { flexDirection: 'row', gap: 12 },
  actionBtn: { padding: 4 },
  permsSummary: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  permTag: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  permText: { fontSize: 12, color: '#1565C0' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, maxHeight: '80%', padding: 0 },
  modalHeader: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#eee' },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalBody: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 16 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  switchLabel: { fontSize: 16, color: '#333' },
  saveButton: { backgroundColor: '#2196F3', padding: 16, alignItems: 'center', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
