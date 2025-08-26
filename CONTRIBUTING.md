# Contributing to TanStack Query Cache Helpers

Thank you for your interest in contributing to TanStack Query Cache Helpers! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/tanstack-query-vue-cache-helpers.git
   cd tanstack-query-vue-cache-helpers
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development**
   ```bash
   # Start the main development server
   pnpm dev
   
   # Start documentation development server
   pnpm docs:dev
   
   # Run tests
   pnpm test
   ```

## 📁 Project Structure

```
tanstack-query-vue-cache-helpers/
├── packages/
│   ├── core/              # Framework-agnostic core functions
│   ├── vue/               # Vue-specific composables
│   └── react/             # React-specific hooks (coming soon)
├── docs/                  # Documentation
├── tests/                 # Integration tests
└── examples/              # Usage examples
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests for specific package
pnpm --filter @tanstack-query-cache-helpers/vue test
```

### Writing Tests

- Tests should be written using Vitest
- Each function should have comprehensive test coverage
- Include both success and error scenarios
- Test edge cases and boundary conditions

## 📚 Documentation

### Building Documentation

```bash
# Start documentation development server
pnpm docs:dev

# Build documentation for production
pnpm docs:build

# Preview built documentation
pnpm docs:preview
```

### Documentation Guidelines

- All new features must include documentation
- Use clear, concise language
- Include practical examples
- Follow the existing documentation structure
- Update the API reference when adding new functions

## 🔧 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Write your code following the existing patterns
- Add tests for new functionality
- Update documentation as needed
- Follow the TypeScript and ESLint configurations

### 3. Commit Your Changes

Follow conventional commit format:

```bash
git commit -m "feat: add new cache helper function"
git commit -m "fix: resolve issue with deep item updates"
git commit -m "docs: update API documentation"
```

### 4. Push and Create a Pull Request

```bash
git push origin feature/your-feature-name
```

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] TypeScript types are properly defined

### Pull Request Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or breaking changes documented)
```

## 🎯 Areas for Contribution

### High Priority

- **Performance optimizations**: Improve cache operation performance
- **Additional framework support**: React, Svelte, etc.
- **Enhanced error handling**: Better error messages and recovery
- **Advanced caching patterns**: More sophisticated cache management strategies

### Medium Priority

- **Additional utility functions**: More specialized cache operations
- **Better TypeScript support**: Enhanced type inference and safety
- **Testing improvements**: More comprehensive test coverage
- **Documentation enhancements**: More examples and tutorials

### Low Priority

- **Build optimizations**: Smaller bundle sizes
- **Developer experience**: Better debugging tools
- **Community examples**: Real-world usage examples

## 🐛 Bug Reports

### Before Reporting

1. Check if the issue has already been reported
2. Try to reproduce the issue with the latest version
3. Check the documentation for solutions

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Node.js version: [e.g., 18.0.0]
- Package manager: [e.g., pnpm, npm, yarn]
- Framework: [e.g., Vue 3, React]

## Additional Information
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why this feature would be useful

## Proposed Implementation
How you think it could be implemented

## Alternatives Considered
Other approaches you've considered
```

## 📞 Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check the docs first for answers

## 📄 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 📝 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to TanStack Query Cache Helpers! 🎉
