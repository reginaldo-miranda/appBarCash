
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CashbackPromptModalProps {
  visible: boolean;
  balance: number;
  totalToPay: number;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  loading?: boolean;
}

export default function CashbackPromptModal({
  visible,
  balance,
  totalToPay,
  onClose,
  onConfirm,
  loading = false
}: CashbackPromptModalProps) {
  const [amount, setAmount] = useState('');
  const [useAll, setUseAll] = useState(true);

  // Calculate default suggestion (min of balance or total)
  const maxPossible = Math.min(balance, totalToPay);

  useEffect(() => {
    if (visible) {
        // Only set default if amount is empty or we want to force reset on open
        // Check if we already have a value to avoid overwriting during re-renders
        if (!amount || useAll) {
             setAmount(maxPossible.toFixed(2));
             setUseAll(true);
        }
    } else {
        setAmount('');
        setUseAll(true);
    }
  }, [visible, maxPossible]); // Added maxPossible dependency safely

  const handleConfirm = () => {
    // Robust parsing: replace comma with dot, remove non-numeric chars except dot/comma
    let normalized = amount.replace(',', '.');
    // Ensure only one dot (last one wins if multiple?) or strictly parse
    
    const val = parseFloat(normalized);
    
    if (isNaN(val) || val <= 0) {
      Alert.alert('Valor Inválido', 'Informe um valor maior que zero.');
      return;
    }
    
    // Strict 2 decimal check
    const valFixed = Number(val.toFixed(2));

    if (valFixed > balance) {
      Alert.alert('Saldo Insuficiente', `O valor não pode exceder o saldo de R$ ${balance.toFixed(2)}`);
      return;
    }
    // Tolerance slightly increased for float comparison
    if (valFixed > totalToPay + 0.05) { 
       Alert.alert('Valor Excedente', `O valor R$ ${valFixed} não pode ser maior que o total a pagar R$ ${totalToPay.toFixed(2)}.`);
       return;
    }

    onConfirm(valFixed);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleSkip}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Ionicons name="gift" size={32} color="#4CAF50" />
            <Text style={styles.title}>Cliente Fidelidade</Text>
          </View>

          <Text style={styles.message}>
            Este cliente possui <Text style={styles.bold}>R$ {balance.toFixed(2)}</Text> de Cashback disponível.
          </Text>
          <Text style={styles.subMessage}>Deseja abater este valor da venda?</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.currency}>R$</Text>
            <TextInput
              style={styles.input}
              value={amount}
              keyboardType="numeric"
              onChangeText={(t) => {
                setAmount(t); // Permitir digitar livremente, validar no submit
                setUseAll(false);
              }}
              selectTextOnFocus
            />
          </View>
          
          <Text style={styles.hint}>
             {useAll ? 'Usando saldo máximo' : 'Valor personalizado'}
             {'\n'}Máximo sugerido: R$ {maxPossible.toFixed(2)}
          </Text>

          <View style={styles.buttons}>
             <TouchableOpacity style={[styles.button, styles.skipButton]} onPress={handleSkip} disabled={loading}>
                 <Text style={styles.skipText}>Não, pular</Text>
             </TouchableOpacity>

             <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm} disabled={loading}>
                 {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmText}>Sim, Descontar</Text>}
             </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 9999 // Ensure it sits on top
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 10, // Higher elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 10000 // Higher than overlay
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 8
  },
  bold: {
    fontWeight: 'bold',
    color: '#2E7D32'
  },
  subMessage: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 20
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    width: '100%',
    marginBottom: 8,
    backgroundColor: '#f9f9f9'
  },
  currency: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold'
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 10,
    textAlign: 'center'
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 24
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%'
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  skipButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  skipText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16
  },
  confirmButton: {
    backgroundColor: '#4CAF50'
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
