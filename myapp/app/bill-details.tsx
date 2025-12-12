import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Bill } from '@/utils/database';
import { getBillsByDate, deleteBill } from '@/utils/database';
import { MaterialIcons } from '@expo/vector-icons';

export default function BillDetailsScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState<Bill[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedBillId, setSelectedBillId] = useState<number | null>(null);

  const isDark = colorScheme === 'dark';
  const colors = {
    text: isDark ? '#FFFFFF' : '#000000',
    background: isDark ? '#1a1a1a' : '#FFFFFF',
    card: isDark ? '#2a2a2a' : '#F5F5F5',
    primary: '#007AFF',
    success: '#34C759',
    danger: '#FF3B30',
    border: isDark ? '#404040' : '#E0E0E0',
  };

  const date = params.date as string;

  const loadBills = useCallback(async () => {
    try {
      if (!date) return;
      const billsData = await getBillsByDate(date);
      setBills(billsData as Bill[]);

      const total = billsData.reduce((sum: number, bill: Bill) => sum + bill.amount, 0);
      setTotalAmount(total);
    } catch (error) {
      console.error('Error loading bills:', error);
      Alert.alert('Error', 'Failed to load bills');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    loadBills();
  }, [loadBills]);

  const handleDeleteBill = (billId: number) => {
    Alert.alert('Delete Bill', 'Are you sure you want to delete this bill?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await deleteBill(billId);
            await loadBills();
            if (selectedBillId === billId) {
              setSelectedBillId(null);
            }
            Alert.alert('Success', 'Bill deleted successfully');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete bill');
            console.error('Error deleting bill:', error);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const selectedBill = bills.find((b: Bill) => b.id === selectedBillId) || bills[0];

  if (!selectedBill) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerDate, { color: colors.text }]}>No bills found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerDate, { color: colors.text }]}>
            {formatDate(date)}
          </Text>
          <Text style={[styles.headerTotal, { color: colors.success }]}>
            Total: ₹{totalAmount.toFixed(2)}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Main Image */}
        {selectedBill && (
          <View style={[styles.imageSection, { backgroundColor: colors.card }]}>
            <Image
              source={{ uri: selectedBill.imagePath }}
              style={styles.mainImage}
              resizeMode="contain"
            />
            <View style={styles.billInfo}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.text }]}>Amount:</Text>
                <Text style={[styles.infoValue, { color: colors.primary }]}>
                  ₹{selectedBill.amount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.text }]}>Time:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {new Date(selectedBill.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </Text>
              </View>
              {selectedBill.description && (
                <View style={styles.descriptionSection}>
                  <Text style={[styles.descriptionLabel, { color: colors.text }]}>
                    Description:
                  </Text>
                  <Text style={[styles.descriptionText, { color: colors.text }]}>
                    {selectedBill.description}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: colors.danger }]}
                onPress={() => handleDeleteBill(selectedBill.id)}
              >
                <MaterialIcons name="delete" size={20} color="#FFFFFF" />
                <Text style={styles.deleteButtonText}>Delete This Bill</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* All Bills List */}
        {bills.length > 1 && (
          <View style={[styles.billsList, { backgroundColor: colors.card }]}>
            <Text style={[styles.listTitle, { color: colors.text }]}>
              All Bills ({bills.length})
            </Text>
            <FlatList
              data={bills}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.billListItem,
                    { borderBottomColor: colors.border },
                    index !== bills.length - 1 && { borderBottomWidth: 1 },
                    selectedBill.id === item.id && { backgroundColor: colors.primary + '20' },
                  ]}
                  onPress={() => setSelectedBillId(item.id as number)}
                  activeOpacity={0.7}
                >
                  <View style={styles.billListContent}>
                    <Text style={[styles.billListTime, { color: colors.text }]}>
                      {new Date(item.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                    <Text style={[styles.billListAmount, { color: colors.primary }]}>
                      ₹{item.amount.toFixed(2)}
                    </Text>
                  </View>
                  {selectedBill.id === item.id && (
                    <MaterialIcons name="check-circle" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              keyExtractor={(item) => (item.id as number).toString()}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 8,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerDate: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  headerTotal: {
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  imageSection: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  billInfo: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionSection: {
    marginTop: 8,
    marginBottom: 12,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  billsList: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  billListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  billListContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  billListTime: {
    fontSize: 12,
    opacity: 0.6,
    minWidth: 50,
  },
  billListAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
});
