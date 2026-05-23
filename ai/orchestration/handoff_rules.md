# Handoff Rules

A handoff is required whenever work moves between phases or roles.

---

## When to Produce a Handoff

| Transition | Handoff required? |
|------------|------------------|
| Implementation → Review | Yes |
| Architect → Developer (before starting a spec) | Yes |
| Developer → next spec (after completing one) | Yes |
| Mid-session context switch | Yes |
| Simple question or clarification | No |

---

## How to Produce a Handoff

Use the template at `ai/contracts/templates/handoff_contract.md`. Fill in every section — do not leave sections blank. Replace placeholder text with actual content from the current task.

---

## What Makes a Good Handoff

- **Specific** — references actual files, spec names, and Convex function names; not generic descriptions
- **Honest about blockers** — if something is partially done, say what's left
- **Explicit on decisions** — any tradeoff made during implementation must be documented so the next role doesn't reverse it silently
- **Actionable next step** — the recipient should know exactly what to do first

---

## Hidden Assumptions Kill Consistency

The most common cause of AI drift between sessions is an assumption made in one context that the next context doesn't know about. If you made a choice that isn't obvious from the code (e.g. "I stored the Clerk userId as a string instead of using `ctx.auth` because X"), put it in the handoff.
