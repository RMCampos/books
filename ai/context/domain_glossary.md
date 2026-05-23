# Domain Glossary

Consistent terminology improves AI consistency and implementation quality. Use these terms exactly.

| Term | Meaning |
|------|---------|
| **User** | An authenticated person (identified by Clerk `userId`) who owns a wishlist |
| **Book** | A canonical book record: title, author(s), ISBN, description, cover image reference. Sourced from external API or entered manually. |
| **Book Entry** | A user-specific record that links a User to a Book. Holds `status`, `rating`, `review`, `addedAt`, and `shelf` references. This is the core domain object. |
| **Reading Status** | One of three values: `want_to_read`, `currently_reading`, `read` |
| **Shelf** | A named collection created by the user to organize Book Entries (e.g. "Sci-Fi", "Gift Ideas"). A Book Entry can belong to zero or one shelf. |
| **Rating** | An integer from 1 to 5, stored on a Book Entry. Optional. |
| **Review** | A short free-text note on a Book Entry. Optional. |
| **Cover Image** | The book's cover art. Can be a URL from the external API or a file uploaded to Convex file storage. |
| **Wishlist** | The full set of a user's Book Entries. Not a separate data structure — just the collection of all their entries. |
| **Spec** | An incremental, scoped implementation unit used in this AI-assisted workflow |
| **Convex document** | A record stored in Convex's database, identified by a typed `Id<"tableName">` |
| **Action** | A Convex server function that can call external APIs (used for book search) |
| **Mutation** | A Convex server function that writes to the database |
| **Query** | A Convex server function that reads data and subscribes the client to live updates |
