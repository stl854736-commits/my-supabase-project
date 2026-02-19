"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function Login() {
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      router.push("/dashboard")
    }
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500 text-white p-12">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-6">
            Smart Bookmark
          </h1>
          <p className="text-lg opacity-90">
            Save, manage and access your favorite links from anywhere.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-1 items-center justify-center bg-gray-950 text-white px-6 py-12">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl shadow-xl">

          <h2 className="text-3xl font-semibold mb-6 text-center">
            Welcome Back
          </h2>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-xl font-semibold hover:scale-105 transition duration-300"
          >
            Continue with Google
          </button>

        </div>
      </div>

    </div>
  )
}
