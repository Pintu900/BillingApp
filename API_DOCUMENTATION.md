# Bill Manager App - API & Component Documentation

## Database API Reference

### Types

```typescript
interface Bill {
  id?: number;
  date: string;              // YYYY-MM-DD format
  amount: number;            // INR amount
  imagePath: string;         // File system path to image
  timestamp: string;         // ISO 8601 timestamp
  description?: string;      // Optional notes
}

interface DailyBillGroup {
  date: string;
  bills: Bill[];
  totalAmount: number;
}

interface MonthlyStats {
  month: string;             // e.g., "2024-12"
  total: number;
  billCount: number;
}
```

### Core Functions

#### `initDatabase(): Promise<void>`
Initialize SQLite database and create tables.
```typescript
// Must be called in app startup
useEffect(() => {
  initDatabase().catch(console.error);
}, []);
```

#### `addBill(bill: Bill): Promise<number>`
Add a new bill to the database.
```typescript
const billId = await addBill({
  date: '2024-12-12',
  amount: 500,
  imagePath: '/path/to/image.jpg',
  timestamp: new Date().toISOString(),
  description: 'Medicine for cold'
});
```

#### `getBillsByDate(date: string): Promise<Bill[]>`
Fetch all bills for a specific date.
```typescript
const bills = await getBillsByDate('2024-12-12');
// Returns bills sorted by timestamp descending
```

#### `getAllBillsGroupedByDate(): Promise<DailyBillGroup[]>`
Get all bills organized by date with totals.
```typescript
const groupedBills = await getAllBillsGroupedByDate();
// Returns: [
//   {
//     date: '2024-12-12',
//     bills: [...],
//     totalAmount: 1500
//   },
//   ...
// ]
```

#### `getMonthlyStats(): Promise<MonthlyStats[]>`
Get monthly expense statistics for last 12 months.
```typescript
const stats = await getMonthlyStats();
// Returns monthly totals in descending order
```

#### `getQuarterlyStats(): Promise<any[]>`
Get quarterly breakdown for current year.
```typescript
const quarterly = await getQuarterlyStats();
// Returns: [
//   { year: "2024", quarter: "Q4", total: 5000, billCount: 10 },
//   ...
// ]
```

#### `getAnnualStats(): Promise<any[]>`
Get annual statistics for last 3 years.
```typescript
const annual = await getAnnualStats();
// Returns yearly totals
```

#### `getCurrentMonthStats(): Promise<{total: number, billCount: number}>`
Get current month's total and bill count.
```typescript
const current = await getCurrentMonthStats();
// Returns: { total: 3500, billCount: 7 }
```

#### `getChartData(): Promise<any[]>`
Get monthly data for chart visualization.
```typescript
const chartData = await getChartData();
// Returns: [
//   { month: "Jan", monthNum: "01", total: 2000 },
//   { month: "Feb", monthNum: "02", total: 2500 },
//   ...
// ]
```

#### `deleteBill(id: number): Promise<boolean>`
Delete a bill and its associated image.
```typescript
const success = await deleteBill(billId);
// Also deletes the image file from storage
```

#### `getAllBills(): Promise<Bill[]>`
Get all bills (ordered by timestamp descending).
```typescript
const allBills = await getAllBills();
```

---

## Image Processing API Reference

### Types

```typescript
interface ImageCompressionOptions {
  quality?: number;     // 0-1, default 0.6
  width?: number;       // default 800
  height?: number;      // default 800
  format?: 'jpeg' | 'png'; // default 'jpeg'
}
```

### Functions

#### `saveBillImage(imageUri: string): Promise<string>`
Save and compress image from device storage.
```typescript
const savedPath = await saveBillImage('file:///path/to/photo.jpg');
// Returns saved image URI for database storage
```

#### `compressImage(imageUri: string, options?: ImageCompressionOptions): Promise<string>`
Compress image with custom options.
```typescript
const compressedPath = await compressImage(imageUri, {
  quality: 0.5,
  width: 600,
  height: 600,
  format: 'jpeg'
});
```

#### `deleteImage(imagePath: string): Promise<boolean>`
Delete image file from storage.
```typescript
const deleted = await deleteImage(imagePath);
```

#### `getImageSize(imagePath: string): Promise<number>`
Get image file size in bytes.
```typescript
const sizeInBytes = await getImageSize(imagePath);
const sizeInMB = sizeInBytes / (1024 * 1024);
```

---

## Screen Components

### Home Screen (`app/(tabs)/index.tsx`)
**Features:**
- Dashboard with statistics
- Bar chart of monthly expenses
- Monthly/quarterly/annual reports
- Quick action buttons

**Props:** None (uses context/hooks)

**Key States:**
- `loading`: Loading state
- `currentMonthStats`: Current month totals
- `monthlyData`: Array of monthly statistics
- `chartData`: Prepared chart data

