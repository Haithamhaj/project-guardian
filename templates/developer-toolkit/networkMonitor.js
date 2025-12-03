/**
 * 🔧 Project Guardian - Network Monitor
 * Monitor and log network requests
 */

class NetworkMonitor {
  constructor() {
    this.requests = [];
    this.maxRequests = 200;
    this.reportPath = this.getReportPath();
    this.isMonitoring = false;
    this.originalFetch = null;
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
   * Start monitoring
   */
  start() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.interceptFetch();
    this.interceptXHR();
    
    console.log('🌐 Network Monitor: Started');
  }

  /**
   * Stop monitoring
   */
  stop() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    
    if (this.originalFetch) {
      window.fetch = this.originalFetch;
    }
    
    console.log('🌐 Network Monitor: Stopped');
  }

  /**
   * Intercept fetch requests
   */
  interceptFetch() {
    this.originalFetch = window.fetch;
    const monitor = this;

    window.fetch = async function(...args) {
      const startTime = Date.now();
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;
      const method = args[1]?.method || 'GET';

      const request = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        type: 'fetch',
        url,
        method,
        startTime: new Date().toISOString(),
        status: 'pending',
        duration: null,
        response: null,
        error: null
      };

      monitor.addRequest(request);

      try {
        const response = await monitor.originalFetch.apply(this, args);
        const endTime = Date.now();

        request.status = response.ok ? 'success' : 'error';
        request.statusCode = response.status;
        request.statusText = response.statusText;
        request.duration = endTime - startTime;
        request.response = {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        };

        monitor.updateRequest(request);

        if (!response.ok) {
          monitor.logNetworkError(request);
        }

        return response;
      } catch (error) {
        const endTime = Date.now();
        
        request.status = 'failed';
        request.duration = endTime - startTime;
        request.error = {
          message: error.message,
          name: error.name
        };

        monitor.updateRequest(request);
        monitor.logNetworkError(request);

        throw error;
      }
    };
  }

  /**
   * Intercept XMLHttpRequest
   */
  interceptXHR() {
    const monitor = this;
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      this._guardianData = {
        method,
        url,
        startTime: null
      };
      return originalOpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(body) {
      const xhr = this;
      const startTime = Date.now();

      if (xhr._guardianData) {
        xhr._guardianData.startTime = new Date().toISOString();

        const request = {
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          type: 'xhr',
          url: xhr._guardianData.url,
          method: xhr._guardianData.method,
          startTime: xhr._guardianData.startTime,
          status: 'pending',
          duration: null,
          response: null,
          error: null
        };

        monitor.addRequest(request);

        xhr.addEventListener('load', function() {
          request.status = xhr.status >= 200 && xhr.status < 400 ? 'success' : 'error';
          request.statusCode = xhr.status;
          request.statusText = xhr.statusText;
          request.duration = Date.now() - startTime;
          monitor.updateRequest(request);

          if (xhr.status >= 400) {
            monitor.logNetworkError(request);
          }
        });

        xhr.addEventListener('error', function() {
          request.status = 'failed';
          request.duration = Date.now() - startTime;
          request.error = { message: 'Network Error' };
          monitor.updateRequest(request);
          monitor.logNetworkError(request);
        });

        xhr.addEventListener('timeout', function() {
          request.status = 'timeout';
          request.duration = Date.now() - startTime;
          request.error = { message: 'Request Timeout' };
          monitor.updateRequest(request);
          monitor.logNetworkError(request);
        });
      }

      return originalSend.apply(this, [body]);
    };
  }

  /**
   * Add request
   */
  addRequest(request) {
    this.requests.push(request);
    
    if (this.requests.length > this.maxRequests) {
      this.requests.shift();
    }

    this.emitEvent('request:start', request);
  }

  /**
   * Update request
   */
  updateRequest(request) {
    const index = this.requests.findIndex(r => r.id === request.id);
    if (index !== -1) {
      this.requests[index] = request;
    }

    this.emitEvent('request:end', request);
  }

  /**
   * Log network error
   */
  logNetworkError(request) {
    if (window.logger) {
      window.logger.error('Network request error', {
        url: request.url,
        method: request.method,
        status: request.statusCode,
        error: request.error
      });
    }
  }

  /**
   * Emit event
   */
  emitEvent(eventName, data) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(`guardian:${eventName}`, { detail: data }));
    }
  }

  /**
   * Get requests
   */
  getRequests(filter = {}) {
    let filtered = [...this.requests];

    if (filter.status) {
      filtered = filtered.filter(r => r.status === filter.status);
    }

    if (filter.method) {
      filtered = filtered.filter(r => r.method === filter.method);
    }

    if (filter.url) {
      filtered = filtered.filter(r => r.url.includes(filter.url));
    }

    return filtered;
  }

  /**
   * Get statistics
   */
  getStats() {
    const total = this.requests.length;
    const successful = this.requests.filter(r => r.status === 'success').length;
    const failed = this.requests.filter(r => r.status === 'failed' || r.status === 'error').length;
    const pending = this.requests.filter(r => r.status === 'pending').length;

    const durations = this.requests
      .filter(r => r.duration !== null)
      .map(r => r.duration);

    const avgDuration = durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

    const slowRequests = this.requests.filter(r => r.duration > 3000);

    return {
      total,
      successful,
      failed,
      pending,
      avgDuration: `${avgDuration}ms`,
      slowRequests: slowRequests.length,
      successRate: total > 0 ? `${Math.round((successful / total) * 100)}%` : '0%'
    };
  }

  /**
   * Get failed requests
   */
  getFailedRequests() {
    return this.requests.filter(r => 
      r.status === 'failed' || 
      r.status === 'error' || 
      r.status === 'timeout'
    );
  }

  /**
   * Clear logs
   */
  clear() {
    this.requests = [];
    console.log('🌐 Network Monitor: Logs cleared');
  }

  /**
   * Save network report
   */
  async saveReport() {
    try {
      const fs = require('fs');
      const path = require('path');

      if (!fs.existsSync(this.reportPath)) {
        fs.mkdirSync(this.reportPath, { recursive: true });
      }

      const report = {
        timestamp: new Date().toISOString(),
        stats: this.getStats(),
        failed_requests: this.getFailedRequests(),
        all_requests: this.requests
      };

      const reportPath = path.join(this.reportPath, 'network-log.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

      console.log(`📄 Network report saved to: ${reportPath}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to save network report:', error);
      return false;
    }
  }

  /**
   * Generate agent report
   */
  generateAgentReport() {
    const stats = this.getStats();
    const failed = this.getFailedRequests();

    let report = `# 🌐 Network Report

## Statistics:
- Total requests: ${stats.total}
- Successful: ${stats.successful}
- Failed: ${stats.failed}
- Success rate: ${stats.successRate}
- Average duration: ${stats.avgDuration}
- Slow requests (>3s): ${stats.slowRequests}

`;

    if (failed.length > 0) {
      report += `## ❌ Failed Requests:\n\n`;
      failed.forEach((r, i) => {
        report += `### ${i + 1}. ${r.method} ${r.url}
- Status: ${r.status} ${r.statusCode || ''}
- Duration: ${r.duration}ms
- Error: ${r.error?.message || r.statusText || 'unknown'}

`;
      });

      report += `## 💡 Fix Suggestions:\n\n`;
      
      const apiErrors = failed.filter(r => r.url.includes('/api/'));
      if (apiErrors.length > 0) {
        report += `- Check server: ${apiErrors.length} API request(s) failed\n`;
        report += `- Make sure server is running: cd api && python main.py\n`;
      }

      const timeouts = failed.filter(r => r.status === 'timeout');
      if (timeouts.length > 0) {
        report += `- ${timeouts.length} request(s) timed out - check server performance\n`;
      }
    } else {
      report += `## ✅ No failed requests!\n`;
    }

    return report;
  }
}

// Create global instance
const networkMonitor = new NetworkMonitor();

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NetworkMonitor, networkMonitor };
}

if (typeof window !== 'undefined') {
  window.GuardianNetworkMonitor = NetworkMonitor;
  window.networkMonitor = networkMonitor;
}
