# Bill Manager App - Complete Implementation

A comprehensive React Native/Expo app for managing daily medicine bill expenses with image capture, database storage, and analytics.

## Features Implemented

### 1. **Home Screen (Dashboard)**
- **Monthly/Quarterly/Annual Reports**: View expense summaries for different time periods
- **Current Month Statistics**: Display total spending and bill count for the current month
- **Bar Chart Visualization**: Interactive bar chart showing monthly expense trends
- **Quick Action Buttons**: "Add Bill" and "View All Bills" buttons for easy navigation
- **Pull-to-Refresh**: Update statistics with a single swipe

### 2. **Bill Upload Screen**
- **Image Selection**: Pick images from gallery or capture using device camera
- **Real-time Preview**: Display selected bill image before saving
- **Bill Amount Input**: Enter the bill amount with currency symbol (₹)
- **Optional Description**: Add notes about the bill
- **Form Validation**: Ensure all required fields are filled before submission
- **Loading State**: Visual feedback during bill processing
- **Auto Navigation**: Return to home screen after successful submission

### 3. **Bills List Screen**
- **Date Grouping**: Bills organized by date in descending order
- **Expandable Dates**: Click to expand/collapse bill details for each date
- **Daily Summaries**: View total amount and bill count per day
- **Bill Preview**: See individual bill amounts and timestamps
- **Quick Access**: Tap any bill entry to view full details
- **Empty State**: Helpful message when no bills exist

### 4. **Bill Details Screen**
- **Full Image Display**: View complete bill image with proper scaling
- **Bill Information**: Display amount, timestamp, and description
- **Multiple Bills per Date**: Browse all bills for a selected date
- **Delete Functionality**: Remove individual bills with confirmation
- **Bill Selection**: Tap to switch between bills for the same date
- **Navigation**: Back button to return to bills list

### 5. **Database (SQLite)**
- **Persistent Storage**: SQLite database for bill records
- **Schema**:
  - Bills table with date, amount, image path, timestamp, description
  - Support for image associations
- **Query Functions**:
  - Add new bills
  - Fetch bills by date or get all bills
  - Calculate monthly, quarterly, and annual statistics
  - Delete bills with image cleanup
  - Generate chart data for visualizations

### 6. **Image Processing**
- **Image Compression**: Reduce image file size for storage efficiency
- **Quality Optimization**: Compress to 0.6 quality (configurable)
- **File Management**: Store in app cache directory
- **Delete Support**: Clean up image files when bills are deleted

## Technology Stack

### Dependencies
- **expo**: v54.0.29 - React Native framework
- **expo-sqlite**: SQLite database support
- **expo-image-picker**: Camera and gallery access
- **expo-file-system**: File management operations
- **react-native-chart-kit**: Bar chart visualization
- **react-native-svg**: SVG rendering for charts
- **expo-router**: Navigation and routing
- **@react-navigation**: Navigation infrastructure

### Development
- **TypeScript**: Type-safe development
- **React 19.1**: Latest React version
- **React Native 0.81.5**: Latest React Native

## Project Structure

```
myapp/
├── app/
│   ├── _layout.tsx           # Root layout with DB initialization
│   ├── upload.tsx            # Bill upload screen
│   ├── bills-list.tsx        # Bills list with date grouping
│   ├── bill-details.tsx      # Detailed bill view
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Tab navigation
│   │   └── index.tsx         # Home/Dashboard screen
│   └── ...
├── utils/
│   ├── database.ts           # SQLite database utilities
│   └── imageProcessor.ts     # Image handling & compression
├── components/               # Reusable components
├── hooks/                    # Custom React hooks
├── constants/                # App constants
└── assets/                   # Images and resources
```

## Setup & Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Expo CLI installed globally

### Installation Steps

```bash
# Navigate to app directory
cd myapp

# Install dependencies
npm install

# For Android development
expo start --android

# For iOS development
expo start --ios

# For Web
expo start --web
```

## Database Schema

### Bills Table
```sql
CREATE TABLE bills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,           -- YYYY-MM-DD format
  amount REAL NOT NULL,         -- Bill amount in INR
  imagePath TEXT NOT NULL,      -- Path to stored image
  timestamp TEXT NOT NULL,      -- ISO 8601 timestamp
  description TEXT,             -- Optional notes
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bill_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bill_id INTEGER NOT NULL,
  imagePath TEXT NOT NULL,
  FOREIGN KEY(bill_id) REFERENCES bills(id) ON DELETE CASCADE
);
```

## Key Functions

### Database Utilities (`utils/database.ts`)
- `initDatabase()` - Initialize SQLite connection
- `addBill(bill)` - Add new bill record
- `getBillsByDate(date)` - Fetch bills for specific date
- `getAllBillsGroupedByDate()` - Get bills organized by date
- `getMonthlyStats()` - Monthly expense statistics
- `getQuarterlyStats()` - Quarterly breakdown
- `getAnnualStats()` - Annual summary
- `deleteBill(id)` - Remove bill and associated image
- `getChartData()` - Data for monthly expense chart

### Image Processor (`utils/imageProcessor.ts`)
- `saveBillImage(uri)` - Save and compress image
- `compressImage(uri, options)` - Compress with custom options
- `deleteImage(path)` - Delete image file
- `getImageSize(path)` - Get file size

## Navigation Flow

```
Home (Dashboard)
├── Add Bill → Upload → (Home)
└── View All Bills → Bills List
                     └── Select Date → Bill Details
                                      ├── View/Delete
                                      └── (Bills List)
```

## User Workflows

### 1. Adding a New Bill
1. Tap "Add Bill" on home screen
2. Take photo or select from gallery
3. Enter bill amount (required)
4. Optionally add description
5. Tap "Add Bill" to save
6. App returns to home with updated statistics

### 2. Viewing Bill Statistics
1. Home screen shows current month total
2. Scroll down for 12-month history
3. View bar chart for monthly trends
4. See quarterly and annual breakdowns

### 3. Viewing Past Bills
1. Tap "View All Bills"
2. See all dates with bill count and totals
3. Tap a date to expand
4. Tap a bill to see full details
5. View all bill images for that date
6. Delete bills as needed

## Permissions Required

### Android
- `android.permission.CAMERA` - Camera access for bill photos
- `android.permission.READ_EXTERNAL_STORAGE` - Read gallery images
- `android.permission.WRITE_EXTERNAL_STORAGE` - Save images

### iOS
- Camera access
- Photo library access

## Data Persistence

- All bills are stored locally in SQLite database
- Images are compressed and cached in app directory
- Database persists across app sessions
- No internet connection required

## Performance Considerations

- Images compressed to reduce storage space
- Batch queries for statistics
- Efficient date-based grouping
- Minimal re-renders with React hooks

## Future Enhancements

- [ ] Monthly/yearly export (PDF/CSV)
- [ ] Backup/restore functionality
- [ ] Cloud sync support
- [ ] Bill category classification
- [ ] Receipt OCR for amount extraction
- [ ] Recurring bill templates
- [ ] Sharing capabilities
- [ ] Multiple users/profiles
- [ ] Dark mode optimization
- [ ] Offline-first sync

## Troubleshooting

### Database Errors
- Clear app cache and reinstall if database is corrupted
- Check file permissions on device

### Image Issues
- Ensure camera permissions are granted
- Check available device storage
- Reduce image quality if size is an issue

### Navigation Issues
- Ensure all route names match in navigation and screen definitions
- Verify navigation parameters are properly passed

## License

MIT License - Feel free to modify and distribute

## Support

For issues or questions, refer to the code comments and official documentation:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [SQLite](https://www.sqlite.org/docs.html)
