# Phase 7: WhatsApp Integration & SEO Specification

## Overview

Add WhatsApp floating button for customer support and SEO improvements including public calculator and sitemap.

---

## 1. WhatsApp Integration

### Components
- `WhatsAppButton.tsx` - Floating button fixed to bottom-right
- Configurable WhatsApp number from env

### Features
- Opens WhatsApp Web or app with pre-filled message
- Visible on all pages
- Animated pulse effect to attract attention

---

## 2. SEO & Lead Magnet

### Public Calculator
- `/calculator` - Full page calculator without login
- "Save & Get Broker Quote" CTA to force signup

### Dynamic Metadata
- Auto-generate OG images for vehicle pages
- Dynamic titles: "2022 Toyota Prado for sale in Nairobi"

### Sitemap
- `app/sitemap.ts` - Dynamic sitemap.xml
- Includes all vehicles, pages

### robots.txt
- `app/robots.ts` - SEO robots.txt

---

## File Structure

```
/components
  WhatsAppButton.tsx

/app
  /calculator
    page.tsx          # Public calculator

  sitemap.ts          # Sitemap.xml
  robots.ts            # robots.txt

/public
  /images
    og-default.jpg     # Default OG image
```

---

## Acceptance Criteria

- [ ] WhatsApp floating button visible on all pages
- [ ] Click opens WhatsApp with message
- [ ] Public calculator at /calculator works without login
- [ ] Dynamic metadata on vehicle pages
- [ ] Sitemap generates correctly
- [ ] robots.txt configured
