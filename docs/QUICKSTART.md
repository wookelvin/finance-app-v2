# 🚀 Quick Start Guide

## Get Started in 60 Seconds

### 1. Start the Application
```bash
npm run dev
```
Visit `http://localhost:3000`

### 2. Create Your First Institution
- Click the **[+]** button in the "Institutions" sidebar
- Enter: `Name: Chase Bank`, `Code: CHASE`
- Click **Create**
- New institution appears in the list

### 3. Add a Transaction
- Click on "Chase Bank" in the sidebar
- Click **[+ Add Transaction]** button
- Fill in the inline form:
  - **Date**: Today's date
  - **Description**: "Grocery shopping"
  - **Vendor**: "Whole Foods"
  - **Category**: "Groceries"
  - **Amount**: "85.50"
- Click **Save**

### 4. Manage Transactions
- View all transactions in the table
- Click **trash icon** (🗑) to delete a transaction
- Click **[+ Add Transaction]** to add more

That's it! 🎉

---

## Keyboard Tips

| Action | Shortcut |
|--------|----------|
| Add Institution | Click [+] in sidebar |
| Add Transaction | Click [+ Add Transaction] |
| Delete Transaction | Click trash icon |
| Switch Institution | Click institution name |

---

## Features at a Glance

### Left Sidebar
- List of all institutions
- [+] button to create new
- Click to select and view transactions
- Sticky while scrolling

### Main Area
- Selected institution details
- Total transaction count
- Transaction table with all details
- Inline form for adding transactions
- Delete buttons for each transaction

### Data You Can Enter

**Institution**
- Name (e.g., "Chase Bank")
- Code (e.g., "CHASE")

**Transaction**
- Date (date picker)
- Description (what it was for)
- Vendor (where it was)
- Category (Groceries, Utilities, Entertainment, Transportation, Other)
- Amount (with decimals)
- Automatically marked as pending until confirmed

---

## Column Descriptions

| Column | Description | Format |
|--------|-------------|--------|
| Date | When transaction occurred | MM/DD/YYYY |
| Description | What the transaction was for | Text |
| Vendor | Company or store name | Text |
| Category | Type of expense | Badge |
| Amount | How much was spent | $0.00 USD |
| Confirmed | Has it been verified? | ✓ or ✗ |
| Actions | Delete transaction | 🗑 icon |

---

## Categories Available

✓ Groceries
✓ Utilities
✓ Entertainment
✓ Transportation
✓ Other

---

## Troubleshooting

**App won't start?**
- Run `npm install` first
- Check that port 3000 is available
- Run `npm run dev` again

**Can't create institution?**
- Make sure both name and code are filled in
- Code must be unique (can't duplicate)

**Transaction not saving?**
- All fields are required
- Amount must be a number
- Check browser console for errors

**Database issues?**
- Run `npm run db` to migrate
- Run `npm run db:studio` to view database

---

## Tips & Tricks

💡 **Date Shortcuts**
- Click the date field to get a calendar picker
- Defaults to today's date

💡 **Cancel Anytime**
- Started adding a transaction? Click [Cancel]
- Form closes and nothing is saved

💡 **Quick Delete**
- Hover over any transaction
- Click the trash icon on the right

💡 **Dark Mode**
- Your system theme is auto-detected
- All UI supports dark mode

💡 **Mobile Friendly**
- Layout adjusts for mobile screens
- Sidebar becomes full width
- All features still accessible

---

## Next Steps

Once you're comfortable, explore:

1. **Create multiple institutions** to organize by bank
2. **Add lots of transactions** to see the table in action
3. **Try different categories** to organize expenses
4. **Test on mobile** to see responsive design
5. **Read FEATURES.md** for complete API documentation

---

## Need Help?

📖 **Documentation**
- `FEATURES.md` - Full feature guide
- `IMPLEMENTATION.md` - Technical details
- `COMPONENT_GUIDE.md` - UI component breakdown

🔍 **Debug**
- Check browser console (F12) for errors
- Check terminal for server errors
- View database with `npm run db:studio`

---

**Enjoy using Finance Manager!** 💰
