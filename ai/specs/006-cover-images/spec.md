# Spec 006: Cover Image Upload (Convex File Storage)

## Goal

A signed-in user can upload a custom cover image for any Book Entry, which is stored in Convex file storage and displayed in the wishlist.

---

## User Value

API cover thumbnails are often low-resolution or missing entirely for older or obscure books. Letting the user upload their own cover makes the wishlist feel personal and polished.

---

## Requirements

- User can upload an image file (JPEG or PNG) as the cover for any Book Entry
- The uploaded image is stored in Convex file storage (not an external service)
- The uploaded cover replaces the API cover URL for that Book Entry's display
- If no custom cover is uploaded, fall back to `books.coverUrl` (API thumbnail)
- If neither exists, show a placeholder
- User can remove a custom cover (reverts to API cover or placeholder)
- Uploaded covers are served via Convex's `getUrl` storage API

---

## Acceptance Criteria

- [ ] Selecting and submitting an image file calls `generateUploadUrl`, uploads to Convex storage, and calls `setCoverImage` mutation with the resulting storage ID
- [ ] The Book Entry's `coverStorageId` field is set after upload
- [ ] The cover image is displayed using a URL generated from `useQuery(api.bookEntries.getCoverUrl)` or equivalent
- [ ] Removing the custom cover clears `coverStorageId` from the entry and falls back to `books.coverUrl`
- [ ] Uploading a new cover when one already exists replaces it (old storage object deleted)
- [ ] The upload process shows a loading state and a success/error indicator
- [ ] TypeScript strict mode passes with no errors

---

## Dependencies

- Spec 001 (scaffold)
- Spec 002 (book-entry) — `book_entries.coverStorageId` field must exist

---

## Risks

- Convex file storage upload is a two-step process: generate upload URL → upload via HTTP PUT → store the resulting storage ID in a mutation. This is easy to get wrong on the first attempt; read the Convex docs carefully.
- Serving files requires calling `ctx.storage.getUrl(storageId)` inside a query — it cannot be called directly on the client. The query must return the URL.
- Old storage objects should be deleted when replaced to avoid orphaned files — this requires `ctx.storage.delete(oldStorageId)` in the mutation before storing the new ID.

---

## Notes

Convex file storage upload flow:
1. Client calls `generateUploadUrl` mutation → receives a one-time upload URL
2. Client HTTP PUTs the file to that URL → receives a storage ID
3. Client calls `setCoverImage` mutation with the storage ID → stored on `book_entries`

The storage ID is an opaque `Id<"_storage">` string. To display the image, the frontend calls a query that returns `ctx.storage.getUrl(storageId)`.
