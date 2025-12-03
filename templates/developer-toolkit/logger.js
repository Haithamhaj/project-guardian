/**
 * 🔧 Project Guardian - Logger Module
 * Event logging with multiple levels
 */

class Logger {
  constructor(options = {}) {
    this.logs = [];
    this.maxLogs = options.maxLogs || 500;
    this.reportPath = this.getReportPath();
    
    // Log levels
    this.levels = {
      DEBUG: { value: 0, emoji: '🔍', color: '#888' },
      INFO: { value: 1, emoji: 'ℹ️', color: '#17a2b8' },
      SUCCESS: { value: 2, emoji: '✅', color: '#28a745' },
      WARN: { value: 3, emoji: '⚠️', color: '#ffc107' },
      ERROR: { value: 4, emoji: '❌', color: '#dc3545' }
    };

    this.currentLevel = options.level || 'DEBUG';
    
    // Setup global error handlers
    this.setupGlobalHandlers();
  }

  getReportPath() {
    const homedir = require('os').homedir();
    const path = require('path');
    
    if (process.platform === 'darwin') {
      return path.join(homedir, 'Desktop', 'guardian-reports');
    } else if (process.platform === 'win32') {
      return path.join(homedir, 'Documents', 'guardian-reports');
    } else {
      return path.join(homedir, 'guardian-reports');
    }
  }

  /**
   * Setup global error handlers
   */
  setupGlobalHandlers() {
    if (typeof window !== 'undefined') {
      // Catch unhandled errors
      window.onerror = (message, source, lineno, colno, error) => {
        this.error('Unhandled error', {
          message,
          source,
          line: lineno,
          column: colno,
          stack: error?.stack
        });
        return false;
      };

      // Catch unhandled Promise rejections
      window.onunhandledrejection = (event) => {
        this.error('Unhandled Promise rejection', {
          reason: event.reason?.message || event.reason,
          stack: event.reason?.stack
        });
      };
    }
  }

  /**
   * Log an event
   */
  log(level, message, data = {}) {
    const levelConfig = this.levels[level] || this.levels.INFO;
    
    // Check log level
    if (levelConfig.value < this.levels[this.currentLevel].value) {
      return;
    }

    const entry = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      level,
      emoji: levelConfig.emoji,
      color: levelConfig.color,
      message,
      data,
      source: this.getCallSource()
    };

    this.logs.push(entry);

    // Keep max logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Print to console
    this.printToConsole(entry);

    // Auto-save errors
    if (level === 'ERROR') {
      this.saveErrorLog(entry);
    }

    return entry;
  }

  /**
   * Get call source
   */
  getCallSource() {
    try {
      const stack = new Error().stack;
      const lines = stack.split('\n');
      const line = lines[4] || '';
      const match = line.match(/at\s+(.+)\s+\((.+):(\d+):(\d+)\)/) ||
                    line.match(/at\s+(.+):(\d+):(\d+)/);
      
      if (match) {
        return {
          function: match[1] || 'anonymous',
          file: match[2] || 'unknown',
          line: match[3] || '?',
          column: match[4] || '?'
        };
      }
    } catch (e) {
      // Ignore
    }
    return null;
  }

  /**
   * Print to console
   */
  printToConsole(entry) {
    const style = `color: ${entry.color}; font-weight: bold;`;
    const time = new Date(entry.timestamp).toLocaleTimeString();
    
    console.groupCollapsed(
      `%c${entry.emoji} [${time}] ${entry.message}`,
      style
    );
    
    if (Object.keys(entry.data).length > 0) {
      console.log('Data:', entry.data);
    }
    
    if (entry.source) {
      console.log('Source:', `${entry.source.file}:${entry.source.line}`);
    }
    
    console.groupEnd();
  }

  /**
   * Shortcut functions
   */
  debug(message, data) {
    return this.log('DEBUG', message, data);
  }

  info(message, data) {
    return this.log('INFO', message, data);
  }

  success(message, data) {
    return this.log('SUCCESS', message, data);
  }

  warn(message, data) {
    return this.log('WARN', message, data);
  }

  error(message, data) {
    return this.log('ERROR', message, data);
  }

  /**
   * Save error log
   */
  async saveErrorLog(entry) {
    try {
      const fs = require('fs');
      const path = require('path');

      if (!fs.existsSync(this.reportPath)) {
        fs.mkdirSync(this.reportPath, { recursive: true });
      }

      const errorLogPath = path.join(this.reportPath, 'error-log.json');
      
      let existingErrors = [];
      if (fs.existsSync(errorLogPath)) {
        const content = fs.readFileSync(errorLogPath, 'utf8');
        existingErrors = JSON.parse(content);
      }

      existingErrors.push(entry);
      
      // Keep last 100 errors only
      if (existingErrors.length > 100) {
        existingErrors = existingErrors.slice(-100);
      }

      fs.writeFileSync(errorLogPath, JSON.stringify(existingErrors, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to save error log:', e);
    }
  }

  /**
   * Get logs
   */
  getLogs(filter = {}) {
    let filtered = [...this.logs];

    if (filter.level) {
      filtered = filtered.filter(l => l.level === filter.level);
    }

    if (filter.since) {
      filtered = filtered.filter(l => new Date(l.timestamp) > filter.since);
    }

    if (filter.search) {
      const term = filter.search.toLowerCase();
      filtered = filtered.filter(l => 
        l.message.toLowerCase().includes(term) ||
        JSON.stringify(l.data).toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  /**
   * Clear logs
   */
  clear() {
    this.logs = [];
    this.info('Logs cleared');
  }

  /**
   * Export logs
   */
  export() {
    return {
      exported_at: new Date().toISOString(),
      total_logs: this.logs.length,
      logs: this.logs,
      summary: {
        errors: this.logs.filter(l => l.level === 'ERROR').length,
        warnings: this.logs.filter(l => l.level === 'WARN').length,
        info: this.logs.filter(l => l.level === 'INFO').length
      }
    };
  }

  /**
   * Generate agent report
   */
  generateAgentReport() {
    const errors = this.logs.filter(l => l.level === 'ERROR');
    const warnings = this.logs.filter(l => l.level === 'WARN');

    let report = `# 📋 Log Report

## Statistics:
- Total logs: ${this.logs.length}
- Errors: ${errors.length}
- Warnings: ${warnings.length}

`;

    if (errors.length > 0) {
      report += `## ❌ Errors:\n\n`;
      errors.forEach((e, i) => {
        report += `### ${i + 1}. ${e.message}
- Time: ${e.timestamp}
- Source: ${e.source?.file || 'unknown'}:${e.source?.line || '?'}
- Data: \`${JSON.stringify(e.data)}\`

`;
      });
    }

    if (warnings.length > 0) {
      report += `## ⚠️ Warnings:\n\n`;
      warnings.forEach((w, i) => {
        report += `${i + 1}. ${w.message} (${w.timestamp})\n`;
      });
    }

    return report;
  }
}

// Create global instance
const logger = new Logger();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Logger, logger };
}

if (typeof window !== 'undefined') {
  window.GuardianLogger = Logger;
  window.logger = logger;
}
