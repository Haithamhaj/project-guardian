#!/usr/bin/env python3
"""
🧪 Guardian Test Suite
Tests all Guardian functionality
"""

import os
import sys
import json
import tempfile
import shutil
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))

from guardian_scanner import GuardianScanner, scan_project
from guardian_mcp import ChangeClassifier, GuardianMemory, classify_change

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
RESET = '\033[0m'

def test_passed(name):
    print(f"{GREEN}✅ PASSED:{RESET} {name}")

def test_failed(name, reason):
    print(f"{RED}❌ FAILED:{RESET} {name}")
    print(f"   Reason: {reason}")

def test_section(name):
    print(f"\n{YELLOW}{'='*50}{RESET}")
    print(f"{YELLOW}🧪 {name}{RESET}")
    print(f"{YELLOW}{'='*50}{RESET}\n")


# ============================================================
# Test 1: Change Classifier
# ============================================================

def test_classifier():
    test_section("Test 1: Change Classifier")
    
    test_cases = [
        # (request, expected_classification)
        ("غير لون الزر للأزرق", "PURE_UI_STYLE"),
        ("Change button color to blue", "PURE_UI_STYLE"),
        ("Make the text bigger", "PURE_UI_STYLE"),
        ("اجعل الخط أكبر", "PURE_UI_STYLE"),
        
        ("أضف رسالة نجاح بعد الحفظ", "UI_BEHAVIOUR_TWEAK"),
        ("Show error toast on failure", "UI_BEHAVIOUR_TWEAK"),
        ("الزر يشتغل بس لما يكون في input", "UI_BEHAVIOUR_TWEAK"),
        
        ("أضف صفحة Settings جديدة", "NEW_FEATURE_FLOW"),
        ("Add user authentication", "NEW_FEATURE_FLOW"),
        ("Create a new dashboard page", "NEW_FEATURE_FLOW"),
    ]
    
    passed = 0
    failed = 0
    
    for request, expected in test_cases:
        result = classify_change(request)
        if result['classification'] == expected:
            test_passed(f"'{request[:30]}...' → {expected}")
            passed += 1
        else:
            test_failed(f"'{request[:30]}...'", 
                       f"Expected {expected}, got {result['classification']}")
            failed += 1
    
    print(f"\n📊 Results: {passed} passed, {failed} failed")
    return failed == 0


# ============================================================
# Test 2: Project Scanner
# ============================================================

def test_scanner():
    test_section("Test 2: Project Scanner")
    
    # Create a temp project
    with tempfile.TemporaryDirectory() as tmpdir:
        # Create mock project structure
        os.makedirs(f"{tmpdir}/src/components")
        os.makedirs(f"{tmpdir}/api/routes")
        
        # Create package.json
        with open(f"{tmpdir}/package.json", 'w') as f:
            json.dump({
                "name": "test-project",
                "dependencies": {
                    "react": "^18.2.0",
                    "tailwindcss": "^3.4.0"
                }
            }, f)
        
        # Create requirements.txt
        with open(f"{tmpdir}/requirements.txt", 'w') as f:
            f.write("fastapi==0.109.0\nuvicorn==0.27.0")
        
        # Create a React component
        with open(f"{tmpdir}/src/components/Button.jsx", 'w') as f:
            f.write("""
import React from 'react';

export function Button({ onClick, children }) {
    return <button onClick={onClick}>{children}</button>;
}

export function IconButton({ icon }) {
    return <button className="icon">{icon}</button>;
}
""")
        
        # Create a Python file
        with open(f"{tmpdir}/api/routes/auth.py", 'w') as f:
            f.write("""
from fastapi import APIRouter

router = APIRouter()

@router.post("/login")
async def login(username: str, password: str):
    return {"status": "ok"}

@router.get("/logout")
async def logout():
    return {"status": "logged out"}
""")
        
        # Run scanner
        try:
            scanner = GuardianScanner(tmpdir)
            result = scanner.scan()
            
            # Test: Tech stack detected
            if 'frontend' in result['tech_stack'] and 'React' in result['tech_stack']['frontend']:
                test_passed("Tech stack: React detected")
            else:
                test_failed("Tech stack detection", f"Got: {result['tech_stack']}")
            
            if 'backend' in result['tech_stack'] and 'FastAPI' in result['tech_stack']['backend']:
                test_passed("Tech stack: FastAPI detected")
            else:
                test_failed("Tech stack detection", f"Got: {result['tech_stack']}")
            
            # Test: Dependencies detected
            if 'react' in result['dependencies']['frontend']:
                test_passed("Dependencies: React version detected")
            else:
                test_failed("Dependencies", f"Got: {result['dependencies']}")
            
            # Test: Files detected
            files = result['files']
            button_found = any('Button.jsx' in f for f in files.keys())
            auth_found = any('auth.py' in f for f in files.keys())
            
            if button_found:
                test_passed("Files: Button.jsx detected")
            else:
                test_failed("File detection", "Button.jsx not found")
            
            if auth_found:
                test_passed("Files: auth.py detected")
            else:
                test_failed("File detection", "auth.py not found")
            
            # Test: Functions extracted
            for path, info in files.items():
                if 'Button.jsx' in path:
                    if 'Button' in info['functions'] or 'IconButton' in info['functions']:
                        test_passed("Functions: React functions extracted")
                    else:
                        test_failed("Function extraction", f"Got: {info['functions']}")
                    break
            
            # Test: MDC generation
            mdc_content = scanner.generate_mdc()
            if 'TECH_STACK' in mdc_content and 'FILES' in mdc_content:
                test_passed("MDC: File generated with correct sections")
            else:
                test_failed("MDC generation", "Missing sections")
            
            # Test: Save file
            output_path = scanner.save(f"{tmpdir}/guardian.mdc")
            if os.path.exists(output_path):
                test_passed("Save: guardian.mdc created")
            else:
                test_failed("Save", "File not created")
            
            return True
            
        except Exception as e:
            test_failed("Scanner execution", str(e))
            return False


