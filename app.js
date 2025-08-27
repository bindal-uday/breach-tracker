// Application data
const appData = {
  domains: {
    critical: [
      "accounts.binance.com", "www.kucoin.com", "www.gate.io", "www.huobi.com", 
      "www.bybit.com", "wallet.amepay.io", "wallet.covir.io", "wallet.lava.money",
      "wallet.tronsv.pro", "flame.exchange"
    ],
    high: [
      "account.aax.com", "account.xiaomi.com", "auth.permission.io"
    ],
    medium: [
      "gmail.com", "discord.com", "www.mediafire.com"
    ],
    low: [
      "7hash.com", "a-ads.com", "allbestico.com", "app.com.bots.business", "apps.elfsight.com",
      "atomars.com", "bitly.com", "bitmart.com", "bitmart.info", "btlux.co", "coinbank247.com",
      "coinbene.com", "coinmarketcap.com", "contracts.mywish.io", "c-trade.com", 
      "dd.scientifichash.com", "ftexchange.zendesk.com", "getbit.in", "heidicoin.io",
      "hotbit.io", "id.eldex.finance", "jiomart.com", "lukutex.com", "m.bilaxy.com",
      "m.bithumb.pro", "m.bitxmi.com", "minershash.com", "moremoney.io", "moviebloc.com",
      "mxc.com", "okex.com", "prepaidgamercard.com", "relictum.pro", "secure.droom.in",
      "uphold.com", "whitebit.com", "www.3qex.top", "www.aax.com", "www.bitmart.info",
      "www.centus.exchange", "www.coinbene.com", "www.c-trade.com", "www.egold.pro",
      "www.finexbox.com", "www.flame.exchange", "www.integromat.com", "www.jiomart.com",
      "www.joinhoney.com", "www.lukutex.com", "www.nowex.io", "www.okcoin.com", "www.thinkipos.com"
    ]
  },
  stats: {
    total: 68,
    critical: 10,
    high: 3,
    medium: 3,
    low: 52
  },
  lastUpdated: "2025-08-27T16:35:00.000Z"
};

// Application state
let appState = {
  currentFilter: 'all',
  searchQuery: '',
  headerCollapsed: false,
  categoryStates: {
    critical: true,
    high: true,
    medium: true,
    low: true
  },
  domainStates: {},
  theme: 'dark'
};

// Local storage keys
const STORAGE_KEYS = {
  CHECKLIST: 'breach-tracker-checklist',
  NOTES: 'breach-tracker-notes',
  THEME: 'breach-tracker-theme',
  CATEGORIES: 'breach-tracker-categories',
  HEADER: 'breach-tracker-header'
};

// Utility functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const sanitizeId = (domain) => {
  return domain.replace(/[^a-zA-Z0-9]/g, '-');
};

// Local storage functions
const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('LocalStorage not available, using default values');
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('LocalStorage not available, data will not persist');
    }
  }
};

