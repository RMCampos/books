# Skill: Write Spec

## When to Use

Use this skill when a feature needs to be defined before implementation starts.

## Steps

1. Read `ai/context/current_milestone.md` to confirm this is the right next spec
2. Read `ai/context/domain_glossary.md` — all spec terminology must match it
3. Read `ai/context/project_constraints.md` — check which Convex features apply
4. Create `ai/specs/NNN-name/` (use the next sequential number)
5. Fill in `spec.md`, `architecture.md`, and `tasks.md` using `ai/specs/_template/` as the base
6. Update `ai/context/current_milestone.md` to list the new spec as active

## Good Specs

- **Goal** is one sentence describing what the user can do after this spec ships
- **Acceptance criteria** are checkboxes that can pass or fail — not vague descriptions
- **Dependencies** name the specific prior spec numbers, not just "auth must exist"
- **Scope** covers one Convex feature area — don't bundle auth + file storage + crons in one spec

## Convex-Specific Notes

- Name Convex tables and functions in the spec using glossary terms
- State which function type each operation uses: `query`, `mutation`, or `action`
- If file storage is involved, note whether covers are fetched by URL or uploaded
- If a scheduled function is involved, describe the trigger and what it does

## Avoid

- Specs longer than one printed page
- Acceptance criteria like "works correctly" or "looks good"
- Mixing unrelated Convex features in one spec
- Specs that can't be implemented without resolving an open question — resolve the question first
