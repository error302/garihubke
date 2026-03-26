# Phase 12: Payment Integration Specification

## Overview

Add payment options for premium features - M-Pesa (Kenya) and Stripe.

---

## 1. Payment Methods

### M-Pesa (Kenya)
- STK Push for instant payment
- Payment callback handling
- Phone number validation

### Stripe
- Card payments
- Already integrated for subscriptions

---

## 2. Features

### Payment for Premium
- One-time premium listing purchases
- Ad campaign payments
- Feature upgrades

### Checkout Flow
- Select payment method
- M-Pesa: Enter phone, send STK push
- Stripe: Enter card details
- Confirmation page

### API Routes
- `/api/payments/mpesa/stk` - Initiate STK push
- `/api/payments/mpesa/callback` - Payment callback
- `/api/payments/create` - Create payment intent

---

## 3. Acceptance Criteria

- [ ] M-Pesa STK Push integration
- [ ] Payment callback handling
- [ ] Payment method selection UI
- [ ] Checkout flow for premium features
- [ ] Payment confirmation
- [ ] Build passes
