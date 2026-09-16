# GoPrimy implementation rules

Home is the initial entry point. Before activation, Home and temporary First Steps use the same setup state and component. Returning merchants retain their saved setup location. Optional knowledge warnings do not prevent onboarding completion. Every state should make its relevant next action clear; operational screens need not have a dominant CTA.

## Prerequisites

All employees require Shopify, core sync, completed knowledge analysis and approved Store Information.

| Employee | Additional minimum prerequisites |
| --- | --- |
| Maya — Storefront Sales | At least one active product, approved product knowledge, enabled storefront widget and Store chat |
| Emma — Cart Recovery | Checkout data, reviewed consent source, Email or WhatsApp; each send additionally requires configured timing and verified recipient eligibility |
| Leo — Order Care | Order data, usable communication channel, approved shipping knowledge; returns and exchanges remain unavailable without applicable approved policies |
| Alex — Customer Support | Usable support surface and approved store information; unknown answers are escalated |

Lifecycle is Draft → Needs setup → Ready to activate → Active. Reviewed configuration, an enabled eligible channel and a completed preview are activation requirements. An explicit activation is always necessary.

## Permissions

| Action | Guided | Full |
| --- | --- | --- |
| Role-appropriate routine answers and recommendations | Allowed with required sources and channel permissions | Same |
| Recovery messages | Configured timing and verified consent/eligibility required | Same |
| Uncertain or unsupported answer | Escalate | Escalate |
| Financial or policy exception | Configured policy, verified eligibility, authorized tool and human approval required | Configured policy, verified eligibility and authorized tool required |
| Missing limits or required policy | Unavailable | Unavailable |

The model proposes; the platform authorizes. The prototype has no financial executor and cannot execute financial actions in either mode. No invented caps, prices or consent rules.

## Runtime and recovery

Active lifecycle is preserved independently of Healthy / Action required / Paused runtime health. Stop only affected functionality. A shared prerequisite can affect every channel. Show the precise recovery action. Reconnection restores only otherwise eligible functionality and never overrides manual pause. No messages are queued or replayed by this prototype; production must revalidate eligibility, expiry and duplicate-send protection before retrying any work.

## Results

Activation alone creates no conversations, orders or revenue. Show a waiting state until activity exists. Sample activity is explicitly loaded or selected through demo scenarios.

## Inbox

Drafts are saved separately per conversation and per customer-reply/internal-note mode. Internal notes never enter customer replies. Human takeover pauses AI; resuming AI releases the human assignment. Customer replies remain disabled while AI is handling the conversation. Read/unread choices persist and drive the Unread filter. Mobile uses conversation list → conversation → dismissible customer details.

Production sending must atomically check current conversation ownership server-side. The local prototype cannot guarantee multi-agent or multi-tab concurrency and sends no external messages.

## Acceptance review

Automated checks are in test-dashboard.mjs. Also review these interactions in the browser:

- Start a new merchant: Home shows the Shopify connection action; First Steps shares its progress.
- Refresh during scan and during employee setup; resume without losing progress.
- Activate with optional knowledge warnings; see Active with no invented results.
- Draft a reply for Olivia, switch to Ava and back, then reload; draft remains.
- Save an internal note while AI is running; it is labeled internal and does not become a customer message.
- Take over, reply, resume AI: assignment clears and customer composer disables.
- Mark a conversation read/unread and check the Unread filter.
- On mobile, open a conversation, open/close details and return to the list.
- Disconnect WhatsApp while Email remains valid; reconnect while employee is manually paused; pause must remain.
