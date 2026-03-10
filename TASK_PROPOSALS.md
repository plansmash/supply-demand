# Codebase Task Proposals

This document captures four focused, issue-ready tasks identified during a repository scan.

## 1) Typo Fix Task

### Title
Fix spelling mistakes in the Accessibility page copy.

### Context
The accessibility content contains visible spelling errors that reduce professionalism and can affect trust/readability for visitors.

### Steps to Reproduce
1. Open `/accessibility/` content source at `src/pages/accessibility.md`.
2. Locate the heading "Is the entrance acessible?" and paragraph text containing "Supply & Demad".

### Expected Behavior
Public-facing copy should use correct spelling (e.g., "accessible", "Demand").

### Actual Behavior
Typos are present in multiple places.

### Environment
- OS: Linux
- Runtime: Node/Eleventy project
- Environment: container workspace
- Branch: current working branch

### Proposed Direction (optional)
Correct the typos in place, preserving wording and structure.

### Acceptance Criteria
- [ ] "acessible" is corrected to "accessible".
- [ ] "Demad" is corrected to "Demand".
- [ ] Build output still succeeds (`npm run build`).

### Suggested Labels
- tech-debt

---

## 2) Bug Fix Task

### Title
Fix calendar date filtering so same-day events are always included.

### Context
The calendar helper intends to include "today" in future-date checks, but this can fail depending on time-of-day handling and timezone parsing.

### Steps to Reproduce
1. Review `src/assets/js/calendar.js` `isFutureDate(year, month, day)`.
2. Note that `new Date(year, month, day)` is compared against `this.today`.
3. Observe event dates parsed from ISO strings with local-time assumptions in related methods.

### Expected Behavior
Any event dated "today" should consistently appear in the calendar and grouped event lists.

### Actual Behavior
Date/time normalization can cause today’s events to be dropped in some runtime/timezone conditions.

### Environment
- OS: Linux
- Runtime: Browser JS in Eleventy-generated page
- Environment: container workspace
- Branch: current working branch

### Proposed Direction (optional)
Normalize both comparison operands to date-only values (or compare YYYY-MM-DD strings) to avoid time component drift.

### Acceptance Criteria
- [ ] Events dated today are included reliably.
- [ ] Recurring events for today are included reliably.
- [ ] Behavior is consistent regardless of local timezone offset.

### Suggested Labels
- bug

---

## 3) Documentation Discrepancy Task

### Title
Align privacy policy page with current hosting stack.

### Context
Repository docs describe Netlify + Eleventy, but the public privacy-policy page still states the site is hosted by Squarespace.

### Steps to Reproduce
1. Open `README.md` deployment section.
2. Open `src/pages/privacy-policy.md` and inspect the "Hosting Provider" section.

### Expected Behavior
Legal and policy copy should reflect the current platform and data flow.

### Actual Behavior
Privacy policy claims Squarespace hosting while project documentation states Netlify deployment.

### Environment
- OS: Linux
- Runtime: Markdown content rendered by Eleventy
- Environment: container workspace
- Branch: current working branch

### Proposed Direction (optional)
Update policy text to describe actual host/provider(s), analytics tooling, and any third-party processors currently in use.

### Acceptance Criteria
- [ ] Hosting provider language matches deployed architecture.
- [ ] Any provider-specific cookie/analytics references are verified and accurate.
- [ ] Content review confirms no outdated Squarespace-only claims remain.

### Suggested Labels
- documentation
- tech-debt

---

## 4) Test Improvement Task

### Title
Add automated unit tests for calendar recurrence and date filtering logic.

### Context
Core event-calendar behavior (recurrence parsing, today/future filtering, date inclusion) is complex and currently untested.

### Steps to Reproduce
1. Inspect `package.json` scripts.
2. Confirm there is no test script and no automated test suite.
3. Review `src/assets/js/calendar.js` for logic branches that can regress silently.

### Expected Behavior
Critical date logic should be covered by repeatable tests to prevent regressions.

### Actual Behavior
No automated tests currently verify calendar behavior.

### Environment
- OS: Linux
- Runtime: Node test runner or lightweight JS test framework
- Environment: container workspace
- Branch: current working branch

### Proposed Direction (optional)
Extract pure calendar/date helpers into a testable module and add focused tests for:
- Ordinal recurrence parsing (e.g., "3rd Wednesday")
- "Every <weekday>" expansion
- Inclusion of today’s date
- Exclusion of past dates

### Acceptance Criteria
- [ ] A `test` script exists in `package.json`.
- [ ] Tests cover recurrence parsing and today/future filtering edge cases.
- [ ] Tests run in CI/local with deterministic pass/fail behavior.

### Suggested Labels
- enhancement
- tech-debt
