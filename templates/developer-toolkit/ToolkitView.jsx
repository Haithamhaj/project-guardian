/**
 * 🔧 Project Guardian - Developer Toolkit UI
 * Debug and diagnostics interface
 */

import React, { useState, useEffect, useCallback } from 'react';

const Diagnostics = window.GuardianDiagnostics || require('./diagnostics');
const { logger } = window.logger ? { logger: window.logger } : require('./logger');
const { networkMonitor } = window.networkMonitor ? { networkMonitor: window.networkMonitor } : require('./networkMonitor');

const ToolkitView = () => {
  const [activeTab, setActiveTab] = useState('diagnostics');
  const [diagnosticResults, setDiagnosticResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [networkRequests, setNetworkRequests] = useState([]);
  const [networkStats, setNetworkStats] = useState(null);
  const [reportSaved, setReportSaved] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (logger) {
        setLogs(logger.getLogs().slice(-50).reverse());
      }
      if (networkMonitor) {
        setNetworkRequests(networkMonitor.getRequests().slice(-30).reverse());
        setNetworkStats(networkMonitor.getStats());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (networkMonitor && !networkMonitor.isMonitoring) {
      networkMonitor.start();
    }
  }, []);

  const runDiagnostics = useCallback(async () => {
    setIsRunning(true);
    setReportSaved(false);

    try {
      const diagnostics = new Diagnostics();
      const results = await diagnostics.runFullDiagnostics();
      setDiagnosticResults(results);
      setReportSaved(true);

      if (logger) {
        logger.info('Diagnostic scan completed', { status: results.status });
      }
    } catch (error) {
      if (logger) {
        logger.error('Diagnostic scan failed', { error: error.message });
      }
    } finally {
      setIsRunning(false);
    }
  }, []);

  const saveNetworkReport = useCallback(async () => {
    if (networkMonitor) {
      await networkMonitor.saveReport();
      setReportSaved(true);
    }
  }, []);

  const clearLogs = useCallback(() => {
    if (logger) {
      logger.clear();
      setLogs([]);
    }
  }, []);

  const exportForAgent = useCallback(() => {
    let report = `# 🔧 Full Debug Toolkit Report
Export Date: ${new Date().toISOString()}

---

`;

    if (diagnosticResults) {
      report += `## 📊 Diagnostic Results

Status: ${diagnosticResults.summary}

### Issues:
${diagnosticResults.errors.map((e, i) => `${i + 1}. ❌ ${e.message}\n   - Type: ${e.type}\n   - Fix: ${e.suggestion}`).join('\n\n')}

### Warnings:
${diagnosticResults.warnings.map((w, i) => `${i + 1}. ⚠️ ${w.message}`).join('\n')}

---

`;
    }

    if (networkMonitor) {
      report += networkMonitor.generateAgentReport();
      report += '\n---\n\n';
    }

    if (logger) {
      report += logger.generateAgentReport();
    }

    navigator.clipboard.writeText(report).then(() => {
      alert('✅ Report copied! Paste it to the agent.');
    });
  }, [diagnosticResults]);

  const styles = {
    container: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#1a1a2e',
      color: '#eee',
      minHeight: '100vh',
      padding: '20px'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
      paddingBottom: '15px',
      borderBottom: '1px solid #333'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    tabs: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px'
    },
    tab: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    tabActive: {
      backgroundColor: '#00b894',
      color: 'white'
    },
    tabInactive: {
      backgroundColor: '#2d2d44',
      color: '#aaa'
    },
    card: {
      backgroundColor: '#2d2d44',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '15px'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s'
    },
    buttonPrimary: {
      backgroundColor: '#00b894',
      color: 'white'
    },
    buttonSecondary: {
      backgroundColor: '#6c5ce7',
      color: 'white'
    },
    buttonDanger: {
      backgroundColor: '#d63031',
      color: 'white'
    },
    statusBadge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    statusOk: {
      backgroundColor: '#00b894',
      color: 'white'
    },
    statusWarning: {
      backgroundColor: '#fdcb6e',
      color: '#2d3436'
    },
    statusError: {
      backgroundColor: '#d63031',
      color: 'white'
    },
    logEntry: {
      padding: '8px 12px',
      marginBottom: '4px',
      borderRadius: '6px',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px'
    },
    requestEntry: {
      padding: '10px 15px',
      marginBottom: '8px',
      borderRadius: '8px',
      backgroundColor: '#1a1a2e',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  };

  const renderDiagnostics = () => (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          style={{ ...styles.button, ...styles.buttonPrimary }}
          onClick={runDiagnostics}
          disabled={isRunning}
        >
          {isRunning ? '⏳ Running...' : '🔍 Run Diagnostics'}
        </button>
        
        <button 
          style={{ ...styles.button, ...styles.buttonSecondary }}
          onClick={exportForAgent}
        >
          📋 Copy for Agent
        </button>
      </div>

      {reportSaved && (
        <div style={{ ...styles.card, backgroundColor: '#00b89433', border: '1px solid #00b894' }}>
          ✅ Report saved to: ~/Desktop/guardian-reports/
        </div>
      )}

      {diagnosticResults && (
        <div>
          <div style={styles.card}>
            <h3 style={{ marginTop: 0 }}>📊 Overall Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{
                ...styles.statusBadge,
                ...(diagnosticResults.status === 'ok' ? styles.statusOk : 
                    diagnosticResults.status === 'warning' ? styles.statusWarning : 
                    styles.statusError)
              }}>
                {diagnosticResults.summary}
              </span>
              <span style={{ color: '#888' }}>
                Duration: {diagnosticResults.duration_ms}ms
              </span>
            </div>
          </div>

          {diagnosticResults.errors.length > 0 && (
            <div style={{ ...styles.card, borderLeft: '4px solid #d63031' }}>
              <h3 style={{ marginTop: 0, color: '#d63031' }}>❌ Issues ({diagnosticResults.errors.length})</h3>
              {diagnosticResults.errors.map((error, i) => (
                <div key={i} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#d6303122', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 'bold' }}>{error.message}</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                    Type: {error.type} | File: {error.file || 'Not specified'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#00b894', marginTop: '8px' }}>
                    💡 {error.suggestion}
                  </div>
                </div>
              ))}
            </div>
          )}

          {diagnosticResults.warnings.length > 0 && (
            <div style={{ ...styles.card, borderLeft: '4px solid #fdcb6e' }}>
              <h3 style={{ marginTop: 0, color: '#fdcb6e' }}>⚠️ Warnings ({diagnosticResults.warnings.length})</h3>
              {diagnosticResults.warnings.map((warning, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  • {warning.message}
                </div>
              ))}
            </div>
          )}

          <div style={styles.card}>
            <h3 style={{ marginTop: 0 }}>✅ Check Results</h3>
            {Object.entries(diagnosticResults.checks || {}).map(([key, check]) => (
              <div key={key} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '8px 0',
                borderBottom: '1px solid #3d3d5c'
              }}>
                <span>{check.name}</span>
                <span style={{
                  ...styles.statusBadge,
                  ...(check.status === 'ok' ? styles.statusOk : 
                      check.status === 'warning' ? styles.statusWarning : 
                      styles.statusError)
                }}>
                  {check.status === 'ok' ? '✅' : check.status === 'warning' ? '⚠️' : '❌'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderLogs = () => (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          style={{ ...styles.button, ...styles.buttonDanger }}
          onClick={clearLogs}
        >
          🗑️ Clear Logs
        </button>
      </div>

      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>📋 Logs ({logs.length})</h3>
        <div style={{ maxHeight: '500px', overflow: 'auto' }}>
          {logs.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
              No logs yet
            </div>
          ) : (
            logs.map(log => (
              <div 
                key={log.id} 
                style={{ 
                  ...styles.logEntry,
                  backgroundColor: log.level === 'ERROR' ? '#d6303122' :
                                   log.level === 'WARN' ? '#fdcb6e22' :
                                   '#2d2d44'
                }}
              >
                <span>{log.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div>{log.message}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderNetwork = () => (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          style={{ ...styles.button, ...styles.buttonPrimary }}
          onClick={saveNetworkReport}
        >
          💾 Save Report
        </button>
        <button 
          style={{ ...styles.button, ...styles.buttonDanger }}
          onClick={() => {
            networkMonitor?.clear();
            setNetworkRequests([]);
          }}
        >
          🗑️ Clear
        </button>
      </div>

      {networkStats && (
        <div style={{ ...styles.card, display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{networkStats.total}</div>
            <div style={{ color: '#888', fontSize: '12px' }}>Total Requests</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00b894' }}>{networkStats.successful}</div>
            <div style={{ color: '#888', fontSize: '12px' }}>Successful</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d63031' }}>{networkStats.failed}</div>
            <div style={{ color: '#888', fontSize: '12px' }}>Failed</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{networkStats.avgDuration}</div>
            <div style={{ color: '#888', fontSize: '12px' }}>Avg Duration</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{networkStats.successRate}</div>
            <div style={{ color: '#888', fontSize: '12px' }}>Success Rate</div>
          </div>
        </div>
      )}

      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>🌐 Requests ({networkRequests.length})</h3>
        <div style={{ maxHeight: '400px', overflow: 'auto' }}>
          {networkRequests.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
              No requests yet
            </div>
          ) : (
            networkRequests.map(req => (
              <div key={req.id} style={styles.requestEntry}>
                <div>
                  <span style={{ 
                    color: req.method === 'GET' ? '#00b894' : 
                           req.method === 'POST' ? '#6c5ce7' : '#fdcb6e',
                    fontWeight: 'bold',
                    marginRight: '10px'
                  }}>
                    {req.method}
                  </span>
                  <span style={{ color: '#ddd' }}>{req.url}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {req.duration && (
                    <span style={{ color: '#888', fontSize: '12px' }}>
                      {req.duration}ms
                    </span>
                  )}
                  <span style={{
                    ...styles.statusBadge,
                    ...(req.status === 'success' ? styles.statusOk : 
                        req.status === 'pending' ? { backgroundColor: '#888' } : 
                        styles.statusError)
                  }}>
                    {req.status === 'success' ? '✓' : 
                     req.status === 'pending' ? '...' : '✗'}
                    {req.statusCode && ` ${req.statusCode}`}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          🛡️ Project Guardian - Developer Toolkit
        </div>
        <div style={{ color: '#888', fontSize: '12px' }}>
          v1.0 | Reports: ~/Desktop/guardian-reports/
        </div>
      </div>

      <div style={styles.tabs}>
        <button 
          style={{ ...styles.tab, ...(activeTab === 'diagnostics' ? styles.tabActive : styles.tabInactive) }}
          onClick={() => setActiveTab('diagnostics')}
        >
          🔍 Diagnostics
        </button>
        <button 
          style={{ ...styles.tab, ...(activeTab === 'logs' ? styles.tabActive : styles.tabInactive) }}
          onClick={() => setActiveTab('logs')}
        >
          📋 Logs
        </button>
        <button 
          style={{ ...styles.tab, ...(activeTab === 'network' ? styles.tabActive : styles.tabInactive) }}
          onClick={() => setActiveTab('network')}
        >
          🌐 Network
        </button>
      </div>

      {activeTab === 'diagnostics' && renderDiagnostics()}
      {activeTab === 'logs' && renderLogs()}
      {activeTab === 'network' && renderNetwork()}
    </div>
  );
};

export default ToolkitView;
