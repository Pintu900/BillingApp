import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getAllBillsGroupedByDate } from '@/utils/database';
import { MaterialIcons } from '@expo/vector-icons';

interface DailyBillGroup {
  date: string;
  bills: any[];
  totalAmount: number;
}

export default function BillsListScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [billsData, setBillsData] = useState<DailyBillGroup[]>([]);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

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

  const loadData = async () => {
    try {
      const data = await getAllBillsGroupedByDate();
      setBillsData(data);
    } catch (error) {
      console.error('Error loading bills:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const toggleExpandDate = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderDateGroup = (group: DailyBillGroup) => {
    const isExpanded = expandedDates.has(group.date);

    return (
      <View key={group.date}>
        {/* Date Header */}
        <TouchableOpacity
          style={[styles.dateHeader, { backgroundColor: colors.card }]}
          onPress={() => toggleExpandDate(group.date)}
          activeOpacity={0.7}
        >
          <View style={styles.dateInfo}>
            <Text style={[styles.dateText, { color: colors.text }]}>
              {formatDate(group.date)}
            </Text>
            <Text style={[styles.billCountText, { color: colors.text }]}>
              {group.bills.length} bill{group.bills.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <View style={styles.dateAmount}>
            <Text style={[styles.totalAmountText, { color: colors.success }]}>
              ₹{group.totalAmount.toFixed(2)}
            </Text>
          </View>

          <MaterialIcons
            name={isExpanded ? 'expand-less' : 'expand-more'}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>

        {/* Expanded Bills List */}
        {isExpanded && (
          <View style={[styles.billsList, { backgroundColor: colors.background }]}>
            {group.bills.map((bill, index) => (
              <TouchableOpacity
                key={bill.id}
                style={[
                  styles.billItem,
                  { backgroundColor: colors.card, borderBottomColor: colors.border },
                  index !== group.bills.length - 1 && { borderBottomWidth: 1 },
                ]}
                onPress={() =>
                  router.push({
                    pathname: '/bill-details',
                    params: { date: group.date },
                  })
                }
                activeOpacity={0.7}
              >
                <View style={styles.billContent}>
                  <Text style={[styles.billAmountText, { color: colors.primary }]}>
                    ₹{bill.amount.toFixed(2)}
                  </Text>
                  <Text style={[styles.billTimeText, { color: colors.text }]}>
                    {new Date(bill.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                  {bill.description && (
                    <Text style={[styles.billDescriptionText, { color: colors.text }]}>
                      {bill.description}
                    </Text>
                  )}
                </View>

                <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>All Bills</Text>
      </View>

      {billsData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="receipt-long" size={64} color={colors.primary} opacity={0.5} />
          <Text style={[styles.emptyText, { color: colors.text }]}>No bills yet</Text>
          <Text style={[styles.emptySubText, { color: colors.text }]}>
            Add your first bill to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={billsData}
          renderItem={({ item }) => renderDateGroup(item)}
          keyExtractor={(item) => item.date}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  dateInfo: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  billCountText: {
    fontSize: 12,
    opacity: 0.6,
  },
  dateAmount: {
    marginRight: 12,
  },
  totalAmountText: {
    fontSize: 14,
    fontWeight: '700',
  },
  billsList: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  billItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  billContent: {
    flex: 1,
  },
  billAmountText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  billTimeText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  billDescriptionText: {
    fontSize: 12,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 8,
  },
});
