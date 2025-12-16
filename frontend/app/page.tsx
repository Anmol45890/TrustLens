"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Upload, Zap, Shield, Brain, Waves, Sparkles, Eye } from "lucide-react"

/* ================= TYPES ================= */
type AnalysisResult = {
  deception_probability: number
  explanation: string
}

/* ================= PARTICLE FIELD ================= */
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const colors = [
      "rgba(14, 165, 233, 0.6)",
      "rgba(168, 85, 247, 0.5)",
      "rgba(45, 212, 191, 0.4)",
      "rgba(236, 72, 153, 0.3)",
    ]

    const initParticles = () => {
      const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000)
      particlesRef.current = []
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    const drawParticle = (p: Particle) => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.fill()
    }

    const drawConnections = () => {
      const particles = particlesRef.current
      const connectionDistance = 150
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.15
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(14, 165, 233, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    const updateParticles = () => {
      const particles = particlesRef.current
      const mouse = mouseRef.current
      particles.forEach((p) => {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 200) {
          const force = (200 - distance) / 200
          p.vx -= (dx / distance) * force * 0.02
          p.vy -= (dy / distance) * force * 0.02
        }
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy *= 0.99
        p.vx += (Math.random() - 0.5) * 0.05
        p.vy += (Math.random() - 0.5) * 0.05
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)
      gradient.addColorStop(0, "rgba(14, 165, 233, 0.03)")
      gradient.addColorStop(0.5, "rgba(168, 85, 247, 0.02)")
      gradient.addColorStop(1, "transparent")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      drawConnections()
      particlesRef.current.forEach(drawParticle)
      updateParticles()
      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    resize()
    initParticles()
    animate()
    window.addEventListener("resize", () => { resize(); initParticles() })
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
}

/* ================= ORBITAL RINGS ================= */
const OrbitalRings = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(14,165,233,0.2)_0%,rgba(168,85,247,0.1)_50%,transparent_70%)] blur-3xl" />
    </div>
    {[1, 2, 3].map((ring) => (
      <motion.div
        key={ring}
        className="absolute top-1/2 left-1/2"
        style={{
          width: `${200 + ring * 150}px`,
          height: `${200 + ring * 150}px`,
          marginLeft: `-${(200 + ring * 150) / 2}px`,
          marginTop: `-${(200 + ring * 150) / 2}px`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20 + ring * 10, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute inset-0 rounded-full border opacity-20"
          style={{
            borderColor: ring === 1 ? "#0ea5e9" : ring === 2 ? "#a855f7" : "#ec4899",
            transform: `rotateX(70deg) rotateZ(${ring * 15}deg)`,
          }}
        />
        <motion.div
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: "0%",
            left: "50%",
            marginLeft: "-4px",
            marginTop: "-4px",
            backgroundColor: ring === 1 ? "#0ea5e9" : ring === 2 ? "#a855f7" : "#ec4899",
            boxShadow: `0 0 10px ${ring === 1 ? "#0ea5e9" : ring === 2 ? "#a855f7" : "#ec4899"}, 0 0 20px ${ring === 1 ? "#0ea5e9" : ring === 2 ? "#a855f7" : "#ec4899"}`,
          }}
        />
      </motion.div>
    ))}
    {[
      { x: "20%", y: "30%", size: 100, color: "#0ea5e9", delay: 0 },
      { x: "80%", y: "20%", size: 80, color: "#a855f7", delay: 1 },
      { x: "70%", y: "70%", size: 120, color: "#2dd4bf", delay: 2 },
      { x: "15%", y: "75%", size: 60, color: "#0ea5e9", delay: 1.5 },
    ].map((orb, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-3xl"
        style={{ left: orb.x, top: orb.y, width: orb.size, height: orb.size, background: `${orb.color}26` }}
        animate={{ y: [0, -30, 0], scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, delay: orb.delay, ease: "easeInOut" }}
      />
    ))}
  </div>
)

/* ================= AUDIO WAVEFORM ================= */
const AudioWaveform = ({ isActive = false }: { isActive?: boolean }) => (
  <div className="flex items-center justify-center gap-[3px] h-16">
    {Array.from({ length: 24 }).map((_, i) => (
      <motion.div
        key={i}
        className="w-1 rounded-full bg-gradient-to-t from-cyan-500 via-purple-500 to-pink-500"
        initial={{ height: 8 }}
        animate={isActive ? { height: [8, Math.random() * 48 + 16, 8], opacity: [0.4, 1, 0.4] } : { height: 8, opacity: 0.3 }}
        transition={{ duration: 0.5 + Math.random() * 0.3, repeat: isActive ? Infinity : 0, delay: i * 0.05, ease: "easeInOut" }}
      />
    ))}
  </div>
)

