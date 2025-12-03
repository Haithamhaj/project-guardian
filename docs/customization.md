# 🔧 Customization Guide

How to customize Project Guardian for your project.

---

## Quick Customization Checklist

After installing, customize these sections in `guardian.mdc`:

- [ ] Project name
- [ ] Technology stack
- [ ] File structure
- [ ] Entry point / run commands
- [ ] Important decisions

---

## 1. Technology Stack

Find this section in `guardian.mdc`:

```yaml
Frontend: 
  Framework: {{FRONTEND_FRAMEWORK}}
  UI Library: {{UI_LIBRARY}}
  Styling: {{STYLING}}
```

Replace with your actual stack:

```yaml
Frontend: 
  Framework: React
  UI Library: Material-UI
  Styling: Styled Components
```

### Common Stacks

**React + Node:**
```yaml
Frontend: 
  Framework: React
  UI Library: Shadcn/ui
  Styling: Tailwind CSS
  State: Redux Toolkit

Backend:
  Framework: Express.js
  Database: PostgreSQL
  ORM: Prisma
```

**Next.js Fullstack:**
```yaml
Frontend: 
  Framework: Next.js 14
  UI Library: Radix UI
  Styling: Tailwind CSS

Backend:
  API: Next.js API Routes
  Database: Supabase
  Auth: NextAuth.js
```

**Python + React:**
```yaml
Frontend: 
  Framework: React
  UI Library: Chakra UI
  Styling: CSS Modules

Backend:
  Framework: FastAPI
  Database: SQLite
  ORM: SQLAlchemy
```

---

## 2. File Structure

Map your actual project structure:

```
your-project/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API calls
│   ├── utils/          # Helper functions
│   └── styles/         # Global styles
├── api/
│   ├── routes/         # API endpoints
│   └── models/         # Database models
└── public/             # Static assets
```

### Tips:
- Include only important directories
- Add brief descriptions
- Mark entry points clearly

---

## 3. Run Commands

Be specific about how to run the project:

```bash
# Good ✅
cd frontend && npm run dev
cd backend && python main.py

# Bad ❌
npm start  # Which folder? What port?
```

Include:
- Development mode
- Production build
- Database setup
- Environment setup

---

## 4. Decision Log

Document important decisions:

```markdown
| Date | Decision | Reason | Locked? |
|------|----------|--------|---------|
| 2024-01 | React over Vue | Team expertise | 🔒 Yes |
| 2024-01 | SQLite for MVP | Simplicity | No |
| 2024-02 | Tailwind CSS | Rapid prototyping | 🔒 Yes |
```

### What to Lock?
- Core framework choices
- Language decisions
- Architecture patterns

### What Not to Lock?
- Libraries that might change
- Experimental features
- MVP shortcuts

---

## 5. Debug Toolkit Setup

### Basic Integration (React)

```javascript
// In your main App file
import { useEffect } from 'react';

// Import toolkit
import './developer-toolkit/diagnostics';
import './developer-toolkit/logger';
import './developer-toolkit/networkMonitor';

function App() {
  useEffect(() => {
    // Start monitoring
    if (window.networkMonitor) {
      window.networkMonitor.start();
    }
    
    // Log app start
    if (window.logger) {
      window.logger.info('Application started');
    }
  }, []);

  return (/* your app */);
}
```

### Adding Toolkit UI

```javascript
import ToolkitView from './developer-toolkit/ToolkitView';

// Add route or tab
<Route path="/dev-tools" element={<ToolkitView />} />
```

### Keyboard Shortcut

```javascript
useEffect(() => {
  const handleKeyDown = (e) => {
    // Cmd+Shift+D or Ctrl+Shift+D
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
      navigate('/dev-tools');
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

---

## 6. IDE-Specific Setup

### Cursor
```
.cursor/rules/guardian.mdc
```

### Windsurf
```
.windsurf/rules/guardian.md  # Note: .md not .mdc
```

### VS Code + Copilot
```
.github/copilot-instructions.md
```

### Claude Code
```
CLAUDE.md  # In project root
```

### Multiple IDEs

You can support all by creating symlinks or copies:

```bash
# Create main file
cp guardian.mdc .cursor/rules/

# Create copies for other IDEs
cp .cursor/rules/guardian.mdc .windsurf/rules/guardian.md
cp .cursor/rules/guardian.mdc .github/copilot-instructions.md
cp .cursor/rules/guardian.mdc CLAUDE.md
```

---

## 7. Team Usage

### Shared Configuration

Commit these to git:
```
.cursor/rules/guardian.mdc  ✅
.windsurf/rules/            ✅
.github/                    ✅
developer-toolkit/          ✅
```

Don't commit:
```
guardian-reports/           ❌ (local diagnostics)
```

### .gitignore Addition

```gitignore
# Project Guardian local reports
guardian-reports/
**/guardian-reports/
```

---

## 8. Troubleshooting Customization

### Agent Not Reading File

1. Check file location matches your IDE
2. Restart IDE
3. Start new chat session

### Variables Not Replaced

Search for `{{` in the file - replace all placeholders:
```bash
grep -n "{{" guardian.mdc
```

### Conflicts with Existing Rules

If you have other rule files:
1. Merge relevant content into guardian.mdc
2. Or keep separate and reference each other

---

## Need Help?

- Open an issue: [GitHub Issues](https://github.com/project-guardian/core/issues)
- Tag with `[Customization]`

---

*🛡️ Project Guardian - Customized for Your Success*

---

<div align="center">

**A Product by [Imperfect Success](https://imperfectsuccess.com)**

*No Medals. Just Real Progress.*

</div>
