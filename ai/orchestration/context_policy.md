# Context Policy

Context quality directly drives output quality. Follow these rules on every task.

---

## Rule 1 — Read Before Acting

Before implementing, writing specs, reviewing code, or proposing architecture, read:

| File | Why |
|------|-----|
| `ai/context/project_vision.md` | Understand what we're building and for whom |
| `ai/context/project_constraints.md` | Know the hard limits (Convex-only, Clerk, free tier, must-use features) |
| `ai/context/tech_stack.md` | Confirm the correct tools and Convex concept mapping |
| `ai/context/architecture_principles.md` | Follow Convex-specific rules and general design principles |
| `ai/context/domain_glossary.md` | Use correct terminology in all code and communication |
| `ai/context/current_milestone.md` | Know the current phase and open questions |

For implementation tasks, also read the relevant spec:
- `ai/specs/NNN-name/spec.md`
- `ai/specs/NNN-name/architecture.md`
- `ai/specs/NNN-name/tasks.md`

---

## Rule 2 — Use Glossary Terms Exactly

The glossary (`ai/context/domain_glossary.md`) defines terms like **Book Entry**, **Reading Status**, **Shelf**, **Cover Image**.

Use these exact terms in:
- Convex table names
- TypeScript type names
- Function names
- Variable names
- User-facing labels

Do not invent synonyms. "BookItem", "WishlistEntry", "ReadingItem" are wrong; "BookEntry" is correct.

---

## Rule 3 — Avoid Context Overload

Load only files relevant to the current task. Do not paste entire directories into context.

For a spec implementation: load `CLAUDE.md` + the target spec + `domain_glossary.md` + `architecture_principles.md`.

---

## Rule 4 — Surface Missing Context

If a required decision is missing from context files:
1. Use the Question Contract format (`ai/contracts/templates/question_contract.md`)
2. Document the assumption you're making until the user answers
3. Add the open question to `ai/context/current_milestone.md`

Never silently invent requirements.