/* ================= MAIN COMPONENT ================= */
export default function TrustLensPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  /* ================= RECORDING ================= */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch {
      alert("Microphone access denied")
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  /* ================= ANALYSIS ================= */
  const analyzeAudio = async (blob: Blob) => {
    setIsAnalyzing(true)
    const formData = new FormData()
    formData.append("file", blob, "recording.webm")

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze/audio", {
        method: "POST",
        body: formData,
      })

      const data: AnalysisResult = await res.json()
      setAnalysisResult(data)
    } catch {
      alert("Backend not running")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) analyzeAudio(file)
  }

  const prob = analysisResult?.deception_probability ?? 0

  /* ================= UI HELPERS ================= */
  const getResultConfig = (p: number) => {
    if (p < 33) return { color: "text-emerald-400", label: "Truth Detected", gradient: "from-emerald-500 to-teal-500", glow: "shadow-[0_0_30px_rgba(16,185,129,0.4)]", ringColor: "#10b981" }
    if (p < 67) return { color: "text-amber-400", label: "Inconclusive", gradient: "from-amber-500 to-orange-500", glow: "shadow-[0_0_30px_rgba(245,158,11,0.4)]", ringColor: "#f59e0b" }
    return { color: "text-rose-400", label: "Deception Detected", gradient: "from-rose-500 to-pink-500", glow: "shadow-[0_0_30px_rgba(244,63,94,0.4)]", ringColor: "#f43f5e" }
  }

  const features = [
    { icon: Brain, title: "Neural Analysis", desc: "Deep learning voice pattern recognition" },
    { icon: Zap, title: "Real-time Processing", desc: "Instant audio analysis results" },
    { icon: Shield, title: "Military-grade", desc: "Advanced deception detection algorithms" },
  ]

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Orbitron', sans-serif; }
        .glass { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.1); }
        .glass-strong { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(32px); border: 1px solid rgba(255,255,255,0.15); }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .animate-shimmer { animation: shimmer 2s infinite linear; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%); background-size: 200% 100%; }
      `}</style>

      <ParticleField />
      <OrbitalRings />

      <div className="fixed inset-0 bg-gradient-to-b from-[#030712] via-transparent to-[#030712] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      <div className="relative z-10">
        {/* ================= HERO ================= */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="text-center max-w-4xl mx-auto">
            <motion.div className="relative w-32 h-32 mx-auto mb-8" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30" />
              <div className="absolute inset-2 rounded-full border border-purple-500/40" />
              <div className="absolute inset-4 rounded-full border border-cyan-500/20" />
              <motion.div className="absolute inset-0 flex items-center justify-center" animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
                <Eye className="w-12 h-12 text-cyan-400" strokeWidth={1.5} />
              </motion.div>
            </motion.div>

            <motion.h1 className="font-display text-6xl md:text-8xl font-bold tracking-wider mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Trust</span>
              <span className="text-white">Lens</span>
            </motion.h1>

            <motion.p className="text-xl md:text-2xl text-slate-400 mb-4 font-light tracking-wide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
              AI-Powered Voice Deception Detection
            </motion.p>

            <motion.div className="flex items-center justify-center gap-2 text-sm text-cyan-400/80 mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}>
              <Sparkles className="w-4 h-4" />
              <span className="tracking-widest uppercase">Next-Gen Truth Analysis</span>
              <Sparkles className="w-4 h-4" />
            </motion.div>

            <motion.button
              onClick={() => document.getElementById("record")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative px-10 py-4 rounded-full overflow-hidden font-display tracking-wider text-sm uppercase"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 animate-shimmer" />
              <div className="absolute inset-[1px] rounded-full bg-[#030712]/20 backdrop-blur-sm" />
              <span className="relative z-10 flex items-center gap-3 text-white">
                <Waves className="w-5 h-5" />
                Begin Analysis
              </span>
            </motion.button>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto w-full" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}>
            {features.map((feature, i) => (
              <motion.div key={feature.title} className="glass rounded-2xl p-6 group hover:border-cyan-500/30 transition-all duration-500" whileHover={{ y: -5, scale: 1.02 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.1 }}>
                <feature.icon className="w-10 h-10 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-lg text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2">
              <motion.div className="w-1.5 h-2 rounded-full bg-cyan-400" animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} />
            </div>
          </motion.div>
        </section>

        {/* ================= RECORD ================= */}
        <section id="record" className="min-h-screen flex items-center justify-center px-6 py-20">
          <motion.div className="w-full max-w-2xl mx-auto" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="glass-strong rounded-3xl p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="font-display text-3xl md:text-4xl text-white mb-4">Voice Analysis</h2>
                <p className="text-slate-400">Record or upload audio for instant truth detection</p>
              </div>

              <div className="mb-10">
                <AudioWaveform isActive={isRecording} />
              </div>

              <div className="flex flex-col items-center gap-6">
                <motion.button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? "bg-rose-500/20 border-2 border-rose-500" : "bg-cyan-500/10 border-2 border-cyan-500 hover:bg-cyan-500/20"}`}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >
                  {isRecording && (
                    <>
                      <motion.div className="absolute inset-0 rounded-full border-2 border-rose-500" animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                      <motion.div className="absolute inset-0 rounded-full border-2 border-rose-500" animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
                    </>
                  )}
                  {isRecording ? <MicOff className="w-12 h-12 text-rose-500" /> : <Mic className="w-12 h-12 text-cyan-400" />}
                </motion.button>

                <p className="text-slate-400 text-sm font-display tracking-wider uppercase">{isRecording ? "Tap to stop" : "Tap to record"}</p>

                <AnimatePresence>
                  {audioBlob && !isRecording && (
                    <motion.button
                      onClick={() => analyzeAudio(audioBlob)}
                      disabled={isAnalyzing}
                      className="px-10 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-display tracking-wider uppercase text-sm flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
                    >
                      {isAnalyzing ? (
                        <>
                          <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Analyze Recording
                        </>
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================= RESULT ================= */}
        <AnimatePresence>
          {analysisResult && (
            <section className="min-h-screen flex items-center justify-center px-6 py-20">
              <motion.div className="w-full max-w-2xl mx-auto" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }}>
                <div className={`glass-strong rounded-3xl p-8 md:p-12 ${getResultConfig(prob).glow}`}>
                  <h2 className="font-display text-2xl text-center text-white mb-10">Analysis Result</h2>

                  <div className="relative w-48 h-48 mx-auto mb-8">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="88" className="fill-none stroke-slate-700" strokeWidth="8" />
                      <motion.circle cx="96" cy="96" r="88" className="fill-none" stroke={getResultConfig(prob).ringColor} strokeWidth="8" strokeLinecap="round" initial={{ strokeDasharray: "0 553" }} animate={{ strokeDasharray: `${(prob / 100) * 553} 553` }} transition={{ duration: 1.5, ease: "easeOut" }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span className={`font-display text-5xl font-bold ${getResultConfig(prob).color}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                        {Math.round(prob)}%
                      </motion.span>
                      <span className="text-slate-400 text-sm">Probability</span>
                    </div>
                  </div>

                  <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                    <span className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${getResultConfig(prob).gradient} text-white font-display tracking-wider text-sm uppercase`}>
                      {getResultConfig(prob).label}
                    </span>
                  </motion.div>

                  <motion.p className="text-center text-slate-400 leading-relaxed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                    {analysisResult.explanation}
                  </motion.p>
                </div>
              </motion.div>
            </section>
          )}
        </AnimatePresence>

        {/* ================= UPLOAD ================= */}
        <section className="py-20 px-6">
          <motion.div className="max-w-md mx-auto" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <label className="block cursor-pointer group">
              <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
              <div className="glass rounded-2xl p-8 border-2 border-dashed border-slate-700 hover:border-cyan-500/50 transition-all duration-500 group-hover:bg-cyan-500/5">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-display text-white mb-1">Upload Audio File</p>
                    <p className="text-slate-400 text-sm">WAV, MP3, M4A supported</p>
                  </div>
                </div>
              </div>
            </label>
          </motion.div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="py-10 px-6 border-t border-slate-800">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-slate-500 text-sm">
              © 2025 TrustLens • Designed & Developed by <span className="text-cyan-400">Ashish Sharma</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
