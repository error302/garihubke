# Phase 11: Blog/News Specification

## Overview

Add blog and news section for SEO and content marketing.

---

## 1. Features

### Blog Posts
- Title, content, featured image
- Categories: News, Buying Guide, Maintenance, Market Trends
- Author, publish date
- SEO metadata

### Pages
- `/blog` - List all posts
- `/blog/[slug]` - Individual post

### Content
- Vehicle buying guides
- Maintenance tips
- Market news
- Industry trends

---

## 2. Data Model

```typescript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: 'news' | 'buying-guide' | 'maintenance' | 'market';
  author: string;
  publishedAt: string;
}
```

---

## 3. Acceptance Criteria

- [ ] Blog listing page at /blog
- [ ] Individual blog post pages
- [ ] Category filtering
- [ ] SEO metadata for posts
- [ ] Sample blog posts added
- [ ] Build passes
