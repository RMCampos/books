# Bookshelf — Claude Code Guide

## What This Project Is

A personal book wishlist app built on **Convex** (convex.dev), **TanStack Start** (React), and **Clerk** (auth). The primary goal is learning Convex deeply — every decision should favor Convex-native patterns.

## Before You Act on Any Task

Read these files in order. They are the source of truth for all decisions:

1. `ai/context/project_vision.md` — what we're building and why
2. `ai/context/project_constraints.md` — hard constraints and Convex features that must be used
3. `ai/context/tech_stack.md` — exact technology choices and Convex concept mapping
4. `ai/context/architecture_principles.md` — design rules, including the Convex-specific section
5. `ai/context/domain_glossary.md` — use these terms exactly; inconsistent naming breaks AI quality
6. `ai/context/current_milestone.md` — current phase and open questions

## How to Find the Right Spec

Specs live in `ai/specs/`. Each spec is a numbered directory: `ai/specs/NNN-name/`. Inside each:

- `spec.md` — goal, requirements, acceptance criteria, dependencies
- `architecture.md` — component breakdown, data flow, decisions
- `tasks.md` — implementation checklist

**Before implementing**, confirm:
- The spec's dependencies are already implemented
- There are no open questions in `current_milestone.md` that block this spec

## Key Rules (Non-Negotiable)

- **Convex-only backend.** No Express, no REST API, no other DB.
- **Auth scoping.** Every Convex query/mutation that touches user data must filter by `ctx.auth.getUserIdentity()`. Never trust a userId from the client.
- **Queries are reactive.** All list/detail views use `useQuery`. Do not fetch data in `useEffect`.
- **Actions for external I/O only.** `query` and `mutation` for everything internal; `action` only for calling the book search API.
- **TypeScript strict mode.** No `any`, no untyped Convex validators.
- **Use glossary terms in code.** Variable names, function names, and Convex table names must match the domain glossary.

## Workflow Summary

```
Context (ai/context/) → Specs (ai/specs/) → Implement → Review → Iterate
```

If context files are incomplete → fill them before writing specs.
If no spec exists for the next feature → generate one using `ai/specs/_template/`.
If a spec exists and dependencies are met → implement it.
If implementation is done → verify acceptance criteria in the spec's `spec.md`.

## Process Files

- `ai/orchestration/orchestrator.md` — how to coordinate across phases
- `ai/orchestration/workflow.md` — phase-by-phase decision logic
- `ai/orchestration/context_policy.md` — rules for reading and using context
- `ai/roles/` — behavior guidelines when acting in a specific role
- `ai/contracts/templates/` — structured formats for handoffs, questions, and feedback
