export type UserRole = "HOD" | "FACULTY"

export interface User {
  name: string
  email: string
  role: UserRole
  password: string
  initials: string
}

export const USERS: User[] = [
  { name: "Dr. Sharmila VJ",         email: "hodcse@licet.ac.in",           role: "HOD",     password: "licet@sharmila",      initials: "SJ" },
  { name: "Dr. Remegius Praveen L",   email: "reme@licet.ac.in",             role: "FACULTY", password: "licet@reme",          initials: "RP" },
  { name: "Dr. Arulmozhi P",          email: "arulmozhi.p@licet.ac.in",      role: "FACULTY", password: "licet@arulmozhi",     initials: "AP" },
  { name: "Dr. Gopalakrishnan K",     email: "drgk81@licet.ac.in",           role: "FACULTY", password: "licet@gopalakrishnan",initials: "GK" },
  { name: "Dr. Sharmila VJ (Member)", email: "sharmila.vj@licet.ac.in",      role: "FACULTY", password: "licet@sharmila",      initials: "SV" },
  { name: "Dr. Jainish GR",           email: "jainish.gr@licet.ac.in",       role: "FACULTY", password: "licet@jainish",       initials: "JG" },
  { name: "Ms. Delphy P",             email: "delphy.p@licet.ac.in",         role: "FACULTY", password: "licet@delphy",        initials: "DP" },
  { name: "Ms. Freesie Greta L",      email: "freesiegreta.l@licet.ac.in",   role: "FACULTY", password: "licet@freesie",       initials: "FG" },
  { name: "Ms. Jeevitha A",           email: "jeevitha.a@licet.ac.in",       role: "FACULTY", password: "licet@jeevitha",      initials: "JA" },
  { name: "Ms. Sathia Priya R",       email: "sathiapriya.r@licet.ac.in",    role: "FACULTY", password: "licet@sathia",        initials: "SP" },
  { name: "Ms. Daya Mary Mathew",     email: "dayamarymathew@licet.ac.in",   role: "FACULTY", password: "licet@daya",          initials: "DM" },
  { name: "Ms. Accelia S",            email: "accelia.s@licet.ac.in",        role: "FACULTY", password: "licet@accelia",       initials: "AS" },
  { name: "Ms. Priya A",              email: "priya.a@licet.ac.in",          role: "FACULTY", password: "licet@priya",         initials: "PA" },
  { name: "Ms. Reshma M",             email: "reshma.m@licet.ac.in",         role: "FACULTY", password: "licet@reshma",        initials: "RM" },
  { name: "Ms. Shirly Sudhakaran",    email: "shirlysudhakaran@licet.ac.in", role: "FACULTY", password: "licet@shirly",        initials: "SS" },
  { name: "Ms. Limsa Joshi",          email: "limsajoshi@licet.ac.in",       role: "FACULTY", password: "licet@limsa",         initials: "LJ" },
  { name: "Ms. Nirmala Santiago",     email: "iqac@licet.ac.in",             role: "FACULTY", password: "licet@nirmala",       initials: "NS" },
]

export function authenticate(email: string, password: string): User | null {
  return USERS.find(u => u.email === email && u.password === password) ?? null
}
