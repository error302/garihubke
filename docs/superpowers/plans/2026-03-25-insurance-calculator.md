# Phase 10: Insurance Calculator Implementation Plan

> **For agentic workers:** Use subagent-driven-development to implement this plan.

**Goal:** Add insurance calculator to vehicle detail pages with cost breakdown and partner leads.

**Tech Stack:** Next.js, React, TypeScript

---

## Task 1: Create Insurance Calculator Component

**Files:**
- Create: `components/InsuranceCalculator.tsx`

- [ ] Create component with:
  - Vehicle value, year, type inputs (pre-filled)
  - Calculate comprehensive & third party premiums
  - Calculate road tax & registration
  - Display total estimated cost
  - Show insurer partner logos with "Get Quote" buttons

- [ ] Commit: `git commit -m "feat: add insurance calculator component"`

---

## Task 2: Integrate into Vehicle Page

**Files:**
- Modify: `app/vehicles/[id]/page.tsx`

- [ ] Add InsuranceCalculator below vehicle details

- [ ] Commit: `git commit -m "feat: integrate insurance calculator into vehicle page"`

---

## Task 3: Build and Push

- [ ] Run: `npm run build`
- [ ] Push: `git push origin main`
