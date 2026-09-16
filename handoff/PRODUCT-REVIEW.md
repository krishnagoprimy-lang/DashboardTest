# Dashboard product review

## Preserve
- Explicit activation, employee-specific readiness, saved onboarding progress.
- Independent lifecycle and operational health, partial outage recovery.
- Shared integration state and employee channel permissions.
- Human takeover, separate notes and replies, persistent drafts.

## Findings and changes
- Missing email was used as a proxy for anonymous identity. Customer context now defines anonymity explicitly.
- Profiles and Inbox showed the same product history for different customers. Added per-customer context; missing browsing/cart information is stated as not recorded.
- Customer profiles repeated independent cards without a clear next action. Replaced them with grouped information and shopping activity, a notes area and Open conversation.
- Home and employee setup could display a second floating setup checklist. Suppressed the duplicate prompt on those surfaces.
- The single-store selector looked editable but did nothing. Replaced it with the current store label.
- Inbox fallback selection used original unread flags instead of saved state. It now honors saved read/unread changes.
- Audience search had no immediate reset action. Added Clear filters and aligned visitor email search with its label.
- Added semantic current-page navigation, narrower search controls and explicit mobile table scrolling.

## Remaining production work
This is a frontend prototype. Server-side conversation ownership, actual Shopify data, authentication, live tracking, message delivery and event attribution require production integration. The visitor view is a fixed labelled sample snapshot. Automated checks do not replace a full desktop/mobile interaction review.