// Notification system
const notificationManager = {
  show(message, type = 'info', title = '', duration = 5000) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${icons[type] || icons.info}</div>
        <div class="notification-text">
          ${title ? `<div class="notification-title">${title}</div>` : ''}
          <div class="notification-message">${message}</div>
        </div>
      </div>
      <button class="notification-close">×</button>
    `;

    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      this.hide(notification);
    });

    // Add to container and show
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // Auto-hide
    if (duration > 0) {
      setTimeout(() => {
        this.hide(notification);
      }, duration);
    }

    return notification;
  },

  hide(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
};

// Theme management
const themeManager = {
  init() {
    const savedTheme = storage.get(STORAGE_KEYS.THEME, 'dark');
    this.setTheme(savedTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  },
  
  setTheme(theme) {
    appState.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
    
    storage.set(STORAGE_KEYS.THEME, theme);
  },
  
  toggleTheme() {
    const newTheme = appState.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
};

// Header management
const headerManager = {
  init() {
    const savedHeaderState = storage.get(STORAGE_KEYS.HEADER, false);
    appState.headerCollapsed = savedHeaderState;
    
    const headerToggle = document.getElementById('headerToggle');
    const headerContent = document.getElementById('headerContent');
    
    if (headerToggle && headerContent) {
      if (appState.headerCollapsed) {
        headerToggle.classList.add('collapsed');
        headerContent.classList.add('collapsed');
      }
      
      headerToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleHeader();
      });
    }
  },
  
  toggleHeader() {
    appState.headerCollapsed = !appState.headerCollapsed;
    
    const headerToggle = document.getElementById('headerToggle');
    const headerContent = document.getElementById('headerContent');
    
    if (headerToggle && headerContent) {
      headerToggle.classList.toggle('collapsed', appState.headerCollapsed);
      headerContent.classList.toggle('collapsed', appState.headerCollapsed);
      
      storage.set(STORAGE_KEYS.HEADER, appState.headerCollapsed);
    }
  }
};

// Category management
const categoryManager = {
  init() {
    const savedCategories = storage.get(STORAGE_KEYS.CATEGORIES, {
      critical: true,
      high: true,
      medium: true,
      low: true
    });
    
    appState.categoryStates = savedCategories;
    
    // Set initial states
    this.updateCategoryStates();
    
    // Add event listeners with delegation
    document.addEventListener('click', (e) => {
      const categoryHeader = e.target.closest('.category-header');
      const categoryToggle = e.target.closest('.category-toggle');
      
      if (categoryHeader && !categoryToggle) {
        e.preventDefault();
        e.stopPropagation();
        const category = categoryHeader.dataset.category;
        if (category) {
          this.toggleCategory(category);
        }
      }
      
      if (categoryToggle) {
        e.preventDefault();
        e.stopPropagation();
        const categoryHeader = categoryToggle.closest('.category-header');
        const category = categoryHeader?.dataset.category;
        if (category) {
          this.toggleCategory(category);
        }
      }
    });
  },
  
  toggleCategory(category) {
    appState.categoryStates[category] = !appState.categoryStates[category];
    this.updateCategoryStates();
    storage.set(STORAGE_KEYS.CATEGORIES, appState.categoryStates);
  },
  
  updateCategoryStates() {
    Object.keys(appState.categoryStates).forEach(category => {
      const container = document.getElementById(`${category}-domains`);
      const section = document.querySelector(`[data-risk="${category}"]`);
      const toggle = section?.querySelector('.category-toggle');
      
      if (container && toggle) {
        const isExpanded = appState.categoryStates[category];
        container.classList.toggle('collapsed', !isExpanded);
        toggle.classList.toggle('collapsed', !isExpanded);
      }
    });
  }
};

// Domain rendering
const domainRenderer = {
  init() {
    this.renderAllDomains();
    this.updateStats();
    this.updateProgress();
    this.updateCategoryProgress();
  },
  
  renderAllDomains() {
    Object.keys(appData.domains).forEach(riskLevel => {
      this.renderDomains(riskLevel, appData.domains[riskLevel]);
    });
    this.updateCategoryProgress();
  },
  
  renderDomains(riskLevel, domains) {
    const container = document.getElementById(`${riskLevel}-domains`);
    if (!container) return;
    
    const filteredDomains = domains.filter(domain => this.shouldShowDomain(domain, riskLevel));
    
    container.innerHTML = filteredDomains
      .map(domain => this.createDomainHTML(domain, riskLevel))
      .join('');
      
    // Update category visibility
    const categorySection = document.querySelector(`[data-risk="${riskLevel}"]`);
    if (categorySection) {
      categorySection.style.display = filteredDomains.length > 0 ? 'block' : 'none';
    }
  },
  
  shouldShowDomain(domain, riskLevel) {
    // Filter by risk level
    if (appState.currentFilter !== 'all' && appState.currentFilter !== riskLevel) {
      return false;
    }
    
    // Filter by search query
    if (appState.searchQuery && !domain.toLowerCase().includes(appState.searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  },
  
  createDomainHTML(domain, riskLevel) {
    const checklistState = this.getChecklistState(domain);
    const notesContent = this.getNotesContent(domain);
    
    return `
      <div class="domain-item" data-domain="${domain}" data-risk="${riskLevel}">
        <div class="domain-header">
          <div class="domain-info">
            <div class="risk-indicator ${riskLevel}"></div>
            <span class="domain-name">${domain}</span>
            <span class="check-icon ${checklistState ? 'visible' : ''}">✓</span>
          </div>
          <div class="domain-actions">
            <a href="https://${domain}" target="_blank" class="domain-btn primary">
              🔗 Open Website
            </a>
            <button class="domain-btn checklist-toggle" data-domain="${domain}" data-section="checklist">
              ✅ Checklist
            </button>
            <button class="domain-btn notes-toggle" data-domain="${domain}" data-section="notes">
              📝 Notes
            </button>
          </div>
        </div>
        
        <div class="collapsible-section checklist-section" data-domain="${domain}" data-section="checklist">
          <div class="section-content">
            <div class="checklist-item">
              <div class="checklist-checkbox ${checklistState ? 'checked' : ''}" data-domain="${domain}"></div>
              <label class="checklist-label" data-domain="${domain}">
                Mark as checked/completed
              </label>
            </div>
          </div>
        </div>
        
        <div class="collapsible-section notes-section" data-domain="${domain}" data-section="notes">
          <div class="section-content">
            <textarea class="notes-textarea" 
                      placeholder="Add your notes about ${domain}..." 
                      data-domain="${domain}">${notesContent}</textarea>
          </div>
        </div>
      </div>
    `;
  },
  
  getChecklistState(domain) {
    const checklistData = storage.get(STORAGE_KEYS.CHECKLIST, {});
    return checklistData[domain] || false;
  },
  
  saveChecklistState(domain, state) {
    const checklistData = storage.get(STORAGE_KEYS.CHECKLIST, {});
    checklistData[domain] = state;
    storage.set(STORAGE_KEYS.CHECKLIST, checklistData);
  },
  
  getNotesContent(domain) {
    const notesData = storage.get(STORAGE_KEYS.NOTES, {});
    return notesData[domain] || '';
  },
  
  saveNotes(domain, content) {
    const notesData = storage.get(STORAGE_KEYS.NOTES, {});
    notesData[domain] = content;
    storage.set(STORAGE_KEYS.NOTES, notesData);
  },
  
  updateStats() {
    const elements = {
      totalCount: document.getElementById('totalCount'),
      criticalCount: document.getElementById('criticalCount'),
      highCount: document.getElementById('highCount'),
      mediumCount: document.getElementById('mediumCount'),
      lowCount: document.getElementById('lowCount')
    };
    
    if (elements.totalCount) elements.totalCount.textContent = appData.stats.total;
    if (elements.criticalCount) elements.criticalCount.textContent = appData.stats.critical;
    if (elements.highCount) elements.highCount.textContent = appData.stats.high;
    if (elements.mediumCount) elements.mediumCount.textContent = appData.stats.medium;
    if (elements.lowCount) elements.lowCount.textContent = appData.stats.low;
  },
  
  updateProgress() {
    const checklistData = storage.get(STORAGE_KEYS.CHECKLIST, {});
    const totalDomains = appData.stats.total;
    const checkedDomains = Object.values(checklistData).filter(Boolean).length;
    const percentage = totalDomains > 0 ? Math.round((checkedDomains / totalDomains) * 100) : 0;
    
    const progressPercent = document.getElementById('progressPercent');
    const progressFill = document.getElementById('progressFill');
    
    if (progressPercent) progressPercent.textContent = `${percentage}%`;
    if (progressFill) progressFill.style.width = `${percentage}%`;
  },

  updateCategoryProgress() {
    const checklistData = storage.get(STORAGE_KEYS.CHECKLIST, {});
    
    Object.keys(appData.domains).forEach(category => {
      const domains = appData.domains[category];
      const totalDomains = domains.length;
      const checkedDomains = domains.filter(domain => checklistData[domain]).length;
      const percentage = totalDomains > 0 ? Math.round((checkedDomains / totalDomains) * 100) : 0;
      
      // Update progress text
      const progressTextElement = document.getElementById(`${category}-progress-text`);
      if (progressTextElement) {
        progressTextElement.textContent = `(${checkedDomains}/${totalDomains} - ${percentage}%)`;
      }
      
      // Update progress bar
      const progressFillElement = document.getElementById(`${category}-progress-fill`);
      if (progressFillElement) {
        progressFillElement.style.width = `${percentage}%`;
      }
    });
  }
};

// Search and filter management
const filterManager = {
  init() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        appState.searchQuery = e.target.value.trim();
        domainRenderer.renderAllDomains();
      }, 300));
    }
    
    // Filter buttons with event delegation
    document.addEventListener('click', (e) => {
      const filterBtn = e.target.closest('.filter-btn');
      if (filterBtn) {
        e.preventDefault();
        e.stopPropagation();
        const filter = filterBtn.dataset.filter;
        if (filter) {
          this.setFilter(filter);
        }
      }
    });
  },
  
  setFilter(filter) {
    appState.currentFilter = filter;
    
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    // Re-render domains with new filter
    domainRenderer.renderAllDomains();
  }
};

// Domain interactions manager
const domainInteractionManager = {
  init() {
    // Use event delegation for better performance and dynamic content handling
    document.addEventListener('click', (e) => {
      this.handleDomainInteractions(e);
    });
    
    document.addEventListener('input', (e) => {
      this.handleNotesInput(e);
    });
  },
  
  handleDomainInteractions(e) {
    // Handle section toggle buttons
    if (e.target.matches('.checklist-toggle, .notes-toggle')) {
      e.preventDefault();
      e.stopPropagation();
      const domain = e.target.dataset.domain;
      const section = e.target.dataset.section;
      if (domain && section) {
        this.toggleSection(section, domain, e.target);
      }
    }
    
    // Handle checkbox clicks
    if (e.target.matches('.checklist-checkbox')) {
      e.preventDefault();
      e.stopPropagation();
      const domain = e.target.dataset.domain;
      if (domain) {
        this.toggleCheckbox(domain, e.target);
      }
    }
    
    // Handle label clicks
    if (e.target.matches('.checklist-label')) {
      e.preventDefault();
      e.stopPropagation();
      const domain = e.target.dataset.domain;
      const checkbox = document.querySelector(`.checklist-checkbox[data-domain="${domain}"]`);
      if (domain && checkbox) {
        this.toggleCheckbox(domain, checkbox);
      }
    }
  },
  
  handleNotesInput(e) {
    if (e.target.matches('.notes-textarea')) {
      const domain = e.target.dataset.domain;
      if (domain) {
        debounce(() => {
          domainRenderer.saveNotes(domain, e.target.value);
        }, 500)();
      }
    }
  },
  
  toggleSection(sectionType, domain, button) {
    const domainItem = button.closest('.domain-item');
    if (!domainItem) return;
    
    const section = domainItem.querySelector(`.${sectionType}-section[data-domain="${domain}"]`);
    if (!section) return;
    
    const isActive = section.classList.contains('active');
    
    // Close all sections in this domain first
    domainItem.querySelectorAll('.collapsible-section').forEach(s => {
      s.classList.remove('active');
    });
    
    // Remove active state from all buttons in this domain
    domainItem.querySelectorAll('.domain-btn').forEach(b => {
      b.classList.remove('active');
    });
    
    // Toggle the clicked section
    if (!isActive) {
      section.classList.add('active');
      button.classList.add('active');
      
      // Focus textarea if it's notes section
      if (sectionType === 'notes') {
        const textarea = section.querySelector('.notes-textarea');
        setTimeout(() => textarea?.focus(), 150);
      }
    }
  },
  
  toggleCheckbox(domain, checkbox) {
    const isChecked = checkbox.classList.contains('checked');
    const newState = !isChecked;
    
    // Update checkbox
    checkbox.classList.toggle('checked', newState);
    domainRenderer.saveChecklistState(domain, newState);
    
    // Update check icon in domain header
    const domainItem = checkbox.closest('.domain-item');
    const checkIcon = domainItem?.querySelector('.check-icon');
    if (checkIcon) {
      checkIcon.classList.toggle('visible', newState);
    }
    
    // Update progress with slight delay for smooth animation
    setTimeout(() => {
      domainRenderer.updateProgress();
      domainRenderer.updateCategoryProgress();
    }, 100);
  }
};

// Import/Export functionality
const importExportManager = {
  init() {
    this.initExportModal();
    this.initImportModal();
  },

  initExportModal() {
    const exportBtn = document.getElementById('exportBtn');
    const modal = document.getElementById('exportModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    const exportCSV = document.getElementById('exportCSV');
    const exportJSON = document.getElementById('exportJSON');
    
    if (exportBtn && modal) {
      exportBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        modal.classList.remove('hidden');
      });
    }
    
    const closeModal = () => {
      if (modal) modal.classList.add('hidden');
    };
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    
    if (exportCSV && modal) {
      exportCSV.addEventListener('click', (e) => {
        e.preventDefault();
        this.exportAsCSV();
        closeModal();
      });
    }
    
    if (exportJSON && modal) {
      exportJSON.addEventListener('click', (e) => {
        e.preventDefault();
        this.exportAsJSON();
        closeModal();
      });
    }
  },

  initImportModal() {
    const importBtn = document.getElementById('importBtn');
    const modal = document.getElementById('importModal');
    const modalClose = document.getElementById('importModalClose');
    const modalOverlay = document.getElementById('importModalOverlay');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');
    const importPreview = document.getElementById('importPreview');
    const previewContent = document.getElementById('previewContent');
    const cancelImport = document.getElementById('cancelImport');
    const confirmImport = document.getElementById('confirmImport');
    
    let importData = null;

    const closeModal = () => {
      if (modal) modal.classList.add('hidden');
      if (importPreview) importPreview.classList.add('hidden');
      importData = null;
      if (fileInput) fileInput.value = '';
    };
    
    if (importBtn && modal) {
      importBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        modal.classList.remove('hidden');
      });
    }
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    if (cancelImport) cancelImport.addEventListener('click', closeModal);

    // File upload area interactions
    if (fileUploadArea && fileInput) {
      fileUploadArea.addEventListener('click', () => {
        fileInput.click();
      });

      // Drag and drop support
      fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('drag-over');
      });

      fileUploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('drag-over');
      });

      fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          this.handleFileSelection(files[0], previewContent, importPreview, (data) => { importData = data; });
        }
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.handleFileSelection(file, previewContent, importPreview, (data) => { importData = data; });
        }
      });
    }

    if (confirmImport) {
      confirmImport.addEventListener('click', () => {
        if (importData) {
          this.performImport(importData);
          closeModal();
        }
      });
    }
  },

  handleFileSelection(file, previewContent, importPreview, setImportData) {
    if (!file.name.toLowerCase().endsWith('.json')) {
      notificationManager.show('Please select a JSON file.', 'error', 'Invalid File');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Validate the data structure
        if (this.validateImportData(data)) {
          setImportData(data);
          if (previewContent) previewContent.textContent = JSON.stringify(data, null, 2);
          if (importPreview) importPreview.classList.remove('hidden');
        } else {
          notificationManager.show('Invalid file format. Please select a valid breach tracker export file.', 'error', 'Import Error');
        }
      } catch (error) {
        notificationManager.show('Failed to parse JSON file. Please check the file format.', 'error', 'Parse Error');
      }
    };
    
    reader.readAsText(file);
  },

  validateImportData(data) {
    // Check for required properties
    return data && 
           data.domains && 
           typeof data.domains === 'object' &&
           data.checklist && 
           typeof data.checklist === 'object';
  },

  performImport(data) {
    try {
      // Import checklist data
      if (data.checklist) {
        storage.set(STORAGE_KEYS.CHECKLIST, data.checklist);
      }
      
      // Import notes data
      if (data.notes) {
        storage.set(STORAGE_KEYS.NOTES, data.notes);
      }
      
      // Refresh the UI
      domainRenderer.renderAllDomains();
      domainRenderer.updateProgress();
      domainRenderer.updateCategoryProgress();
      
      notificationManager.show('Data imported successfully!', 'success', 'Import Complete');
    } catch (error) {
      console.error('Import error:', error);
      notificationManager.show('Failed to import data. Please try again.', 'error', 'Import Failed');
    }
  },
  
  exportAsCSV() {
    const checklistData = storage.get(STORAGE_KEYS.CHECKLIST, {});
    const notesData = storage.get(STORAGE_KEYS.NOTES, {});
    
    let csvContent = 'Domain,Risk Level,Checked,Notes\n';
    
    Object.keys(appData.domains).forEach(riskLevel => {
      appData.domains[riskLevel].forEach(domain => {
        const checked = checklistData[domain] ? 'Yes' : 'No';
        const notes = (notesData[domain] || '').replace(/"/g, '""');
        csvContent += `"${domain}","${riskLevel}","${checked}","${notes}"\n`;
      });
    });
    
    this.downloadFile(csvContent, 'breach-tracker-export.csv', 'text/csv');
    notificationManager.show('CSV export completed successfully!', 'success', 'Export Complete');
  },
  
  exportAsJSON() {
    const exportData = {
      domains: appData.domains,
      stats: appData.stats,
      checklist: storage.get(STORAGE_KEYS.CHECKLIST, {}),
      notes: storage.get(STORAGE_KEYS.NOTES, {}),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const jsonContent = JSON.stringify(exportData, null, 2);
    this.downloadFile(jsonContent, 'breach-tracker-export.json', 'application/json');
    notificationManager.show('JSON export completed successfully!', 'success', 'Export Complete');
  },
  
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

// Keyboard navigation
const keyboardManager = {
  init() {
    document.addEventListener('keydown', (e) => {
      // Close modals with Escape key
      if (e.key === 'Escape') {
        const visibleModals = document.querySelectorAll('.modal:not(.hidden)');
        visibleModals.forEach(modal => {
          modal.classList.add('hidden');
        });
      }
      
      // Toggle header with Ctrl+H
      if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        headerManager.toggleHeader();
      }
      
      // Focus search with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
      }
      
      // Toggle theme with Ctrl+T
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        themeManager.toggleTheme();
      }
    });
  }
};

// Initialize application
class BreachTracker {
  constructor() {
    this.init();
  }
  
  async init() {
    try {
      console.log('Initializing Breach Tracker Pro...');
      
      // Initialize all managers
      themeManager.init();
      headerManager.init();
      categoryManager.init();
      filterManager.init();
      domainInteractionManager.init();
      importExportManager.init();
      keyboardManager.init();
      
      // Render domains
      domainRenderer.init();
      
      // Animate elements in
      setTimeout(() => {
        this.animateIn();
      }, 100);
      
      console.log('Breach Tracker Pro initialized successfully');
      
      // Show welcome notification on first load
      const hasShownWelcome = storage.get('breach-tracker-welcome', false);
      if (!hasShownWelcome) {
        setTimeout(() => {
          notificationManager.show(
            'Welcome to Breach Tracker Pro! Track your security breaches with advanced progress monitoring.',
            'info',
            'Welcome',
            8000
          );
          storage.set('breach-tracker-welcome', true);
        }, 1000);
      }
      
    } catch (error) {
      console.error('Failed to initialize Breach Tracker:', error);
      notificationManager.show('Failed to initialize application. Please refresh the page.', 'error', 'Initialization Error');
    }
  }
  
  animateIn() {
    // Animate stats cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.animation = `fadeIn 0.3s ease forwards`;
      }, index * 100);
    });
    
    // Update progress bar with animation
    setTimeout(() => {
      domainRenderer.updateProgress();
      domainRenderer.updateCategoryProgress();
    }, 500);
  }
}

// Start the application when DOM is loaded
function startApp() {
  new BreachTracker();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}

// Handle page visibility changes to update progress
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    domainRenderer.updateProgress();
    domainRenderer.updateCategoryProgress();
  }
});

// Export for debugging
window.BreachTracker = {
  appData,
  appState,
  domainRenderer,
  themeManager,
  headerManager,
  categoryManager,
  filterManager,
  importExportManager,
  notificationManager
};