# ============================================================
# Test 3: Guardian Memory
# ============================================================

def test_memory():
    test_section("Test 3: Guardian Memory")
    
    with tempfile.TemporaryDirectory() as tmpdir:
        # Create a guardian.mdc file
        guardian_content = """---
description: Test Guardian
globs: **/*
alwaysApply: true
---

# Test Project

## TECH_STACK
```yaml
frontend: React 18
backend: FastAPI
```

## FILES
```
src/App.jsx: main-app | render, useState
api/main.py: server | app, handler
```

## LOCKED
```yaml
- React: framework # locked: PERMANENT
- Port 8765: connection # locked: NEVER
```

## CHANGES
```yaml
- 2024-12-01: Initial | created
```

"""
        os.makedirs(f"{tmpdir}/.cursor/rules", exist_ok=True)
        with open(f"{tmpdir}/.cursor/rules/guardian.mdc", 'w') as f:
            f.write(guardian_content)
        
        # Test memory reading
        memory = GuardianMemory(tmpdir)
        
        if memory.exists():
            test_passed("Memory: Guardian file found")
        else:
            test_failed("Memory", "Guardian file not found")
            return False
        
        # Test tech stack extraction
        tech = memory.get_tech_stack()
        if 'frontend' in tech or 'React' in str(tech):
            test_passed("Memory: Tech stack extracted")
        else:
            test_failed("Tech stack extraction", f"Got: {tech}")
        
        # Test files extraction
        files = memory.get_files()
        if files:
            test_passed(f"Memory: {len(files)} files extracted")
        else:
            test_failed("Files extraction", "No files found")
        
        # Test locked decisions
        locked = memory.get_locked_decisions()
        if locked:
            test_passed(f"Memory: {len(locked)} locked decisions extracted")
        else:
            test_failed("Locked decisions", "No decisions found")
        
        return True


# ============================================================
# Test 4: Installation Script
# ============================================================

def test_install_script():
    test_section("Test 4: Installation Script")
    
    install_path = Path(__file__).parent.parent / 'install.sh'
    
    if install_path.exists():
        test_passed("install.sh exists")
        
        content = install_path.read_text()
        if 'guardian_scanner.py' in content:
            test_passed("install.sh references scanner")
        else:
            test_failed("install.sh content", "Missing scanner reference")
        
        if os.access(install_path, os.X_OK):
            test_passed("install.sh is executable")
        else:
            test_failed("install.sh permissions", "Not executable")
        
        return True
    else:
        test_failed("install.sh", "File not found")
        return False


# ============================================================
# Test 5: CLI (npx)
# ============================================================

def test_cli():
    test_section("Test 5: CLI (create-guardian)")
    
    cli_path = Path(__file__).parent.parent / 'bin' / 'create-guardian.js'
    pkg_path = Path(__file__).parent.parent / 'package.json'
    
    if cli_path.exists():
        test_passed("create-guardian.js exists")
    else:
        test_failed("CLI", "create-guardian.js not found")
        return False
    
    if pkg_path.exists():
        test_passed("package.json exists")
        
        with open(pkg_path) as f:
            pkg = json.load(f)
        
        if 'bin' in pkg and 'create-guardian' in pkg['bin']:
            test_passed("package.json has bin entry")
        else:
            test_failed("package.json", "Missing bin entry")
    else:
        test_failed("CLI", "package.json not found")
        return False
    
    return True


# ============================================================
# Run All Tests
# ============================================================

def main():
    print(f"\n{YELLOW}🛡️ GUARDIAN TEST SUITE{RESET}")
    print(f"{YELLOW}{'='*50}{RESET}\n")
    
    results = {
        "Classifier": test_classifier(),
        "Scanner": test_scanner(),
        "Memory": test_memory(),
        "Install Script": test_install_script(),
        "CLI": test_cli(),
    }
    
    print(f"\n{YELLOW}{'='*50}{RESET}")
    print(f"{YELLOW}📊 FINAL RESULTS{RESET}")
    print(f"{YELLOW}{'='*50}{RESET}\n")
    
    all_passed = True
    for name, passed in results.items():
        status = f"{GREEN}✅ PASSED{RESET}" if passed else f"{RED}❌ FAILED{RESET}"
        print(f"  {name}: {status}")
        if not passed:
            all_passed = False
    
    print()
    if all_passed:
        print(f"{GREEN}🎉 All tests passed! Guardian is ready.{RESET}")
    else:
        print(f"{RED}⚠️ Some tests failed. Please fix before publishing.{RESET}")
    
    return 0 if all_passed else 1


if __name__ == '__main__':
    sys.exit(main())
