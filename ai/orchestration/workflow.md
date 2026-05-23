# AI Workflow

This project follows a structured, incremental AI-native workflow:

```
Context → Specs → Architecture → Implementation → Review → Iteration
```

---

## Phase 0 — Context Definition

**Goal**: ensure shared understanding before writing any spec or code.

**Done when**: all files in `ai/context/` are filled in with project-specific content (no placeholder text).

**Artifacts**:
- `ai/context/project_vision.md`
- `ai/context/tech_stack.md`
- `ai/context/project_constraints.md`
- `ai/context/architecture_principles.md`
- `ai/context/domain_glossary.md`
- `ai/context/personas.md`
- `ai/context/current_milestone.md`

---

## Phase 1 — Spec Generation

**Goal**: define a small, scoped, independently implementable unit of work.

**Done when**: `ai/specs/NNN-name/spec.md` exists with clear acceptance criteria and no ambiguity.

**Rules**:
- One spec per feature area (e.g. "auth setup", "add book", "shelves")
- 3–8 specs total for this project
- Each spec must list its dependencies on prior specs
- Acceptance criteria must be checkable — no vague criteria like "works correctly"

**Naming**: `ai/specs/001-scaffold/`, `ai/specs/002-auth/`, etc.

---

## Phase 2 — Architecture Validation

**Goal**: confirm the spec's technical approach is sound before writing code.

**Done when**: `ai/specs/NNN-name/architecture.md` is filled in and reviewed.

**Check**:
- Does this use Convex-native patterns? (see `ai/context/architecture_principles.md`)
- Are table names and field names consistent with the domain glossary?
- Are all Convex function types correct? (query / mutation / action)
- Is auth scoped to `ctx.auth.getUserIdentity()` everywhere user data is touched?

---

## Phase 3 — Task Breakdown

**Goal**: break the spec into concrete implementation steps.

**Done when**: `ai/specs/NNN-name/tasks.md` has a checklist of specific, ordered tasks.

---

## Phase 4 — Implementation

**Goal**: deliver working, tested software that satisfies the spec's acceptance criteria.

**Rules**:
- Read the spec fully before writing the first line of code
- Check off tasks in `tasks.md` as you go
- Use glossary terms in all identifiers
- Never bypass Convex auth scoping
- Produce a Handoff Contract when complete

---

## Phase 5 — Review

**Goal**: validate correctness, maintainability, and spec completion.

**Done when**: all acceptance criteria in `spec.md` are checked off and a Feedback Contract is produced.

---

## Phase 6 — Iteration

After each spec completes:
1. Update `ai/context/current_milestone.md`
2. Close any resolved open questions
3. Add new risks or questions if discovered during implementation
4. Identify the next spec and return to Phase 1
