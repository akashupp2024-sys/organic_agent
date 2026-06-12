# Contributing to OrganicStore

Thank you for your interest in contributing to OrganicStore! We welcome contributions from everyone. Please follow these guidelines to help us maintain code quality and consistency.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/yourusername/organic-store.git
cd organic-store
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `style/` - Code style changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### 3. Setup Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# App runs at http://localhost:5173
```

## Making Changes

### Code Standards

- **JavaScript/JSX**:
  - Use 2-space indentation
  - Use camelCase for variables and functions
  - Use PascalCase for React components
  - Write descriptive variable/function names
  - Add comments for complex logic

- **CSS/Tailwind**:
  - Use utility-first approach (Tailwind classes)
  - Maintain custom color palette consistency
  - Use mobile-first responsive design
  - Group related classes logically

- **Component Structure**:
  ```jsx
  import { useState, useEffect } from 'react';
  import { Link } from 'react-router-dom';

  function ComponentName() {
    // State and context hooks
    const [state, setState] = useState(initialValue);

    // Event handlers
    const handleClick = () => {
      // Handler logic
    };

    // Effects
    useEffect(() => {
      // Effect logic
    }, [dependencies]);

    // Render
    return (
      <div>
        {/* JSX content */}
      </div>
    );
  }

  export default ComponentName;
  ```

### File Naming

- Components: PascalCase (e.g., `ProductCard.jsx`)
- Utilities/Hooks: camelCase (e.g., `useCartContext.js`)
- Data files: camelCase (e.g., `products.js`)
- CSS files: lowercase with hyphens (e.g., `custom-styles.css`)

## Commit Messages

Follow conventional commit format:

```
type(scope): brief description

Detailed explanation if needed.

Fixes #123
```

Types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (formatting)
- `refactor:` Code restructuring
- `perf:` Performance improvement
- `test:` Adding/updating tests
- `chore:` Build/dependency changes

Examples:
```
feat(shop): add price filter slider
fix(cart): correct total calculation
docs(readme): update deployment instructions
```

## Testing

Before submitting a PR:

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Check for errors**:
   ```bash
   npm run build -- --mode production
   ```

3. **Test functionality**:
   - Navigate through all pages
   - Test cart operations
   - Test filters and search
   - Check responsive design
   - Verify all links work

## Submitting Changes

### 1. Push Your Branch

```bash
git push origin feature/your-feature-name
```

### 2. Create a Pull Request

1. Go to the original repository
2. Click **New Pull Request**
3. Select your branch
4. Fill in the PR template:
   - **Title**: Clear, concise description
   - **Description**: What changes you made and why
   - **Type**: feat, fix, docs, etc.
   - **Testing**: How you tested your changes
   - **Screenshots**: If UI changes (optional)

### 3. PR Checklist

Before submitting, ensure:

- [ ] Code follows style guidelines
- [ ] Changes are well-commented
- [ ] No unnecessary console logs
- [ ] Responsive design tested
- [ ] All pages load without errors
- [ ] Commit messages are descriptive
- [ ] No breaking changes documented
- [ ] README updated if needed

## Handling Feedback

- Respond to feedback promptly
- Ask for clarification if needed
- Make requested changes
- Push updates to the same branch
- Don't create new PRs for feedback

## Feature Requests

1. Check existing issues first
2. Create a new issue with:
   - Clear title
   - Detailed description
   - Use case/benefit
   - Possible implementation approach
3. Add labels (feature, enhancement)
4. Engage in discussion

## Bug Reports

1. Check existing issues
2. Create a new issue with:
   - Descriptive title
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment (browser, OS)
   - Screenshots/error logs
3. Add "bug" label

## Documentation

Help improve documentation:

- Fix typos
- Clarify instructions
- Add examples
- Update outdated info
- Add comments to complex code
- Create tutorials or guides

## Areas to Contribute

### High Priority
- Performance optimizations
- Accessibility improvements
- Mobile responsiveness
- Bug fixes
- Documentation

### Great for Beginners
- Adding more products
- Improving error messages
- Updating styling
- Writing comments
- Documentation improvements

### Advanced
- Database integration
- Payment processing
- User authentication
- Advanced filtering
- Analytics implementation

## Development Tips

### Useful Commands

```bash
# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build

# Debugging
# Use React Developer Tools Chrome extension
# Use VS Code Debugger

# Code Quality
npm run build -- --mode production  # Production build check
```

### Helpful Resources

- [React Documentation](https://react.dev)
- [React Router Guide](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [MDN Web Docs](https://developer.mozilla.org)

## Code Review Process

1. Maintainers review your PR
2. Request changes if needed
3. You make updates
4. Approve and merge when ready
5. Your contribution is live! 🎉

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the project

## Questions?

- Open an issue for questions
- Comment on relevant PRs
- Check existing documentation
- Ask in discussions

---

Thank you for contributing to OrganicStore! 🌱

Together we're building a better, more sustainable way to shop for organic produce.
