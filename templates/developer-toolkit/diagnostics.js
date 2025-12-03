/**
 * 🔧 Project Guardian - Diagnostics Module
 * System diagnostics with detailed reports
 * 
 * Purpose: Check application health and generate agent-readable reports
 */

class Diagnostics {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
    this.startTime = Date.now();
    
    // Report save path (Desktop for Mac compatibility)
    this.reportPath = this.getReportPath();
  }

  /**
   * Determine report path based on OS
   */
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
   * Run all diagnostic checks
   */
  async runFullDiagnostics() {
    console.log('🔍 Starting full diagnostics...');
    
    const results = {
      timestamp: new Date().toISOString(),
      status: 'ok',
      summary: '',
      duration_ms: 0,
      checks: {},
      errors: [],
      warnings: [],
      suggestions: []
    };

    try {
      // 1. Check server connection
      results.checks.server = await this.checkServerConnection();
      
      // 2. Check API endpoints
      results.checks.api = await this.checkAPIEndpoints();
      
      // 3. Check UI components
      results.checks.ui = this.checkUIComponents();
      
      // 4. Check memory usage
      results.checks.memory = this.checkMemoryUsage();
      
      // 5. Check permissions
      results.checks.permissions = await this.checkPermissions();
      
      // 6. Check required files
      results.checks.files = this.checkRequiredFiles();

      // Compile results
      results.errors = this.errors;
      results.warnings = this.warnings;
      results.duration_ms = Date.now() - this.startTime;
      
      // Determine overall status
      if (this.errors.length > 0) {
        results.status = 'error';
        results.summary = `❌ Found ${this.errors.length} issue(s) requiring attention`;
      } else if (this.warnings.length > 0) {
        results.status = 'warning';
        results.summary = `⚠️ Found ${this.warnings.length} warning(s)`;
      } else {
        results.status = 'ok';
        results.summary = '✅ All systems operational';
      }

      // Add suggestions
      results.suggestions = this.generateSuggestions();

      // Save report
      await this.saveReport(results);
      
      return results;

    } catch (error) {
      results.status = 'error';
      results.summary = `❌ Diagnostics failed: ${error.message}`;
      results.errors.push({
        type: 'system',
        message: error.message,
        suggestion: 'Verify application is running correctly'
      });
      
      await this.saveReport(results);
      return results;
    }
  }

  /**
   * Check server connection
   */
  async checkServerConnection() {
    const check = {
      name: 'Server Connection',
      status: 'checking',
      details: {}
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('http://localhost:8000/health', {
        signal: controller.signal
      });
      
      clearTimeout(timeout);

      if (response.ok) {
        check.status = 'ok';
        check.details = {
          message: '✅ Server connected and running',
          responseTime: 'fast'
        };
      } else {
        check.status = 'error';
        check.details = {
          message: `❌ Server responded with error: ${response.status}`,
          statusCode: response.status
        };
        this.errors.push({
          type: 'api',
          message: `Server returned status ${response.status}`,
          file: 'api/main.py',
          suggestion: 'Check the /health endpoint in server'
        });
      }
    } catch (error) {
      check.status = 'error';
      if (error.name === 'AbortError') {
        check.details = {
          message: '❌ Server not responding (timeout)',
          error: 'Connection timeout'
        };
        this.errors.push({
          type: 'api',
          message: 'Server not responding - timeout after 5 seconds',
          suggestion: 'Make sure server is running: cd api && python main.py'
        });
      } else {
        check.details = {
          message: '❌ Cannot connect to server',
          error: error.message
        };
        this.errors.push({
          type: 'api',
          message: `Connection failed: ${error.message}`,
          suggestion: 'Make sure server is running on port 8000'
        });
      }
    }

    return check;
  }

  /**
   * Check API endpoints
   */
  async checkAPIEndpoints() {
    const endpoints = [
      { path: '/health', method: 'GET', required: true },
      { path: '/api/chat', method: 'POST', required: true },
      { path: '/api/voice/start', method: 'POST', required: false },
    ];

    const check = {
      name: 'API Endpoints',
      status: 'ok',
      details: {
        total: endpoints.length,
        working: 0,
        failed: 0,
        results: []
      }
    };

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://localhost:8000${endpoint.path}`, {
          method: endpoint.method === 'GET' ? 'GET' : 'OPTIONS'
        });

        if (response.ok || response.status === 405 || response.status === 422) {
          check.details.working++;
          check.details.results.push({
            endpoint: endpoint.path,
            status: 'ok',
            message: '✅ Available'
          });
        } else {
          check.details.failed++;
          check.details.results.push({
            endpoint: endpoint.path,
            status: 'error',
            message: `❌ Error ${response.status}`
          });
          
          if (endpoint.required) {
            this.errors.push({
              type: 'api',
              message: `Required endpoint not working: ${endpoint.path}`,
              suggestion: `Check ${endpoint.path} definition in server`
            });
          }
        }
      } catch (error) {
        check.details.failed++;
        check.details.results.push({
          endpoint: endpoint.path,
          status: 'error',
          message: `❌ ${error.message}`
        });
      }
    }

    if (check.details.failed > 0) {
      check.status = 'warning';
    }

    return check;
  }

  /**
   * Check UI components
   */
  checkUIComponents() {
    const check = {
      name: 'UI Components',
      status: 'ok',
      details: {
        components: []
      }
    };

    const requiredElements = [
      { id: 'root', name: 'Root Container' },
      { id: 'app', name: 'App Container' },
      { selector: '[data-testid="sidebar"]', name: 'Sidebar' },
      { selector: '[data-testid="main-content"]', name: 'Main Content' }
    ];

    for (const element of requiredElements) {
      const el = element.id 
        ? document.getElementById(element.id)
        : document.querySelector(element.selector);

      if (el) {
        check.details.components.push({
          name: element.name,
          status: 'ok',
          message: '✅ Found'
        });
      } else {
        check.details.components.push({
          name: element.name,
          status: 'warning',
          message: '⚠️ Not found'
        });
        this.warnings.push({
          type: 'ui',
          message: `Component ${element.name} not found`,
          suggestion: 'Component may not be loaded yet or not defined'
        });
      }
    }

    return check;
  }

  /**
   * Check memory usage
   */
  checkMemoryUsage() {
    const check = {
      name: 'Memory Usage',
      status: 'ok',
      details: {}
    };

    if (window.performance && window.performance.memory) {
      const memory = window.performance.memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
      const percentage = Math.round((usedMB / totalMB) * 100);

      check.details = {
        used: `${usedMB} MB`,
        total: `${totalMB} MB`,
        percentage: `${percentage}%`,
        message: percentage > 80 
          ? '⚠️ High memory usage'
          : '✅ Normal memory usage'
      };

      if (percentage > 80) {
        check.status = 'warning';
        this.warnings.push({
          type: 'system',
          message: `High memory usage: ${percentage}%`,
          suggestion: 'Try restarting the application'
        });
      }
    } else {
      check.details = {
        message: 'ℹ️ Memory info not available'
      };
    }

    return check;
  }

  /**
   * Check permissions (especially microphone)
   */
  async checkPermissions() {
    const check = {
      name: 'Permissions',
      status: 'ok',
      details: {}
    };

    try {
      const micPermission = await navigator.permissions.query({ name: 'microphone' });
      
      check.details.microphone = {
        state: micPermission.state,
        message: micPermission.state === 'granted' 
          ? '✅ Microphone permission granted'
          : micPermission.state === 'denied'
            ? '❌ Microphone permission denied'
            : '⚠️ Microphone permission needs approval'
      };

      if (micPermission.state === 'denied') {
        check.status = 'error';
        this.errors.push({
          type: 'system',
          message: 'Microphone permission denied',
          suggestion: 'Go to System Preferences → Security & Privacy → Microphone and enable permission'
        });
      } else if (micPermission.state === 'prompt') {
        check.status = 'warning';
        this.warnings.push({
          type: 'system',
          message: 'Microphone permission needs approval',
          suggestion: 'Permission will be requested when using microphone'
        });
      }
    } catch (error) {
      check.details.microphone = {
        state: 'unknown',
        message: 'ℹ️ Cannot check permissions'
      };
    }

    return check;
  }

  /**
   * Check required files
   */
  checkRequiredFiles() {
    const check = {
      name: 'Required Files',
      status: 'ok',
      details: {
        message: 'ℹ️ This check requires server-side execution'
      }
    };

    return check;
  }

  /**
   * Generate suggestions based on issues found
   */
  generateSuggestions() {
    const suggestions = [];

    if (this.errors.some(e => e.type === 'api')) {
      suggestions.push({
        priority: 'high',
        title: 'Server Issues',
        steps: [
          'Make sure server is running: cd api && python main.py',
          'Check that port 8000 is not in use',
          'Review api/main.py file'
        ]
      });
    }

    if (this.errors.some(e => e.type === 'system' && e.message.includes('Microphone'))) {
      suggestions.push({
        priority: 'high',
        title: 'Microphone Permissions',
        steps: [
          'Open System Preferences',
          'Go to Security & Privacy',
          'Select Microphone',
          'Enable permission for the application'
        ]
      });
    }

    if (this.warnings.length > 0) {
      suggestions.push({
        priority: 'medium',
        title: 'Suggested Improvements',
        steps: this.warnings.map(w => w.suggestion)
      });
    }

    return suggestions;
  }

  /**
   * Save report to file
   */
  async saveReport(results) {
    try {
      const fs = require('fs');
      const path = require('path');

      // Create directory if doesn't exist
      if (!fs.existsSync(this.reportPath)) {
        fs.mkdirSync(this.reportPath, { recursive: true });
      }

      // Save latest report
      const latestPath = path.join(this.reportPath, 'latest-diagnostic.json');
      fs.writeFileSync(latestPath, JSON.stringify(results, null, 2), 'utf8');

      // Save timestamped copy
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const sessionPath = path.join(this.reportPath, `session-${timestamp}.json`);
      fs.writeFileSync(sessionPath, JSON.stringify(results, null, 2), 'utf8');

      console.log(`📄 Report saved to: ${latestPath}`);
      
      // Create agent summary (plain text)
      const summaryPath = path.join(this.reportPath, 'AGENT_SUMMARY.md');
      const summary = this.generateAgentSummary(results);
      fs.writeFileSync(summaryPath, summary, 'utf8');

      return true;
    } catch (error) {
      console.error('❌ Failed to save report:', error.message);
      
      // Try localStorage as fallback
      try {
        localStorage.setItem('guardian-latest-diagnostic', JSON.stringify(results));
        console.log('💾 Report saved to localStorage');
      } catch (e) {
        console.error('❌ localStorage save also failed');
      }
      
      return false;
    }
  }

  /**
   * Generate agent-readable summary
   */
  generateAgentSummary(results) {
    let summary = `# 🔍 Debug Toolkit Report
    
## Date: ${results.timestamp}
## Status: ${results.summary}

---

## ❌ Issues Requiring Fix:

`;

    if (results.errors.length === 0) {
      summary += 'No issues found! ✅\n';
    } else {
      results.errors.forEach((error, i) => {
        summary += `### ${i + 1}. ${error.message}
- **Type:** ${error.type}
- **File:** ${error.file || 'Not specified'}
- **Suggested Fix:** ${error.suggestion}

`;
      });
    }

    summary += `---

## ⚠️ Warnings:

`;

    if (results.warnings.length === 0) {
      summary += 'No warnings! ✅\n';
    } else {
      results.warnings.forEach((warning, i) => {
        summary += `${i + 1}. ${warning.message} → ${warning.suggestion}\n`;
      });
    }

    summary += `
---

## 📋 For Agent - Fix Steps:

`;

    results.suggestions.forEach((suggestion, i) => {
      summary += `### ${suggestion.title} (${suggestion.priority})
${suggestion.steps.map((s, j) => `${j + 1}. ${s}`).join('\n')}

`;
    });

    return summary;
  }
}

// Export class
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Diagnostics;
}

// Browser usage
if (typeof window !== 'undefined') {
  window.GuardianDiagnostics = Diagnostics;
}
