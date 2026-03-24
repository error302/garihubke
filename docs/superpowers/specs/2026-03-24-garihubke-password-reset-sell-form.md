# GariHub: Password Reset & Sell Form

## Overview

Two new features:
1. Email-based password reset using Resend
2. Full vehicle listing form on sell page

---

## Feature 1: Password Reset

### Database Schema

```prisma
model PasswordResetToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

### Pages

1. `/forgot-password` - Email input form
2. `/reset-password/[token]` - New password form

### API Endpoints

1. `POST /api/forgot-password`
   - Input: `{ email: string }`
   - Generate 6-digit reset code, store with email + 1hr expiry
   - Send email via Resend with reset link
   - Return success (always, to prevent email enumeration)

2. `POST /api/reset-password`
   - Input: `{ email: string, token: string, newPassword: string }`
   - Validate token exists and not expired
   - Hash new password with bcrypt
   - Update user password
   - Delete used token
   - Return success

### Environment Variables

```
RESEND_API_KEY=re_xxxxx
```

### Email Template

- Subject: "Reset your GariHub password"
- Body: "Click here to reset: https://garihub.com/reset-password/{token}"

---

## Feature 2: Sell Page (Full Listing Form)

### Database Schema

```prisma
model Listing {
  id          String   @id @default(cuid())
  userId      String
  title       String
  category    String
  make        String
  model       String
  year        Int
  price       Int
  mileage     Int?
  fuelType    String
  transmission String
  description String
  sellerName  String
  sellerPhone String
  sellerLocation String
  features    String   // JSON array
  images      String   // JSON array of URLs
  status      String   @default("pending") // pending, approved, rejected
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Page: `/sell`

**UI Layout:**
- Max-width container (2xl)
- Form card with sections
- Mobile-responsive

**Form Fields:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Title | text | yes | min 5 chars |
| Category | select | yes | cars/motorbikes/trucks/vans |
| Make | select | yes | from makes list |
| Model | select | yes | from models list |
| Year | number | yes | 1900-current |
| Price | number | yes | min 0 |
| Mileage | number | no | min 0 |
| Fuel Type | select | yes | petrol/diesel/electric/hybrid |
| Transmission | select | yes | manual/automatic |
| Description | textarea | yes | min 20 chars |
| Seller Name | text | yes | min 2 chars |
| Seller Phone | tel | yes | valid phone |
| Seller Location | text | yes | min 2 chars |
| Features | checkboxes | no | from features list |
| Image URLs | text (comma-separated) | no | valid URLs |

**Behavior:**
- Must be logged in to submit
- Show loading state on submit
- Success: redirect to `/dashboard/listings` with success message
- Error: show inline error message

### API: POST /api/listings

- Require authentication
- Validate all required fields
- Create listing with status "pending"
- Return created listing

---

## Acceptance Criteria

### Password Reset
- [ ] User can request password reset via email
- [ ] Reset email sent with valid link
- [ ] Invalid/expired tokens rejected
- [ ] Password successfully updated
- [ ] Works with email/password accounts only

### Sell Page
- [ ] Form displays all fields
- [ ] Client-side validation works
- [ ] Logged-in users can submit
- [ ] Non-logged-in users redirected to login
- [ ] Listing saved to database
- [ ] User redirected to dashboard after success

---

## Implementation Order

1. Add Prisma models (PasswordResetToken, Listing)
2. Add Resend to package.json
3. Create forgot-password page
4. Create reset-password/[token] page
5. Create API: POST /api/forgot-password
6. Create API: POST /api/reset-password
7. Create sell page with full form
8. Create API: POST /api/listings
9. Build and test
