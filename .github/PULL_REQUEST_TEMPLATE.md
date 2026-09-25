## Summary

Provide a concise summary of the changes proposed in this pull request. Explain the motivation behind the change, what problem it solves, and how it was implemented.

---

## Related Issue

Closes #
Fixes #

---

## Type of Change

Select all that apply:

- [ ] 🚀 **New Component**: Addition of a new animated UI primitive or WebGL shader
- [ ] 🐛 **Bug Fix**: Non-breaking fix for an existing component or layout issue
- [ ] ⚡ **Performance Optimization**: GPU shader tuning, GSAP memory cleanup, or bundle size reduction
- [ ] ✨ **Enhancement**: New variant, improved interaction physics, or additional prop
- [ ] ♿ **Accessibility**: ARIA improvement, keyboard focus management, or reduced-motion support
- [ ] 📝 **Documentation**: Improvements, examples, or corrections to `/docs` or README
- [ ] 🛠️ **Chore / Tooling**: Build configuration, dependencies, or GitHub workflows

---

## Component(s) Affected

- Component Name(s):
- File Path(s):

---

## Engineering Quality Checklist

Before submitting this pull request, verify each item:

- [ ] My code strictly adheres to the code style and conventions in [CONTRIBUTING.md](CONTRIBUTING.md).
- [ ] If GSAP was used, all timelines and listeners are scoped with `@gsap/react` `useGSAP()` or properly cleaned up on unmount.
- [ ] Zero Cumulative Layout Shift (CLS 0.0) is maintained during animations and state transitions.
- [ ] The component respects `prefers-reduced-motion` media queries and provides accessible fallback behavior.
- [ ] Full keyboard navigation (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`) is tested and operational.
- [ ] If a new component was added, it is properly registered with code snippet and metadata in `src/registry/index.ts`.
- [ ] I have executed `npm run lint` and resolved all lint errors.
- [ ] I have executed `npm run build` locally and the production build completes successfully.
- [ ] No uncleaned debug logs or unnecessary comments were left in the codebase.

---

## Visual Demonstration

Attach screenshots or screen recordings (GIF / WebM / MP4) demonstrating the component's visual states, interactions, and responsive behavior:

|      Desktop Preview      | Mobile / Breakpoint Preview |
| :-----------------------: | :-------------------------: |
| _Drop image / video here_ |  _Drop image / video here_  |
