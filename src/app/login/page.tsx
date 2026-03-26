"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { authenticateAny } from "@/lib/auth"
import { Scene3D } from "@/components/3d-scene"
import { Outfit, Caveat } from "next/font/google"

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "700", "900"] })
const caveat = Caveat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

const QUOTES = [
  "Empowering minds. Shaping the future.",
  "Where logic meets limitless creativity.",
  "Engineering solutions for a better tomorrow.",
  "Code. Compile. Create.",
  "Learning today, leading tomorrow."
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")
  const [mounted, setMounted]   = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)

  useEffect(() => { 
    setMounted(true) 
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length)
    }, 10000) // Shuffles every 10 seconds!
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    await new Promise(r => setTimeout(r, 800)) 
    
    const result = authenticateAny(formData.email.trim(), formData.password.trim())
    if (result) {
      localStorage.setItem("excelsior_user", JSON.stringify(result))
      router.push("/dashboard")
    } else {
      setError("Invalid email address or password.")
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <main className={`min-h-screen bg-[#010308] text-white relative overflow-hidden flex flex-col items-center justify-center ${outfit.className}`}>
      
      {/* Seamless 3D Background */}
      <div className="absolute inset-0 z-0">
        <Scene3D />
      </div>

      {/* Massive Centered Typography */}
      <div className="relative z-10 w-full text-center px-4 flex flex-col items-center justify-center pointer-events-none mt-[-10vh]">
        <motion.p 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
          className="text-sky-400 font-medium tracking-[0.2em] md:tracking-[0.3em] uppercase text-xs md:text-sm mb-4"
        >
          LICET - Department of Computer Science and Engineering
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.1, type: "spring" }}
          className="text-[14vw] md:text-[10vw] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-transparent tracking-widest drop-shadow-2xl"
        >
          EXCELSIOR
        </motion.h1>

        {/* Cozy Cursive Shuffling Sub-text */}
        <div className="h-12 mt-4 relative w-full flex justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={quoteIndex}
              initial={{ opacity: 0, filter: "blur(5px)", y: 5 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(5px)", y: -5 }}
              transition={{ duration: 1.2 }}
              className={`text-slate-300 text-2xl md:text-3xl font-medium tracking-wide absolute ${caveat.className}`}
            >
              {QUOTES[quoteIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Creative Credentials Box (Moved further down with mt-24) */}
      <div className="relative z-20 w-full max-w-sm px-6 mt-24 pointer-events-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden"
        >
          {/* Creative Inner Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <input 
                type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="Email Address" required
                className="w-full h-14 bg-transparent border-b border-white/20 text-base font-light text-white focus:outline-none focus:border-sky-400 transition-all placeholder:text-slate-500 placeholder:font-light px-2"
              />
            </div>

            <div className="space-y-2 relative">
              <input 
                type={showPass ? "text" : "password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                placeholder="Password" required
                className="w-full h-14 bg-transparent border-b border-white/20 text-base font-light text-white focus:outline-none focus:border-sky-400 transition-all placeholder:text-slate-500 placeholder:font-light px-2 pr-10"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs font-medium text-center bg-red-500/10 rounded-lg py-2">
                {error}
              </motion.div>
            )}

            <div className="pt-4">
              <button disabled={loading} type="submit"
                className="w-full h-14 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 rounded-[1.5rem] font-medium text-sm tracking-widest uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95 group">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  )
}
