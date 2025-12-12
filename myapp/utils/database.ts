// In-memory database implementation for bills
// Stores bills in an array for the app lifecycle (no persistent storage)

import { File } from 'expo-file-system';

export interface Bill {
  id: number;
  date: string; // YYYY-MM-DD
  amount: number;
  imagePath: string;
  timestamp: string; // ISO
  description?: string;
}

export type NewBill = Omit<Bill, 'id'>;

export interface DailyBillGroup {
  date: string;
  bills: Bill[];
  totalAmount: number;
}

export interface MonthlyStats {
  month: string;
  total: number;
  billCount: number;
}

let inMemoryDb: Bill[] = [];
let nextId = 1;

export const initDatabase = async () => {
  // no-op for in-memory store; keep function for compatibility
  inMemoryDb = inMemoryDb || [];
  nextId = Math.max(1, (inMemoryDb.reduce((m, b) => Math.max(m, b.id), 0) || 0) + 1);
  return Promise.resolve();
};

export const addBill = async (bill: NewBill): Promise<number> => {
  const id = nextId++;
  const newBill: Bill = { id, ...bill } as Bill;
  inMemoryDb.push(newBill);
  return Promise.resolve(id);
};

export const getBillsByDate = async (date: string): Promise<Bill[]> => {
  const result = inMemoryDb
    .filter((b) => b.date === date)
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  return Promise.resolve(result);
};

export const getAllBillsGroupedByDate = async (): Promise<DailyBillGroup[]> => {
  const groupsMap: Record<string, Bill[]> = {};
  for (const b of inMemoryDb) {
    groupsMap[b.date] = groupsMap[b.date] || [];
    groupsMap[b.date].push(b);
  }

  const groups: DailyBillGroup[] = Object.keys(groupsMap)
    .sort((a, b) => (a < b ? 1 : -1))
    .map((date) => {
      const bills = groupsMap[date].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
      return { date, bills, totalAmount: bills.reduce((s, x) => s + x.amount, 0) };
    });

  return Promise.resolve(groups);
};

export const getMonthlyStats = async (): Promise<MonthlyStats[]> => {
  const now = new Date();
  const months: Record<string, { total: number; billCount: number }> = {};

  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months[key] = { total: 0, billCount: 0 };
  }

  for (const b of inMemoryDb) {
    const dt = new Date(b.date + 'T00:00:00');
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
    if (months[key]) {
      months[key].total += b.amount;
      months[key].billCount += 1;
    }
  }

  const result = Object.keys(months)
    .sort((a, b) => (a < b ? 1 : -1))
    .map((month) => ({ month, total: months[month].total, billCount: months[month].billCount }));

  return Promise.resolve(result);
};

export const getQuarterlyStats = async (): Promise<any> => {
  const year = new Date().getFullYear();
  const quarters: Record<string, { total: number; billCount: number }> = {};

  for (const b of inMemoryDb) {
    const dt = new Date(b.date + 'T00:00:00');
    if (dt.getFullYear() !== year) continue;
    const m = dt.getMonth() + 1;
    const q = m <= 3 ? 'Q1' : m <= 6 ? 'Q2' : m <= 9 ? 'Q3' : 'Q4';
    const key = `${year}-${q}`;
    quarters[key] = quarters[key] || { total: 0, billCount: 0 };
    quarters[key].total += b.amount;
    quarters[key].billCount += 1;
  }

  const result = Object.keys(quarters)
    .sort((a, b) => (a < b ? 1 : -1))
    .map((k) => {
      const parts = k.split('-');
      return { year: parts[0], quarter: parts[1], total: quarters[k].total, billCount: quarters[k].billCount };
    });

  return Promise.resolve(result);
};

export const getAnnualStats = async (): Promise<any> => {
  const years: Record<string, { total: number; billCount: number }> = {};
  for (const b of inMemoryDb) {
    const dt = new Date(b.date + 'T00:00:00');
    const key = `${dt.getFullYear()}`;
    years[key] = years[key] || { total: 0, billCount: 0 };
    years[key].total += b.amount;
    years[key].billCount += 1;
  }

  const result = Object.keys(years)
    .sort((a, b) => (a < b ? 1 : -1))
    .slice(0, 3)
    .map((y) => ({ year: y, total: years[y].total, billCount: years[y].billCount }));

  return Promise.resolve(result);
};

export const getCurrentMonthStats = async (): Promise<{ total: number; billCount: number }> => {
  const now = new Date();
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  let total = 0;
  let billCount = 0;
  for (const b of inMemoryDb) {
    const dt = new Date(b.date + 'T00:00:00');
    const k = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
    if (k === key) {
      total += b.amount;
      billCount += 1;
    }
  }
  return Promise.resolve({ total, billCount });
};

export const deleteBill = async (id: number): Promise<boolean> => {
  const idx = inMemoryDb.findIndex((b) => b.id === id);
  if (idx === -1) return Promise.resolve(false);
  const bill = inMemoryDb[idx];
  inMemoryDb.splice(idx, 1);

  if (bill.imagePath) {
    try {
      const file = new File(bill.imagePath);
      await file.delete();
    } catch (e) {
      // ignore file delete errors in memory mode
    }
  }

  return Promise.resolve(true);
};

export const getAllBills = async (): Promise<Bill[]> => {
  const result = [...inMemoryDb].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  return Promise.resolve(result);
};

export const getChartData = async () => {
  const now = new Date();
  const monthsMap: Record<string, number> = {};
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), i, 1);
    const key = d.toLocaleString('en-US', { month: 'short' });
    monthsMap[key] = 0;
  }

  for (const b of inMemoryDb) {
    const dt = new Date(b.date + 'T00:00:00');
    if (dt.getFullYear() !== now.getFullYear()) continue;
    const key = dt.toLocaleString('en-US', { month: 'short' });
    monthsMap[key] = (monthsMap[key] || 0) + b.amount;
  }

  const result = Object.keys(monthsMap).map((m) => ({ month: m, total: monthsMap[m] }));
  return Promise.resolve(result);
};

export const clearAllData = async (): Promise<void> => {
  inMemoryDb = [];
  nextId = 1;
  return Promise.resolve();
};

