# Task 009: SEO & Performance Engineering

**Priority:** Medium
**Prerequisite:** Task 004 (Router Refactor)

## Objective
Ensure the application is discoverable by search engines (Google/Bing) and looks professional when shared on social media (WhatsApp/Twitter/Facebook cards).

## The Problem
Currently, the app is a Single Page Application (SPA). Without specific metadata management, every page likely shares the same generic title "Vite App" or "Crubs", which hurts SEO and click-through rates.

## Solution Strategy

### 1. Metadata Management (`react-helmet-async`)
*   **Install**: `npm install react-helmet-async`
*   **Architecture**:
    *   Wrap `App` provider in `HelmetProvider`.
    *   Create a reusable `src/components/SEO.tsx` component.
        *   Props: `title`, `description`, `image?`.
        *   Renders: `<title>`, `<meta name="description">`, `<meta property="og:title">`, etc.

### 2. Implementation & coverage
*   **Global Default (`StoreLayout`)**: Set the base template: `%s | CRUBS BY ARYAN`.
*   **Home Page**: Title: "Premium Medical Apparel", Desc: "Top-tier clinical wear for professionals."
*   **Category Page**: Dynamic! Title: `{CategoryName}`, Desc: "Shop the best {CategoryName}..."
*   **Product Details**: Title: `{ProductName}`, Desc: `{ShortDescription}`.

### 3. Performance Audit
*   **Images**: Verify `loading="lazy"` on all images below the fold (Product Cards).
*   **Font Loading**: Ensure Google Fonts are preconnected (usually valid in `index.html`, but verify).

## Definition of Done
1.  Browser Tab shows "Apparel | CRUBS BY ARYAN" when navigating to `/apparel`.
2.  Inspecting the DOM `<head>` reveals unique `<meta name="description">` tags for different pages.
3.  Lighthouse Accessbility/SEO score improves.
