"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loading } from '../components/UI/Loading'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      setRedirecting(true)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      window.location.href = '/'
    } catch (error) {
      alert('Error logging in: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin} className="dashboard-card space-y-6">
          <h1 className="text-2xl font-bold text-white text-center mb-8">Swap Progress Login</h1>
          
          <div className="space-y-2">
            <label className="text-white/90">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input w-full"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-white/90">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input w-full"
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit"
            disabled={loading || redirecting}
            className="btn-apply w-full"
          >
            {loading ? 'Logging in...' : redirecting ? 'Redirecting...' : 'Login'}
          </button>
        </form>
      </div>
      {(loading || redirecting) && <Loading />}
    </main>
  )
} 