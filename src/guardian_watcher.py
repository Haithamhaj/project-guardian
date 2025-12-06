#!/usr/bin/env python3
"""
🛡️ Guardian File Watcher
Automatically updates guardian.mdc when project files change.

Usage:
    python guardian_watcher.py /path/to/project
    
    # Or run in background:
    nohup python guardian_watcher.py /path/to/project &
"""

import os
import sys
import time
import hashlib
from pathlib import Path
from datetime import datetime
from typing import Set, Dict

# Try to import watchdog
try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler, FileModifiedEvent, FileCreatedEvent, FileDeletedEvent
    HAS_WATCHDOG = True
except ImportError:
    HAS_WATCHDOG = False
    print("⚠️  Install watchdog: pip install watchdog")

# Import scanner
sys.path.insert(0, str(Path(__file__).parent))
from guardian_scanner import GuardianScanner


class GuardianWatcher(FileSystemEventHandler):
    """Watches for file changes and updates guardian.mdc."""
    
    # File extensions to watch
    WATCH_EXTENSIONS = {
        '.py', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
        '.java', '.kt', '.swift', '.go', '.rs', '.rb',
        '.css', '.scss', '.less', '.html', '.md',
        '.json', '.yaml', '.yml', '.toml',
    }
    
    # Directories to ignore
    IGNORE_DIRS = {
        'node_modules', '.git', '__pycache__', '.venv', 'venv',
        'dist', 'build', '.next', '.nuxt', 'coverage',
        '.cursor', '.windsurf', '.vscode', '.idea',
    }
    
    # Debounce time in seconds
    DEBOUNCE_TIME = 2.0
    
    def __init__(self, project_path: str):
        self.project_path = Path(project_path).resolve()
        self.scanner = GuardianScanner(str(self.project_path))
        self.last_update = 0
        self.pending_changes: Set[str] = set()
        self._file_hashes: Dict[str, str] = {}
        
        # Find guardian file location
        self.guardian_path = self._find_guardian_path()
        
        print(f"🛡️ Guardian Watcher started")
        print(f"📁 Project: {self.project_path}")
        print(f"📄 Guardian: {self.guardian_path}")
        print(f"👀 Watching: {', '.join(self.WATCH_EXTENSIONS)}")
        print()
    
    def _find_guardian_path(self) -> Path:
        """Find where to save guardian file."""
        locations = [
            self.project_path / '.cursor' / 'rules' / 'guardian.mdc',
            self.project_path / '.windsurf' / 'rules' / 'guardian.md',
            self.project_path / '.github' / 'copilot-instructions.md',
            self.project_path / 'CLAUDE.md',
            self.project_path / 'guardian.mdc',
        ]
        
        for loc in locations:
            if loc.exists():
                return loc
        
        # Default to root
        return self.project_path / 'guardian.mdc'
    
    def _should_watch(self, path: str) -> bool:
        """Check if this file should be watched."""
        path_obj = Path(path)
        
        # Check extension
        if path_obj.suffix.lower() not in self.WATCH_EXTENSIONS:
            return False
        
        # Check if in ignored directory
        for part in path_obj.parts:
            if part in self.IGNORE_DIRS:
                return False
        
        # Ignore guardian file itself
        if 'guardian' in path_obj.name.lower():
            return False
        
        return True
    
    def _get_file_hash(self, path: str) -> str:
        """Get hash of file content."""
        try:
            with open(path, 'rb') as f:
                return hashlib.md5(f.read()).hexdigest()
        except:
            return ""
    
    def _has_content_changed(self, path: str) -> bool:
        """Check if file content actually changed."""
        new_hash = self._get_file_hash(path)
        old_hash = self._file_hashes.get(path, "")
        
        if new_hash != old_hash:
            self._file_hashes[path] = new_hash
            return True
        return False
    
    def on_created(self, event):
        """Handle file creation."""
        if event.is_directory:
            return
        
        if self._should_watch(event.src_path):
            self._file_hashes[event.src_path] = self._get_file_hash(event.src_path)
            self._queue_update(event.src_path, "created")
    
    def on_modified(self, event):
        """Handle file modification."""
        if event.is_directory:
            return
        
        if self._should_watch(event.src_path):
            if self._has_content_changed(event.src_path):
                self._queue_update(event.src_path, "modified")
    
    def on_deleted(self, event):
        """Handle file deletion."""
        if event.is_directory:
            return
        
        if self._should_watch(event.src_path):
            self._file_hashes.pop(event.src_path, None)
            self._queue_update(event.src_path, "deleted")
    
    def _queue_update(self, path: str, action: str):
        """Queue an update with debouncing."""
        rel_path = Path(path).relative_to(self.project_path)
        self.pending_changes.add(f"{action}: {rel_path}")
        
        current_time = time.time()
        if current_time - self.last_update > self.DEBOUNCE_TIME:
            self._do_update()
    
    def _do_update(self):
        """Actually perform the update."""
        if not self.pending_changes:
            return
        
        changes = list(self.pending_changes)
        self.pending_changes.clear()
        self.last_update = time.time()
        
        print(f"\n🔄 Changes detected:")
        for change in changes[:5]:  # Show max 5
            print(f"   {change}")
        if len(changes) > 5:
            print(f"   ... and {len(changes) - 5} more")
        
        print(f"📝 Updating guardian.mdc...")
        
        try:
            # Re-scan project
            self.scanner = GuardianScanner(str(self.project_path))
            result = self.scanner.scan()
            
            # Generate and save
            self.scanner.save(str(self.guardian_path))
            
            timestamp = datetime.now().strftime('%H:%M:%S')
            print(f"✅ Updated at {timestamp}")
            print(f"   Files: {len(result.get('files', {}))}")
            
        except Exception as e:
            print(f"❌ Error updating: {e}")
    
    def flush(self):
        """Flush any pending changes."""
        if self.pending_changes:
            self._do_update()


def watch(project_path: str):
    """Start watching a project."""
    if not HAS_WATCHDOG:
        print("❌ Please install watchdog: pip install watchdog")
        sys.exit(1)
    
    project_path = Path(project_path).resolve()
    if not project_path.exists():
        print(f"❌ Path not found: {project_path}")
        sys.exit(1)
    
    handler = GuardianWatcher(str(project_path))
    observer = Observer()
    observer.schedule(handler, str(project_path), recursive=True)
    observer.start()
    
    print("Press Ctrl+C to stop watching.\n")
    
    try:
        while True:
            time.sleep(1)
            handler.flush()  # Flush pending changes
    except KeyboardInterrupt:
        print("\n🛑 Stopping watcher...")
        observer.stop()
    
    observer.join()
    print("👋 Guardian Watcher stopped.")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python guardian_watcher.py /path/to/project")
        sys.exit(1)
    
    watch(sys.argv[1])
