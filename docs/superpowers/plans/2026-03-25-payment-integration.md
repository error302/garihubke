# Phase 12: Payment Integration Implementation Plan

> **For agentic workers:** Use subagent-driven-development to implement this plan.

**Goal:** Add M-Pesa and payment integration for premium features.

**Tech Stack:** Next.js, React, Stripe, M-Pesa API

---

## Task 1: M-Pesa Integration

**Files:**
- Create: `lib/mpesa.ts`
- Create: `app/api/payments/mpesa/stk/route.ts`
- Create: `app/api/payments/mpesa/callback/route.ts`

- [ ] M-Pesa STK Push utility
- [ ] API routes for payment initiation and callback

- [ ] Commit: `git commit -m "feat: add M-Pesa integration"`

---

## Task 2: Payment UI

**Files:**
- Create: `components/PaymentModal.tsx`

- [ ] Payment method selection (M-Pesa/Stripe)
- [ ] Checkout flow

- [ ] Commit: `git commit -m "feat: add payment modal"`

---

## Task 3: Build and Push

- [ ] Run: `npm run build`
- [ ] Push: `git push origin main`
