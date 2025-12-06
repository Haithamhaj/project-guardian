#!/usr/bin/env python3
"""
Guardian MCP Server
Provides tools for AI agents to interact with Guardian project memory.
"""

import json
import os
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, Any, List
import re

# Try to import MCP SDK
try:
    from mcp.server import Server
    from mcp.types import Tool, TextContent
    HAS_MCP = True
except ImportError:
    HAS_MCP = False
    print("Warning: MCP SDK not installed. Run: pip install mcp")


class GuardianMemory:
    """Manages Guardian memory file operations."""
    
    # Possible locations for guardian file
    GUARDIAN_PATHS = [
        '.cursor/rules/guardian.mdc',
        '.windsurf/rules/guardian.md',
        '.github/copilot-instructions.md',
        'CLAUDE.md',
        'guardian.mdc',
    ]
    
    def __init__(self, project_path: str):
        self.project_path = Path(project_path).resolve()
        self.guardian_path = self._find_guardian_file()
        self._cache = None
        self._cache_time = None
    
    def _find_guardian_file(self) -> Optional[Path]:
        """Find the guardian memory file in the project."""
        for rel_path in self.GUARDIAN_PATHS:
            full_path = self.project_path / rel_path
            if full_path.exists():
                return full_path
        return None
    
    def exists(self) -> bool:
        """Check if guardian file exists."""
        return self.guardian_path is not None
    
    def read(self) -> Optional[str]:
        """Read the guardian memory file."""
        if not self.guardian_path:
            return None
        return self.guardian_path.read_text()
    
    def get_section(self, section_name: str) -> Optional[str]:
        """Get a specific section from the guardian file."""
        content = self.read()
        if not content:
            return None
        
        # Find section by header
        pattern = rf'^## {section_name}\s*\n(.*?)(?=^## |\Z)'
        match = re.search(pattern, content, re.MULTILINE | re.DOTALL)
        if match:
            return match.group(1).strip()
        return None
    
    def get_tech_stack(self) -> Dict[str, str]:
        """Get the tech stack from guardian file."""
        section = self.get_section('TECH_STACK')
        if not section:
            return {}
        
        stack = {}
        # Parse YAML-like format
        for line in section.split('\n'):
            if ':' in line and not line.strip().startswith('#'):
                key, value = line.split(':', 1)
                key = key.strip()
                value = value.strip()
                if key and value:
                    stack[key] = value
        return stack
    
    def get_files(self) -> Dict[str, Dict[str, Any]]:
        """Get the file registry from guardian file."""
        section = self.get_section('FILES')
        if not section:
            return {}
        
        files = {}
        for line in section.split('\n'):
            if ':' in line and '|' in line:
                path_part, rest = line.split(':', 1)
                path = path_part.strip()
                if '|' in rest:
                    purpose, funcs = rest.split('|', 1)
                    files[path] = {
                        'purpose': purpose.strip(),
                        'functions': [f.strip() for f in funcs.split(',')]
                    }
        return files
    
    def get_locked_decisions(self) -> List[Dict[str, str]]:
        """Get locked decisions from guardian file."""
        section = self.get_section('LOCKED')
        if not section:
            return []
        
        locked = []
        for line in section.split('\n'):
            if line.strip().startswith('-'):
                content = line.strip()[1:].strip()
                if ':' in content:
                    decision, value = content.split(':', 1)
                    locked.append({
                        'decision': decision.strip(),
                        'value': value.strip()
                    })
        return locked
    
    def add_change(self, description: str, files: List[str]) -> bool:
        """Add a change to the CHANGES section."""
        if not self.guardian_path:
            return False
        
        content = self.read()
        timestamp = datetime.now().strftime('%Y-%m-%d')
        files_str = ', '.join(files)
        new_entry = f"- {timestamp}: {description} | {files_str}"
        
        # Find CHANGES section and add entry
        pattern = r'(## CHANGES.*?```yaml\n)'
        match = re.search(pattern, content, re.DOTALL)
        if match:
            new_content = content[:match.end()] + new_entry + '\n' + content[match.end():]
            self.guardian_path.write_text(new_content)
            return True
        return False
    
    def add_file(self, path: str, purpose: str, functions: List[str]) -> bool:
        """Add a file to the FILES section."""
        if not self.guardian_path:
            return False
        
        content = self.read()
        funcs_str = ', '.join(functions) if functions else '-'
        new_entry = f"{path}: {purpose} | {funcs_str}"
        
        # Find FILES section and add entry
        pattern = r'(## FILES.*?```\n)'
        match = re.search(pattern, content, re.DOTALL)
        if match:
            new_content = content[:match.end()] + new_entry + '\n' + content[match.end():]
            self.guardian_path.write_text(new_content)
            return True
        return False
    
    def update_timestamp(self) -> bool:
        """Update the auto-sync timestamp."""
        if not self.guardian_path:
            return False
        
        content = self.read()
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M')
        
        # Update timestamp
        pattern = r'Auto-synced: [\d-]+ [\d:]+'
        new_content = re.sub(pattern, f'Auto-synced: {timestamp}', content)
        self.guardian_path.write_text(new_content)
        return True


