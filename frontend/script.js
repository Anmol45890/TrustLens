// Import Lenis and Three.js
import Lenis from "@studio-freight/lenis"
import * as THREE from "three"

// Lenis Smooth Scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// Three.js Scene Setup
const canvas = document.getElementById("three-canvas")
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
camera.position.z = 5

// Create animated orb with particles
const orbGeometry = new THREE.SphereGeometry(1.5, 64, 64)
const orbMaterial = new THREE.MeshStandardMaterial({
  color: 0x6366f1,
  emissive: 0x22d3ee,
  emissiveIntensity: 0.5,
  roughness: 0.3,
  metalness: 0.8,
  wireframe: true,
})
const orb = new THREE.Mesh(orbGeometry, orbMaterial)
scene.add(orb)

// Add particles
const particlesGeometry = new THREE.BufferGeometry()
const particlesCount = 1000
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10
}

particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
const particlesMaterial = new THREE.PointsMaterial({
  color: 0x6366f1,
  size: 0.02,
  transparent: true,
  opacity: 0.6,
})
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0x22d3ee, 2, 100)
pointLight.position.set(5, 5, 5)
scene.add(pointLight)

// Animation
function animateThree() {
  requestAnimationFrame(animateThree)

  orb.rotation.x += 0.003
  orb.rotation.y += 0.005
  particles.rotation.y += 0.001

  // Fade out orb as user scrolls
  const scrollY = window.scrollY
  const opacity = Math.max(0, 1 - scrollY / window.innerHeight)
  orbMaterial.opacity = opacity
  particlesMaterial.opacity = opacity * 0.6

  renderer.render(scene, camera)
}

animateThree()

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Microphone Recording
let mediaRecorder
let audioChunks = []
let isRecording = false

const micButton = document.getElementById("mic-button")
const statusText = document.getElementById("status-text")
const resultContainer = document.getElementById("result-container")

micButton.addEventListener("click", toggleRecording)

async function toggleRecording() {
  if (!isRecording) {
    await startRecording()
  } else {
    stopRecording()
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    audioChunks = []

    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data)
    })

    mediaRecorder.addEventListener("stop", async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
      await convertAndAnalyze(audioBlob)
      stream.getTracks().forEach((track) => track.stop())
    })

    mediaRecorder.start()
    isRecording = true

    micButton.classList.add("recording")
    statusText.textContent = "Listening..."
    statusText.classList.add("recording")
    resultContainer.classList.add("hidden")
  } catch (error) {
    console.error("[v0] Error accessing microphone:", error)
    statusText.textContent = "Microphone access denied"
  }
}

function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop()
    isRecording = false

    micButton.classList.remove("recording")
    micButton.classList.add("analyzing")
    statusText.textContent = "Analyzing..."
    statusText.classList.remove("recording")
    statusText.classList.add("analyzing")
  }
}

async function convertAndAnalyze(audioBlob) {
  // Convert to WAV format using AudioContext
  const arrayBuffer = await audioBlob.arrayBuffer()
  const audioContext = new AudioContext()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

  const wavBlob = audioBufferToWav(audioBuffer)
  await analyzeAudio(wavBlob, "live")
}

function audioBufferToWav(buffer) {
  const length = buffer.length * buffer.numberOfChannels * 2 + 44
  const arrayBuffer = new ArrayBuffer(length)
  const view = new DataView(arrayBuffer)
  const channels = []
  let offset = 0
  let pos = 0

  // Write WAV header
  setUint32(0x46464952) // "RIFF"
  setUint32(length - 8) // file length - 8
  setUint32(0x45564157) // "WAVE"
  setUint32(0x20746d66) // "fmt " chunk
  setUint32(16) // length = 16
  setUint16(1) // PCM (uncompressed)
  setUint16(buffer.numberOfChannels)
  setUint32(buffer.sampleRate)
  setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels) // avg. bytes/sec
  setUint16(buffer.numberOfChannels * 2) // block-align
  setUint16(16) // 16-bit
  setUint32(0x61746164) // "data" - chunk
  setUint32(length - pos - 4) // chunk length

  // Write audio data
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i))
  }

  while (pos < length) {
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      const sample = Math.max(-1, Math.min(1, channels[i][offset]))
      view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
      pos += 2
    }
    offset++
  }

  return new Blob([arrayBuffer], { type: "audio/wav" })

  function setUint16(data) {
    view.setUint16(pos, data, true)
    pos += 2
  }

  function setUint32(data) {
    view.setUint32(pos, data, true)
    pos += 4
  }
}

