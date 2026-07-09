# ARTORA v1.0 — Public Beta Release Documentation

Welcome to the official Public Beta of **Artora**, a premium global marketplace and creative guild designed to connect discerning collectors directly with independent artisans and master craftsmen.

This document serves as the comprehensive Release Candidate and Public Beta documentation package, confirming deployment preparedness, security postures, performance benchmarks, and a direct testing guide for users and curators alike.

---

## 🏷️ Version Overview
* **Application Version**: `ARTORA v1.0-beta`
* **Release Tier**: Public Beta Release Candidate (RC2)
* **Status**: Stable & Verified
* **Target Audience**: Fine-art collectors, physical slow-craft artisans, and platform administrators.
* **Support Email**: [joinartora@gmail.com](mailto:joinartora@gmail.com)

---

## 🏗️ Build & Environment Summary
The application is structured as a full-stack Node.js + Express + React framework powered by Vite.
* **Development Environment**: Verified and running in sandboxed Cloud Run containers.
* **Bundler & Compiler**: Built with Vite and TypeScript compiler (`tsc --noEmit`).
* **Linter Status**: Checked and verified with zero errors or unresolved warnings (`npm run lint`).
* **Port Configuration**: Multi-port reverse proxy routed through standard external port `3000`.
* **Build Command**: `npm run build` completes with high-efficiency chunk splitting and static compression.

---

## ✨ New Features Summary
Since the previous release candidate, several critical features have been finalized to support a secure and smooth public beta experience:

1. **Robust Direct Messaging Hub**:
   - Secure direct chat between collectors and creators.
   - Support for rich attachments (images, masterwork references).
   - Live message status tracking and thread management.

2. **Full-Featured Admin Curation Center**:
   - A dedicated workspace for platform administrators to review creators, moderate products, inspect reports, and view technical metrics.
   - Fully secured so only authorized administrator emails (e.g. `donistudioproduction@gmail.com`, `admin@artora.com`) can access it.

3. **Creator Studio Journal**:
   - Behind-the-scenes progress logs, pottery studio chronicles, and physical work diaries published by artisans to showcase the soul of their craft.

4. **Collector Promotion Ledger**:
   - Curated promo and coupon code validator embedded inside the checkout screen.
   - Accessible pre-validated trial codes:
     - `ARTORA10` (10% standard discount)
     - `GUILD50` ($50 collector incentive voucher)
     - `MASTERPIECE` (15% curator selection discount)
     - `SPRING24` (20% artisan spring curation discount)

---

## ⚡ Performance Improvements
* **Firestore Persistent Local Caching**: Configured Firestore with multi-tab persistent caching (`persistentLocalCache` and `persistentMultipleTabManager`). This enables instant subsequent page visits, offline support, and prevents duplicate Firestore billing reads.
* **Lazy-Loaded Masterpiece Media**: Added `loading="lazy"` attributes to heavy-weight image galleries (such as Featured Creators, Stories, and Curation sections) to ensure top-tier core web vitals and fast initial paint times on mobile networks.
* **State Preservation**: Safe local state persistence to prevent flash-of-unauthenticated-state on page refreshes.

---

## 🔒 Security Review & Route Protection
* **Multi-Tier Authorization Guards**:
  - Unauthenticated visitors can securely browse creators, categories, product catalogues, and artisan stories without an account.
  - Signed-in collectors can use wishlist functionality, carting, order placement, and direct messaging.
  - Certified creators have separate dashboard access to manage product catalogues, edit listings, view sales figures, and answer incoming commission threads.
  - Administrators are fully isolated; the system prevents non-admin users from accessing or displaying the admin dashboard, even with manual frontend navigation or state hacks.
* **Firestore Security Rules**:
  - Configured with strict rules that guarantee users can only read their own private profiles, messages, and order sheets, while public materials (artworks, creator profiles, categories, journals) are publicly readable but only writable by authorized creators or admins.

---

## 📱 Responsive & Accessibility Validation
Verified rendering and tactile touch targets across multiple form factors:
* **Mobile (Android/iPhone)**: Touch targets set to a minimum of 44px. Collapsible mobile-menu navigation sidebar with smooth animation transitions.
* **Tablet (iPad/Large Screen)**: Fluid layout structure using flexible grid templates to prevent horizontal scroll overflow or unpleasantly wide lines.
* **Desktop**: Full responsive multi-column layouts with hover state overlays providing active cursor feedback. High typography contrast ensures readability in all screen settings.

---

## 🐞 Bug Fix Summary
* **Admin Dashboard Workspace Guard**: Added strict `isAdmin` context double-validation inside `Dashboards.tsx` to completely isolate the admin panel and ensure unauthorized users are redirected to their corresponding workspace.
* **Feedback Support Email Visibility**: Integrated the official support email [joinartora@gmail.com](mailto:joinartora@gmail.com) directly into the Contact Studio Support dialog to make it easy for beta users to get in touch.
* **Footer Support Email Link**: Added the official support email dynamically to the footer under the newsletter system for persistent visibility.
* **Error Page Technical Indicators**: Appended technical support references to the client error pages so that users experiencing server downtime can instantly access Artora Help.

---

## 📘 Beta Tester Guide
Welcome, beta tester! Please use the following scenarios to test the end-to-end user journeys:

### Scenario A: The Collector (Buyer Journey)
1. **Explore the Guild**: Browse the landing page, view trending creations, or select a category like Pottery or Canvas Art.
2. **Search and Filter**: Type in your desired term or apply filter criteria (price, country, materials).
3. **Become a Member**: Create a collector account with a sample email address.
4. **Acquire Masterworks**: Add a product to your cart, navigate to the checkout page, type in code `GUILD50` to apply your voucher, and complete the order sheet.
5. **Direct Conversations**: From a product detail page, click "Inquire with Creator" to initiate a secure negotiation thread.

### Scenario B: The Artisan (Creator Journey)
1. **Onboard**: Register an account and check the option "I want to list my own custom craft or fine art" to assign yourself the `creator` role.
2. **Publish Artworks**: Access your Creator Hub and click "Add Product" to list a new fine-art creation with description, photos, and price.
3. **Verify Listings**: Make sure your products appear instantly in the marketplace, and verify you can edit or delete them as needed.

### Scenario C: The Administrator (Admin Journey)
1. **Access Control**: Log in using `donistudioproduction@gmail.com` or `admin@artora.com`.
2. **Verify Workspace**: Click on the Dashboard workspace toggle and select **Admin**. Ensure the full system metrics, active accounts list, and diagnostic ledger render flawlessly.

---

## 📢 Feedback & Support Contacts
We appreciate your time protecting and supporting global handcrafted livelihoods. Please send bugs, suggestions, and diagnostic reports directly to:
* **Support Email**: [joinartora@gmail.com](mailto:joinartora@gmail.com)
* **Feedback Form**: Open the user menu, click "Submit Feedback", and choose your topic (Support, Bug, Rate, or Feature Request).
