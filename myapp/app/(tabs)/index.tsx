import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { BarChart } from 'react-native-chart-kit';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  getCurrentMonthStats,
  getMonthlyStats,
  getQuarterlyStats,
  getAnnualStats,
  getChartData,
} from '@/utils/database';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [quarterlyStats, setQuarterlyStats] = useState<any[]>([]);
  const [annualStats, setAnnualStats] = useState<any[]>([]);
  const [currentMonthStats, setCurrentMonthStats] = useState<any>(null);

  const isDark = colorScheme === 'dark';
  const colors = {
    text: isDark ? '#FFFFFF' : '#000000',
    background: isDark ? '#1a1a1a' : '#FFFFFF',
    card: isDark ? '#2a2a2a' : '#F5F5F5',
    primary: '#007AFF',
    success: '#34C759',
    danger: '#FF3B30',
  };

  const loadData = async () => {
    try {
      const [monthlyData, monthly, quarterly, annual, currentMonth] = await Promise.all([
        getChartData(),
        getMonthlyStats(),
        getQuarterlyStats(),
        getAnnualStats(),
        getCurrentMonthStats(),
      ]);

      setMonthlyData(monthlyData);
      setMonthlyStats(monthly || []);
      setQuarterlyStats(quarterly || []);
      setAnnualStats(annual || []);
      setCurrentMonthStats(currentMonth);
    } catch (error) {
      console.error('Error loading home data:', error);
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

  const prepareChartData = () => {
    if (!monthlyData || monthlyData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            data: [0],
          },
        ],
      };
    }

    return {
      labels: monthlyData.map((item: any) => item.month),
      datasets: [
        {
          data: monthlyData.map((item: any) => parseFloat(item.total) || 0),
        },
      ],
    };
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const chartData = prepareChartData();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Bill Manager</Text>
      </View>

      {/* Current Month Summary */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>This Month</Text>
        <Text style={[styles.amount, { color: colors.success }]}>
          ₹{currentMonthStats?.total?.toFixed(2) || '0.00'}
        </Text>
        <Text style={[styles.label, { color: colors.text }]}>
          {currentMonthStats?.billCount || 0} bills
        </Text>
      </View>

      {/* Monthly Report */}
      {monthlyStats.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Last 12 Months</Text>
          {monthlyStats.slice(0, 6).map((stat: any, index: number) => (
            <View key={index} style={styles.statRow}>
              <Text style={[styles.statLabel, { color: colors.text }]}>{stat.month}</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                ₹{parseFloat(stat.total).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Chart */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Monthly Expense Chart</Text>
        <BarChart
          data={chartData}
          width={screenWidth - 40}
          height={300}
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            color: () => colors.primary,
            labelColor: () => colors.text,
            barPercentage: 0.7,
            strokeWidth: 2,
            propsForLabels: {
              fontSize: 12,
            },
          }}
          yAxisLabel="₹"
          yAxisSuffix=""
          style={styles.chart}
        />
      </View>

      {/* Quarterly Report */}
      {quarterlyStats.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>This Year by Quarter</Text>
          {quarterlyStats.map((stat: any, index: number) => (
            <View key={index} style={styles.statRow}>
              <Text style={[styles.statLabel, { color: colors.text }]}>
                {stat.year} - {stat.quarter}
              </Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                ₹{parseFloat(stat.total).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Annual Report */}
      {annualStats.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Annual Summary</Text>
          {annualStats.map((stat: any, index: number) => (
            <View key={index} style={styles.statRow}>
              <Text style={[styles.statLabel, { color: colors.text }]}>{stat.year}</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                ₹{parseFloat(stat.total).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/upload')}
        >
          <Text style={styles.buttonText}>Add Bill</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.success }]}
          onPress={() => router.push('/bills-list')}
        >
          <Text style={styles.buttonText}>View All Bills</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  chart: {
    marginVertical: 12,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
