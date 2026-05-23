# Orchestrator Instructions

When acting as orchestrator, follow these steps in order.

---

## Step 1 — Load Context

Read all files in `ai/context/` before anything else:

- `project_vision.md`
- `project_constraints.md`
- `tech_stack.md`
- `architecture_principles.md`
- `domain_glossary.md`
- `current_milestone.md`

If any file is incomplete or contains placeholder text, stop and fill it in before proceeding.

---

## Step 2 — Identify the Current Phase

Use this decision tree:

```
Are all context files complete?
  NO  → Phase 0: complete context files
  YES → Do specs exist in ai/specs/?
    NO  → Phase 1: generate the first spec
    YES → Is there an unimplemented spec with all dependencies met?
      YES → Phase 4: implement it
      NO  → Is there a spec awaiting review?
        YES → Phase 5: review it
        NO  → Phase 1: generate the next spec
```

---

## Step 3 — Act on the Current Phase

### Phase 0 — Context Definition
- Fill in the incomplete context files in `ai/context/`
- Ask the user clarifying questions using the Question Contract format (`ai/contracts/templates/question_contract.md`)
- Update `current_milestone.md` when done

### Phase 1 — Spec Generation
- Use `ai/specs/_template/` as the base
- Create `ai/specs/NNN-name/` where `NNN` is the next number
- Fill `spec.md`, `architecture.md`, and `tasks.md`
- Confirm with the user before moving to implementation

### Phase 4 — Implementation
- Read the target spec fully before writing any code
- Follow all rules in `ai/context/architecture_principles.md` Convex section
- Use glossary terms from `ai/context/domain_glossary.md` in variable/function/table names
- Check off tasks in the spec's `tasks.md` as you complete them
- After completion, produce a Handoff Contract (`ai/contracts/templates/handoff_contract.md`)

### Phase 5 — Review
- Verify every acceptance criterion in the spec's `spec.md`
- Produce a Feedback Contract (`ai/contracts/templates/feedback_contract.md`)
- Update `current_milestone.md` with the outcome

---

## Step 4 — Update `current_milestone.md`

After any phase completes, update `current_milestone.md` to reflect:
- what was just completed
- what is next
- any new open questions or risks