class ChangeClassifier:
    """Classifies changes into categories."""
    
    CLASSIFICATIONS = {
        'PURE_UI_STYLE': {
            'description': 'Visual-only changes: colors, spacing, fonts, text',
            'rules': [
                '✅ Only touch CSS/styling and text',
                '❌ Do NOT create or delete files',
                '❌ Do NOT change logic or state',
            ]
        },
        'UI_BEHAVIOUR_TWEAK': {
            'description': 'Change when/how something happens',
            'rules': [
                '✅ Edit existing components/functions',
                '✅ Reuse existing patterns',
                '❌ Do NOT add new pages/routes',
                '❌ Limit changes to minimum files',
            ]
        },
        'NEW_FEATURE_FLOW': {
            'description': 'New screen, route, or user flow',
            'rules': [
                '✅ Can create new files',
                '✅ Confirm design first',
                '✅ Update guardian file after',
            ]
        }
    }
    
    # Keywords for classification
    # Priority: UI_STYLE > UI_BEHAVIOUR > NEW_FEATURE (for safety)
    
    UI_STYLE_KEYWORDS = [
        'color', 'لون', 'colour', 'size', 'حجم', 'font', 'خط', 'spacing', 'padding',
        'margin', 'text', 'نص', 'bigger', 'أكبر', 'smaller', 'أصغر',
        'style', 'css', 'align', 'محاذاة', 'blue', 'أزرق', 'red', 'أحمر'
    ]
    
    UI_BEHAVIOUR_KEYWORDS = [
        'toast', 'message', 'رسالة', 'validation', 'تحقق', 'error', 'خطأ',
        'condition', 'شرط', 'نجاح', 'success', 'alert', 'تنبيه',
        'enable', 'disable', 'show', 'hide', 'when', 'if', 'عندما'
    ]
    
    NEW_FEATURE_KEYWORDS = [
        'page', 'صفحة', 'screen', 'شاشة', 'feature', 'ميزة', 
        'system', 'نظام', 'integration', 'dashboard', 'لوحة',
        'authentication', 'auth', 'login', 'تسجيل'
    ]
    
    @classmethod
    def classify(cls, request: str) -> Dict[str, Any]:
        """Classify a user request."""
        request_lower = request.lower()
        
        # Count keyword matches
        ui_style_score = sum(1 for kw in cls.UI_STYLE_KEYWORDS if kw in request_lower)
        ui_behaviour_score = sum(1 for kw in cls.UI_BEHAVIOUR_KEYWORDS if kw in request_lower)
        new_feature_score = sum(1 for kw in cls.NEW_FEATURE_KEYWORDS if kw in request_lower)
        
        # Priority-based classification:
        # 1. UI_STYLE wins if any style keyword present (safest change)
        # 2. NEW_FEATURE wins if new feature keywords present (page, screen, etc.)
        # 3. UI_BEHAVIOUR wins if any behaviour keyword present
        # 4. Default to UI_BEHAVIOUR (safer than NEW_FEATURE)
        
        if ui_style_score > 0:
            classification = 'PURE_UI_STYLE'
        elif new_feature_score > 0:
            classification = 'NEW_FEATURE_FLOW'
        elif ui_behaviour_score > 0:
            classification = 'UI_BEHAVIOUR_TWEAK'
        else:
            # Default to behaviour tweak for unknown
            classification = 'UI_BEHAVIOUR_TWEAK'
        
        return {
            'classification': classification,
            'confidence': max(ui_style_score, ui_behaviour_score, new_feature_score, 1) / 3,
            **cls.CLASSIFICATIONS[classification]
        }


