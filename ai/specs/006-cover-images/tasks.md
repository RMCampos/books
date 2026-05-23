# Tasks: Spec 006 — Cover Images

## Schema
- [ ] Confirm `book_entries` has `coverStorageId: v.optional(v.id("_storage"))` (from spec 002)
- [ ] No schema changes needed

## Convex Functions
- [ ] Add `generateUploadUrl` mutation to `convex/bookEntries.ts` (auth guard + `ctx.storage.generateUploadUrl()`)
- [ ] Add `setCoverImage` mutation: auth + ownership check + delete old storageId if exists + patch
- [ ] Add `removeCoverImage` mutation: auth + ownership check + delete storageId + clear field
- [ ] Add `getCoverUrl` query: returns `ctx.storage.getUrl(storageId)` — handle null return

## Frontend
- [ ] Create `CoverUploadButton` component implementing the 3-step upload flow (generateUrl → PUT → setCoverImage)
- [ ] Add loading state during upload
- [ ] Create `CoverImage` component with priority fallback: stored cover → API cover URL → placeholder
- [ ] Add remove cover option
- [ ] Integrate both into `BookEntryCard`

## Validation
- [ ] Verify all acceptance criteria in `spec.md`
- [ ] Upload image → appears on card → check `coverStorageId` in Convex dashboard
- [ ] Upload second image → first storage object is deleted (check in Convex dashboard > Storage)
- [ ] Remove cover → falls back to API cover or placeholder
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Confirm live reactivity: upload in one tab → cover updates in other tab
