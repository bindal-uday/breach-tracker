# 🛡️ Breach Tracker Pro

A comprehensive, client-side security breach monitoring and tracking application designed for cybersecurity professionals and security-conscious individuals.

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Security](https://img.shields.io/badge/security-client--side-brightgreen.svg)

## 🎯 Overview

**Breach Tracker Pro** is a modern, minimalist web application that helps security professionals track and monitor potential security breaches across multiple domains and applications. Built with privacy and security in mind, all data is stored locally in your browser with no server-side dependencies.

## ✨ Key Features

### 🎛️ **Core Functionality**

- **68 Pre-loaded Domains** - Comprehensive list of cryptocurrency exchanges, financial platforms, and popular services
- **Risk-Based Categorization** - Domains classified as Critical, High, Medium, or Low risk
- **Real-Time Progress Tracking** - Visual progress bars for each category with completion percentages
- **Per-Domain Management** - Individual checklists and notes for detailed tracking

### 📊 **Advanced Tracking**

- **Visual Check Indicators** - Green checkmarks for completed domains
- **Category Progress Bars** - Real-time completion tracking (e.g., "Critical (3/10 - 30%)")
- **Collapsible Interface** - Expandable/collapsible categories and header for better screen management
- **Search & Filter** - Real-time domain searching and risk-level filtering

### 💾 **Data Management**

- **Local Storage** - All data stored securely in your browser
- **Import/Export** - Backup and restore your tracking data via JSON files
- **Auto-Save** - Notes and checklist states saved automatically
- **Data Persistence** - All progress maintained between browser sessions

### 🎨 **User Experience**

- **Dark/Light Themes** - Professional UI with theme toggle
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations** - Polished interactions and transitions
- **Custom Favicon** - Security-themed shield icon

## 🚀 Getting Started

### Option 1: Local Installation

1. **Clone the repository**

2. **Open locally**
   ```bash
   # Simply open index.html in your browser
   open index.html
   # Or use a local server
   python -m http.server 8000
   ```

### Option 2: GitHub Pages Deployment

1. **Fork this repository**
2. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: Deploy from branch → main
   - Folder: / (root)
3. **Access your deployment**
   - Available at: `https://yourusername.github.io/breach-tracker-pro/`

## 📖 Usage Guide

### Basic Workflow

1. **Review Domains** - Browse the pre-loaded list of 68 domains across risk categories
2. **Track Progress** - Use checklists to mark domains as reviewed/secured
3. **Add Notes** - Record findings, actions taken, or important observations
4. **Monitor Progress** - Watch real-time completion percentages per category
5. **Export Data** - Backup your progress to JSON for safekeeping
6. **Import Data** - Restore previous tracking sessions from JSON files

### Interface Overview

#### Header Controls

- **📊 Stats Display** - Total domains and per-category counts
- **🔍 Search Bar** - Filter domains by name
- **🎚️ Filter Buttons** - Show specific risk levels (All, Critical, High, Medium, Low)
- **📤 Export Button** - Download current state as JSON
- **📥 Import Button** - Upload and restore from JSON backup
- **🌙 Theme Toggle** - Switch between dark and light modes
- **⬇️ Collapse Toggle** - Minimize header for more screen space

#### Category Management

- **Progress Indicators** - "Risk Level (completed/total - percentage%)"
- **Color-Coded Progress Bars** - Visual completion tracking
- **Collapsible Sections** - Click category headers to expand/collapse

#### Domain Actions

- **✓ Check Indicators** - Visual confirmation of completed items
- **🌐 Open Website** - Direct links to domain URLs
- **✅ Checklist Toggle** - Mark domains as completed
- **📝 Notes Toggle** - Add custom observations and findings

### Data Export/Import

#### Export Format

```json
{
  "version": "1.0",
  "exportDate": "2025-08-27T18:23:00.000Z",
  "checklist": {
    "accounts.binance.com": true,
    "www.kucoin.com": false
  },
  "notes": {
    "accounts.binance.com": "2FA enabled, audit completed",
    "gmail.com": "Account recovery options verified"
  },
  "categories": {
    "critical": true,
    "high": true,
    "medium": false,
    "low": false
  },
  "theme": "dark"
}
```

### Security Considerations

#### 🔒 Privacy & Security

- **No Server Dependencies** - Runs entirely in your browser
- **Local Data Storage** - All information stays on your device
- **No External Requests** - No data transmitted to external servers
- **HTTPS Compatible** - Works securely over encrypted connections

#### ⚠️ Important Notes

- Data is stored in browser localStorage - clearing browser data will remove tracking information
- Export your data regularly for backup purposes
- This tool is for tracking purposes only - does not perform actual security scanning
- Use responsibly and in compliance with applicable laws and regulations

## 🎨 Customization

### Adding New Domains

Edit the `appData.domains` object in `app.js`:

```javascript
const appData = {
  domains: {
    critical: [
      "your-critical-domain.com",
      // ... existing domains
    ],
    high: [
      "your-high-risk-domain.com",
      // ... existing domains
    ],
    // ... other categories
  },
};
```

### Modifying Risk Categories

Risk levels are determined by domain analysis in the `categorizeRiskLevel()` function. Keywords can be modified to adjust automatic categorization.

### Theme Customization

Modify CSS custom properties in `style.css`:

```css
:root {
  --color-critical: #ef4444; /* Critical risk color */
  --color-high: #f97316; /* High risk color */
  --color-medium: #eab308; /* Medium risk color */
  --color-low: #22c55e; /* Low risk color */
}
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Test your changes** thoroughly
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### Development Guidelines

- Maintain the existing code style and structure
- Ensure cross-browser compatibility
- Test all features thoroughly
- Update documentation as needed
- Follow security best practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with 🛡️ for cybersecurity professionals**

_Breach Tracker Pro - Comprehensive, secure, and completely private security breach monitoring._

