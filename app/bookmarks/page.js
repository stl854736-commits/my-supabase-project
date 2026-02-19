"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function Bookmarks() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
    } else {
      setUser(user)
      fetchBookmarks(user.id)
    }
  }

  async function fetchBookmarks(userId) {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: false })

    setBookmarks(data || [])
  }

  async function addBookmark() {
    if (!title || !url) return alert("Fill all fields")

    await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id
      }
    ])

    setTitle("")
    setUrl("")
    fetchBookmarks(user.id)
  }

  async function deleteBookmark(id) {
    await supabase.from("bookmarks").delete().eq("id", id)
    fetchBookmarks(user.id)
  }

  if (!user) return null

  return (
    <div className="bookmarks-container">

      {/* Header */}
      <div className="bookmarks-header">
        <div>
          <h1>My Bookmarks</h1>
          <p>Organize your saved links smartly</p>
        </div>

        <button 
          className="back-btn"
          onClick={() => router.push("/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Add Bookmark Card */}
      <div className="add-card">
        <input
          type="text"
          placeholder="Enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button onClick={addBookmark}>+ Add Bookmark</button>
      </div>

      {/* Bookmark List */}
      <div className="bookmark-grid">
        {bookmarks.length === 0 ? (
          <p className="empty-text">No bookmarks added yet.</p>
        ) : (
          bookmarks.map((b) => (
            <div key={b.id} className="bookmark-card">
              <h3>{b.title}</h3>
              <a href={b.url} target="_blank">{b.url}</a>

              <button 
                className="delete-btn"
                onClick={() => deleteBookmark(b.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  )
}