# MCP Server Tools
def create_mcp_tools():
    """Create MCP server with Guardian tools."""
    if not HAS_MCP:
        return None
    
    server = Server("guardian")
    
    @server.tool()
    async def guardian_classify_change(request: str, files_to_modify: List[str] = None, project_path: str = None) -> Dict:
        """
        🛡️ MANDATORY: Call this BEFORE making ANY code changes.
        
        Analyzes the user's request and returns classification, rules, and what you can/cannot do.
        """
        # Classify the request
        result = ChangeClassifier.classify(request)
        
        # Check guardian memory if project path provided
        if project_path:
            memory = GuardianMemory(project_path)
            if memory.exists():
                # Check for existing files
                existing_files = memory.get_files()
                if files_to_modify:
                    for file in files_to_modify:
                        if file in existing_files:
                            result['existing_file_found'] = {
                                'path': file,
                                'purpose': existing_files[file]['purpose']
                            }
                
                # Check locked decisions
                locked = memory.get_locked_decisions()
                result['locked_decisions'] = locked
        
        result['change_id'] = f"chg_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        return result
    
    @server.tool()
    async def guardian_get_tech_stack(project_path: str) -> Dict:
        """
        Get the project's tech stack from memory.
        Use this to know what technologies to use/suggest.
        """
        memory = GuardianMemory(project_path)
        if not memory.exists():
            return {'error': 'No guardian file found', 'suggestion': 'Run guardian scan first'}
        
        return memory.get_tech_stack()
    
    @server.tool()
    async def guardian_get_file_map(project_path: str) -> Dict:
        """
        Get the project's file registry from memory.
        Use this to know WHERE to create/modify files.
        """
        memory = GuardianMemory(project_path)
        if not memory.exists():
            return {'error': 'No guardian file found'}
        
        return memory.get_files()
    
    @server.tool()
    async def guardian_log_change(project_path: str, description: str, files_modified: List[str]) -> Dict:
        """
        Log a completed change to the guardian memory.
        Call this AFTER successfully completing a change.
        """
        memory = GuardianMemory(project_path)
        if not memory.exists():
            return {'error': 'No guardian file found'}
        
        success = memory.add_change(description, files_modified)
        memory.update_timestamp()
        
        return {'logged': success, 'description': description, 'files': files_modified}
    
    @server.tool()
    async def guardian_check_duplicate(project_path: str, purpose: str) -> Dict:
        """
        Check if a file with similar purpose already exists.
        Call this BEFORE creating any new file.
        """
        memory = GuardianMemory(project_path)
        if not memory.exists():
            return {'error': 'No guardian file found'}
        
        files = memory.get_files()
        purpose_lower = purpose.lower()
        
        matches = []
        for path, info in files.items():
            if purpose_lower in info['purpose'].lower() or info['purpose'].lower() in purpose_lower:
                matches.append({'path': path, 'purpose': info['purpose']})
        
        if matches:
            return {
                'duplicate_found': True,
                'matches': matches,
                'suggestion': 'Consider modifying existing file instead of creating new'
            }
        
        return {'duplicate_found': False}
    
    @server.tool()
    async def guardian_auto_register_file(project_path: str, file_path: str, purpose: str = None) -> Dict:
        """
        🔄 AUTO-SYNC: Register a new file in the FILES section.
        Call this AFTER creating any new file.
        
        This extracts functions automatically and updates the guardian snapshot.
        """
        memory = GuardianMemory(project_path)
        if not memory.exists():
            return {'error': 'No guardian file found'}
        
        # Import scanner to extract functions
        import sys
        from pathlib import Path
        sys.path.insert(0, str(Path(__file__).parent))
        from guardian_scanner import GuardianScanner
        
        # Get file info
        full_path = Path(project_path) / file_path
        if not full_path.exists():
            return {'error': f'File not found: {file_path}'}
        
        # Extract functions from file
        scanner = GuardianScanner(project_path)
        functions = scanner._extract_functions(str(full_path))
        
        # Auto-generate purpose if not provided
        if not purpose:
            purpose = full_path.stem.replace('_', ' ').replace('-', ' ')
        
        # Add to FILES section
        success = memory.add_file(file_path, purpose, functions)
        
        # Log the change
        memory.add_change(f"Added {file_path}", [file_path])
        memory.update_timestamp()
        
        return {
            'registered': success,
            'file': file_path,
            'purpose': purpose,
            'functions': functions
        }
    
    @server.tool()
    async def guardian_rescan(project_path: str) -> Dict:
        """
        🔄 AUTO-SYNC: Re-scan the entire project and update guardian.mdc.
        Call this when major changes have been made.
        """
        import sys
        from pathlib import Path
        sys.path.insert(0, str(Path(__file__).parent))
        from guardian_scanner import GuardianScanner
        
        try:
            scanner = GuardianScanner(project_path)
            result = scanner.scan()
            
            # Find existing guardian location
            memory = GuardianMemory(project_path)
            if memory.guardian_path:
                output_path = str(memory.guardian_path)
            else:
                output_path = str(Path(project_path) / 'guardian.mdc')
            
            scanner.save(output_path)
            
            return {
                'rescanned': True,
                'output': output_path,
                'files_count': len(result.get('files', {})),
                'tech_stack': result.get('tech_stack', {})
            }
        except Exception as e:
            return {'error': str(e)}
    
    return server


# Standalone functions for non-MCP usage
def classify_change(request: str) -> Dict:
    """Classify a change request (standalone version)."""
    return ChangeClassifier.classify(request)


def get_project_memory(project_path: str) -> Optional[Dict]:
    """Get full project memory (standalone version)."""
    memory = GuardianMemory(project_path)
    if not memory.exists():
        return None
    
    return {
        'tech_stack': memory.get_tech_stack(),
        'files': memory.get_files(),
        'locked': memory.get_locked_decisions(),
    }


if __name__ == '__main__':
    # Test the classifier
    test_requests = [
        "غير لون الزر للأزرق",
        "أضف رسالة نجاح بعد الحفظ",
        "أضف صفحة Settings جديدة",
        "Make the button bigger",
    ]
    
    print("🧪 Testing Change Classifier:\n")
    for req in test_requests:
        result = classify_change(req)
        print(f"Request: {req}")
        print(f"Classification: {result['classification']}")
        print(f"Rules: {result['rules'][:2]}")
        print()
