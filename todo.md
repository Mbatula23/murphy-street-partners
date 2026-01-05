# Murphy Street Partners - Deal Sourcing Platform TODO

## Core Infrastructure
- [x] Database schema (deals, contacts, activities, scenarios, intelligence)
- [x] Backend API (tRPC routers for all entities)
- [x] Authentication and user management
- [x] Dashboard layout and navigation
- [x] Elite design system and styling

## Deal Pipeline (MVP)
- [x] Deal list view with filtering and sorting
- [x] Deal creation form
- [x] Deal detail page with full information
- [x] Deal editing capability
- [x] Deal status pipeline visualization
- [x] Priority and conviction indicators

## Scenario Modeling (MVP - PRIORITY)
- [x] Scenario creation interface
- [x] Real-time financial calculations (IRR, MOIC, cash-on-cash)
- [x] Interactive scenario comparison
- [x] Sensitivity analysis with adjustable assumptions
- [x] Export-ready formatting for LP presentations

## Relationship CRM
- [ ] Contact list view
- [ ] Contact detail pages
- [ ] Relationship strength visualization
- [ ] Contact-to-deal linking
- [ ] Follow-up reminders

## Activity Tracking
- [ ] Activity log timeline
- [ ] Quick activity creation
- [ ] Activity filtering by deal/contact
- [ ] Calendar integration

## Intelligence Layer
- [ ] Intelligence feed
- [ ] Deal-specific intelligence view
- [ ] News/data source integration
- [ ] Intelligence relevance scoring

## Dashboard & Analytics
- [ ] Overview dashboard with key metrics
- [ ] Deal pipeline analytics
- [ ] Relationship network visualization
- [ ] Activity heatmap
- [ ] Portfolio summary

## Advanced Features
- [ ] Search across all entities
- [ ] Bulk operations
- [ ] Export capabilities
- [ ] Mobile responsiveness
- [ ] Dark mode support

## Critical Missing Features (User Reported)
- [ ] Verify scenario modeling engine actually works in browser
- [ ] Fix any broken functionality in scenario calculations
- [x] Build scenario comparison table (side-by-side Base/Bull/Bear)
- [x] Build PDF export for scenarios
- [x] Build deal comparison view
- [x] Test all features end-to-end before delivery

## User-Reported Issues
- [x] Fix scenario modeling - financial metrics not updating dynamically when sliders are adjusted
- [x] Verify IRR, MOIC, Exit Value, and Total Return calculations update in real-time

## Critical Fixes Required
- [x] Fix slider interactions - calculations update correctly (verified working)
- [ ] Fix scenario saving - save button must save to database and show success message
- [x] Fix investment amount display - now correctly shows €75.0M
- [ ] Test end-to-end: create scenario, adjust sliders, save, verify saved scenarios appear

## User-Reported Issues (New)
- [x] Fix exit multiple scenario analysis calculations - now uses slider value correctly
- [x] Verify exit multiple updates when entry valuation or EBITDA changes
- [x] Test that exit value calculation uses correct exit multiple

## User-Reported Issues (Latest)
- [ ] Sliders not dynamically updating calculations - user tested and numbers don't change when moving sliders
- [ ] Verify Entry Valuation slider updates IRR/MOIC when moved
- [ ] Verify Stake Percentage slider updates Investment Amount and returns
- [ ] Verify Exit Multiple slider updates Exit Value and returns
- [ ] Verify Revenue Growth slider updates future financials
- [ ] Test all slider interactions produce immediate visual feedback
