# Bill Manager App - Quick Start Guide

## Installation & Setup (2 minutes)

### Step 1: Install Dependencies
```bash
cd myapp
npm install
```

### Step 2: Run the App

**For Android:**
```bash
expo start --android
```

**For iOS:**
```bash
expo start --ios
```

**For Web:**
```bash
expo start --web
```

## First Use - Complete Workflow (5 minutes)

### 1. Add Your First Bill
1. App opens to **Home Screen** 
2. Tap **"Add Bill"** button (blue)
3. Choose **"Camera"** or **"Gallery"**
4. Take/select photo of medicine bill
5. Enter amount (e.g., 500)
6. (Optional) Add description like "Paracetamol"
7. Tap **"Add Bill"** → Bill saved ✓

### 2. View Statistics
1. Home screen now shows:
   - This month's total amount
   - Number of bills
   - Bar chart of monthly trends
   - Last 12 months history
   - Quarterly & Annual breakdown

### 3. Browse All Bills
1. Tap **"View All Bills"** button (green)
2. See all dates with bill counts
3. Tap any date to expand
4. See individual bills with times
5. Tap a bill to view details

### 4. View Bill Details
1. See full-size bill image
2. Check amount, time, description
3. View all bills for that date
4. Tap to switch between bills
5. Delete if needed with confirmation

## Key Features Overview

### 🏠 Home Screen
- **Current Month Card**: Quick overview of spending
- **Bar Chart**: Visual expense trends
- **12-Month History**: Scroll down for details
- **Quick Actions**: Add bill or view all

### 📸 Upload Screen
- **Image Selection**: Camera or gallery
- **Amount Entry**: Required field
- **Description**: Optional notes
- **Live Preview**: See bill before saving

### 📋 Bills List Screen
- **Date Grouping**: All dates in one view
- **Expandable**: Click to show/hide bills
- **Daily Totals**: Sum and count per day
- **Pull-to-Refresh**: Swipe down to update

### 🔍 Bill Details Screen
- **Full Image**: Large, clear view
- **Metadata**: Amount, time, description
- **Multiple Bills**: Switch between bills
- **Delete**: Remove with confirmation

## Common Tasks

### Add a New Bill
```
Home → "Add Bill" → Take/Select Photo → Enter Amount → "Add Bill"
```

### Check Monthly Spending
```
Home → Scroll Down → See Monthly Stats
```

### Find a Specific Bill
```
"View All Bills" → Find Date → Expand → Tap Bill
```

### Delete a Bill
```
"View All Bills" → Expand Date → Tap Bill → "Delete This Bill"
```

### View Expense Trends
```
Home → See Bar Chart → Monthly breakdown below
```

## Tips & Tricks

✅ **Best Practices**
- Take clear photos of bills for better records
- Add descriptions for expensive purchases
- Check statistics regularly
- Backup important data

✅ **Quick Tips**
- Pull down to refresh bills list
- Dates show "Today" and "Yesterday" labels
- Bills are sorted newest first
- Charts update automatically

⚠️ **Helpful Notes**
- All data stored locally (no internet needed)
- Images are automatically compressed
- Bills cannot be edited, only deleted
- No data is sent to any server

## Date Format
- All dates displayed as: "Mon, Dec 12, 2024"
- Times shown in 12-hour format (e.g., 3:45 PM)
- Database stores in YYYY-MM-DD format

## File Structure Reference

```
App Root
├── Home (Statistics & Charts)
├── Add Bill (Upload & Form)
├── View All Bills (Grouped by Date)
└── Bill Details (Image & Delete)
```

## Keyboard Shortcuts (If Applicable)

- **Tab**: Navigate between fields
- **Enter**: Submit form
- **Esc**: Cancel operation

## Permissions Required

When first running, you'll be asked to grant:
- ✅ Camera access (to take photos)
- ✅ Photo gallery access (to select images)
- ✅ File storage access (to save bills)

Just tap "Allow" for each permission.

## Troubleshooting

### "Database Error" Message
- Close and reopen app
- If persists: Clear app cache and reinstall

### Camera Not Working
- Check if camera permission is granted
- Restart app
- Try gallery option instead

### Bill Not Saving
- Check if amount field is filled
- Ensure image is selected
- Check device storage space

### Navigation Issues
- Make sure you're on the correct screen
- Use back button instead of gesture
- Force close and reopen app

## Data Storage

- **Location**: App's private directory
- **Backup**: No automatic backup (use device backup)
- **Persistence**: Data survives app updates
- **Privacy**: All data stays on your device

## What's Stored

✅ **Stored Locally:**
- Bill amounts
- Bill dates & times
- Bill descriptions
- Bill images (compressed)
- All statistics

❌ **Never Sent:**
- Bills to the cloud
- Usage data
- Personal information
- Any data to servers

## Getting Help

If you encounter issues:

1. **Check**: Is the issue in "Troubleshooting" section above?
2. **Reset**: Force close app (Settings → Apps → Bill Manager → Force Stop)
3. **Reinstall**: Delete and reinstall app if issue persists
4. **Contact**: Report issues with app version number

## Version Info
- App Version: 1.0.0
- Built with: Expo, React Native
- Database: SQLite

## Keyboard & Input Tips

### Amount Field
- Supports decimal values (500.50)
- Only accepts numbers
- Required field (cannot be empty)

### Description Field
- Optional text input
- Supports multiple lines
- Max reasonable length: 500 chars

## Performance Notes

- App works offline
- No internet required
- Fast local database
- Compressed images save space
- Smooth animations & transitions

## Advanced: Reset App Data

To clear all bills (factory reset):

1. Go to device Settings
2. Find "Bill Manager App"
3. Select "Clear Data" / "Clear Storage"
4. Confirm

⚠️ **Warning**: This will delete all bills permanently!

## Next Steps

Once you're comfortable:
- Add multiple bills to see trends
- Check monthly trends in charts
- Export/backup important bills
- Set reminders for expensive purchases

Happy bill tracking! 💊💰