async function analyzeAudio(audioBlob, source) {
  const formData = new FormData()
  formData.append("file", audioBlob, "audio.wav")

  try {
    const response = await fetch("http://127.0.0.1:8000/analyze/audio", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log("[v0] Analysis result:", result)
    displayResult(result, source)
  } catch (error) {
    console.error("[v0] Error analyzing audio:", error)

    if (source === "live") {
      statusText.textContent = "Analysis failed. Please try again."
      statusText.classList.remove("analyzing")
      micButton.classList.remove("analyzing")
    } else {
      const fileResultLabel = document.getElementById("file-result-label")
      fileResultLabel.textContent = "Analysis failed"
      fileResultLabel.style.color = "var(--color-danger)"
    }
  }
}

function displayResult(result, source) {
  const percentage = Math.round(result.deception_probability)
  const explanation = result.explanation

  let resultState = "truth"
  let resultLabel = "Truthful"

  if (percentage < 45) {
    resultState = "truth"
    resultLabel = "Likely Truthful"
  } else if (percentage >= 45 && percentage <= 55) {
    resultState = "inconclusive"
    resultLabel = "Inconclusive"
  } else {
    resultState = "lie"
    resultLabel = "Likely Deceptive"
  }

  if (source === "live") {
    const container = resultContainer
    const percentageEl = document.getElementById("result-percentage")
    const labelEl = document.getElementById("result-label")
    const explanationEl = document.getElementById("result-explanation")
    const progressCircle = document.getElementById("progress-circle")

    // Reset classes
    container.className = "result-container"
    container.classList.add(resultState)
    container.classList.remove("hidden")

    // Animate percentage
    animateValue(percentageEl, 0, percentage, 1000)

    // Update progress circle
    const circumference = 2 * Math.PI * 90
    const offset = circumference - (percentage / 100) * circumference
    progressCircle.style.strokeDashoffset = offset

    labelEl.textContent = resultLabel
    explanationEl.textContent = explanation

    statusText.textContent = "Analysis complete"
    statusText.classList.remove("analyzing")
    micButton.classList.remove("analyzing")
  } else {
    const container = document.getElementById("file-result-container")
    const percentageEl = document.getElementById("file-result-percentage")
    const labelEl = document.getElementById("file-result-label")
    const explanationEl = document.getElementById("file-result-explanation")
    const progressCircle = document.getElementById("file-progress-circle")

    // Reset classes
    container.className = "result-container"
    container.classList.add(resultState)
    container.classList.remove("hidden")

    // Animate percentage
    animateValue(percentageEl, 0, percentage, 1000)

    // Update progress circle
    const circumference = 2 * Math.PI * 90
    const offset = circumference - (percentage / 100) * circumference
    progressCircle.style.strokeDashoffset = offset

    labelEl.textContent = resultLabel
    explanationEl.textContent = explanation
  }
}

function animateValue(element, start, end, duration) {
  const startTime = performance.now()

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const value = Math.floor(start + (end - start) * progress)
    element.textContent = value

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}

// File Upload
const uploadArea = document.getElementById("upload-area")
const fileInput = document.getElementById("file-input")
const fileInfo = document.getElementById("file-info")
const fileName = document.getElementById("file-name")
const analyzeFileButton = document.getElementById("analyze-file-button")
const fileResultContainer = document.getElementById("file-result-container")

let selectedFile = null

uploadArea.addEventListener("click", () => {
  fileInput.click()
})

uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault()
  uploadArea.style.borderColor = "var(--color-primary)"
  uploadArea.style.background = "rgba(99, 102, 241, 0.05)"
})

uploadArea.addEventListener("dragleave", () => {
  uploadArea.style.borderColor = "var(--color-border)"
  uploadArea.style.background = "transparent"
})

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault()
  uploadArea.style.borderColor = "var(--color-border)"
  uploadArea.style.background = "transparent"

  const files = e.dataTransfer.files
  if (files.length > 0) {
    handleFileSelect(files[0])
  }
})

fileInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    handleFileSelect(e.target.files[0])
  }
})

function handleFileSelect(file) {
  if (!file.name.endsWith(".wav")) {
    alert("Please select a WAV file")
    return
  }

  selectedFile = file
  fileName.textContent = file.name
  fileInfo.classList.remove("hidden")
  fileResultContainer.classList.add("hidden")
}

analyzeFileButton.addEventListener("click", async () => {
  if (!selectedFile) return

  analyzeFileButton.disabled = true
  analyzeFileButton.textContent = "Analyzing..."
  fileResultContainer.classList.add("hidden")

  await analyzeAudio(selectedFile, "file")

  analyzeFileButton.disabled = false
  analyzeFileButton.textContent = "Analyze Audio"
})
