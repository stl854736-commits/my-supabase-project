"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [bookmarkCount, setBookmarkCount] = useState(0)

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
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)

    if (!error && data) {
      setBookmarkCount(data.length)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (!user) return null

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">BookMark</h2>

        <nav>
          <button onClick={() => router.push("/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => router.push("/bookmarks")}>
            Manage Bookmarks
          </button>

          <button onClick={handleLogout} className="logout">
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Header */}
        <header className="header">
          <div>
            <h1>Welcome back 👋</h1>
            <p>Manage your bookmarks efficiently.</p>
          </div>

          <div className="profile">
            <img
              src={user.user_metadata?.avatar_url || "/profile.png"}
              alt="profile"
            />
            <div>
              <p className="name">
                {user.user_metadata?.full_name || "User"}
              </p>
              <p className="email">{user.email}</p>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="cards">

          <div className="card">
            <h3>Total Bookmarks</h3>
            <p className="count">{bookmarkCount}</p>
          </div>

          <div className="card">
            <h3>Account Status</h3>
            <p className="status">Active</p>
          </div>

          <div className="card">
            <h3>Platform</h3>
            <p>Web / Mobile</p>
          </div>

        </section>

      </main>
    </div>
  )
}
