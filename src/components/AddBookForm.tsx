import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export function AddBookForm() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const addBook = useMutation(api.bookEntries.addBook)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !author.trim()) return
    setSubmitting(true)
    try {
      await addBook({ title: title.trim(), author: author.trim() })
      setTitle('')
      setAuthor('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border p-4">
      <h2 className="mb-4 font-semibold">Add a book</h2>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Dune"
            required
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Frank Herbert"
            required
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={submitting || !title.trim() || !author.trim()}>
            Add
          </Button>
        </div>
      </div>
    </form>
  )
}
