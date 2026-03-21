import { USERS, type User } from "./users"
import { STUDENTS, type Student } from "./students"
import { supabase } from "./supabase"

export type AuthUser =
  | { type: "staff"; data: User }
  | { type: "student"; data: Student }

export function authenticateAny(email: string, password: string): AuthUser | null {
  const staff = USERS.find(u => u.email === email && u.password === password)
  if (staff) return { type: "staff", data: staff }
  const student = STUDENTS.find(s => s.email === email && s.password === password)
  if (student) return { type: "student", data: student }
  return null
}

export async function signIn(email: string, password: string): Promise<{
  authUser: AuthUser | null
  error: string | null
}> {
  // Validate locally first
  const authUser = authenticateAny(email.trim(), password.trim())
  if (!authUser) return { authUser: null, error: "Invalid credentials" }

  // Sign in with Supabase to get a real session token
  // This is needed for RLS policies to work
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password.trim()
  })

  if (error) {
    console.warn('Supabase signIn warning:', error.message)
    // Still allow login — local auth passed
  }

  return { authUser, error: null }
}

export async function signOut() {
  await supabase.auth.signOut()
  if (typeof window !== "undefined") {
    localStorage.removeItem("excelsior_user")
  }
}
