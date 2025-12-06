"""
Guardian - Your AI Agent's Memory System

Modules:
    guardian_scanner: Auto-scan projects and generate snapshots
    guardian_mcp: MCP server tools for AI agent integration
"""

from .guardian_scanner import GuardianScanner, scan_project
from .guardian_mcp import (
    GuardianMemory,
    ChangeClassifier,
    classify_change,
    get_project_memory,
)

__version__ = "4.0.0"
__all__ = [
    "GuardianScanner",
    "scan_project",
    "GuardianMemory", 
    "ChangeClassifier",
    "classify_change",
    "get_project_memory",
]