**Key Functions:**
- `loadData()`: Fetch all statistics
- `onRefresh()`: Refresh pull-to-refresh

### Upload Screen (`app/upload.tsx`)
**Features:**
- Image picker (camera & gallery)
- Bill amount input
- Optional description field
- Form validation

**Navigation Params:** None

**Key States:**
- `selectedImage`: URI of selected image
- `amount`: Bill amount
- `description`: Optional notes
- `loading`: Submit state

**Key Functions:**
- `pickImage()`: Open gallery
- `takePhoto()`: Open camera
- `validateForm()`: Validate inputs
- `handleSubmit()`: Save bill to database

### Bills List Screen (`app/bills-list.tsx`)
**Features:**
- Bills grouped by date
- Expandable date sections
- Daily totals
- Pull-to-refresh

**Navigation Params:** None

**Key States:**
- `billsData`: Grouped bills by date
- `expandedDates`: Set of expanded dates
- `loading`: Loading state

**Key Functions:**
- `loadData()`: Fetch all bills
- `toggleExpandDate(date)`: Expand/collapse date
- `formatDate(dateString)`: Format date string

### Bill Details Screen (`app/bill-details.tsx`)
**Features:**
- Display bill image
- Show bill details (amount, time)
- Delete functionality
- View multiple bills for same date

**Navigation Params:**
```typescript
{
  date: string // YYYY-MM-DD format
}
```

**Key States:**
- `bills`: Array of bills for the date
- `selectedBillId`: Currently viewed bill
- `totalAmount`: Sum of all bills for date
- `loading`: Loading state

**Key Functions:**
- `loadBills()`: Fetch bills for date
- `handleDeleteBill(id)`: Delete with confirmation

---

## Custom Hooks

### `useColorScheme(): 'light' | 'dark'`
Get current color scheme preference.

**Usage:**
```typescript
const colorScheme = useColorScheme();
const isDark = colorScheme === 'dark';
```

---

## Navigation Structure

```
RootLayout (_layout.tsx)
├── (tabs)
│   ├── index (Home/Dashboard)
│   └── explore
├── upload (Modal)
├── bills-list
└── bill-details
```

### Route Parameters

**bill-details Route:**
```typescript
router.push({
  pathname: '/bill-details',
  params: { date: '2024-12-12' }
});
```

**upload Route:**
```typescript
router.push('/upload');
```

**bills-list Route:**
```typescript
router.push('/bills-list');
```

---

## Best Practices

### Database Operations
1. Always handle errors with try-catch
2. Initialize database on app startup
3. Use batch queries for multiple operations
4. Cache results when possible

### Image Handling
1. Always delete old images when bills are updated
2. Compress images before saving
3. Use appropriate file paths (cache directory)
4. Handle missing files gracefully

### State Management
1. Use loading states during async operations
2. Refresh data when screens come into focus
3. Use useFocusEffect for screen refresh
4. Validate data before displaying

### Performance
1. Avoid inline function definitions
2. Use memo for expensive components
3. Optimize queries with proper filtering
4. Limit data fetches per screen load

---

## Error Handling

### Database Errors
```typescript
try {
  await addBill(bill);
} catch (error) {
  console.error('Error adding bill:', error);
  Alert.alert('Error', 'Failed to save bill');
}
```

### Image Errors
```typescript
try {
  const uri = await saveBillImage(imageUri);
} catch (error) {
  Alert.alert('Error', 'Failed to process image');
}
```

---

## Testing Queries

### Test Data
```typescript
// Add test bill
await addBill({
  date: new Date().toISOString().split('T')[0],
  amount: 500,
  imagePath: 'file:///test.jpg',
  timestamp: new Date().toISOString(),
  description: 'Test bill'
});

// Fetch all bills
const all = await getAllBills();
console.log('Total bills:', all.length);

// Get stats
const current = await getCurrentMonthStats();
console.log('Current month:', current);
```

---

## Configuration

### Image Compression Settings
Edit `utils/imageProcessor.ts`:
```typescript
const DEFAULT_COMPRESSION_OPTIONS = {
  quality: 0.6,  // 0-1 scale
  width: 800,    // pixels
  height: 800,   // pixels
  format: 'jpeg' // 'jpeg' or 'png'
};
```

### Database Location
Automatically stored in app's SQLite directory. No configuration needed.

---

## Common Issues & Solutions

### Database locked error
- Ensure database is initialized before use
- Don't perform concurrent writes

### Image not saving
- Check file system permissions
- Verify document directory exists
- Check available storage space

### Navigation not working
- Verify route names match exactly
- Check parameter passing syntax
- Ensure screens are registered in layout

### Chart not rendering
- Verify data structure matches expected format
- Ensure yAxisSuffix prop is provided
- Check screen width calculation
