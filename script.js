// Estado Global
const state = {
  currentFile: "home",
  openTabs: ["home"],
  easterEggsFound: 0,
}

window.GITHUB_CONFIG = {
  username: "meuNobre",
  apiBaseUrl: "https://portfolio.discloud.app/api",
  repos: ["Path-Planner-FRC-for-FLL", "wayne-industries-project"],
}

// Import EmailJS library
const emailjs = window.emailjs

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  initializeHeaderButtons()
  initializeNavigation()
  initializeCodeExecutor()
  initializeMetricsCounter()
  initializeSnippets()
  initializeEasterEggs()
  initializeModal()
  initializeContactForm()
  initializeChartHover()
  initializeExtrasFeatures() // Added initialization for extras features
  addTerminalMessage("Sistema NobreIDE carregado com sucesso!")
})

function initializeHeaderButtons() {
  const syncBtn = document.getElementById("syncBtn")
  if (syncBtn) {
    syncBtn.addEventListener("click", () => {
      console.log("[NCode] 🔄 Botão de sincronização clicado")
      addTerminalMessage("🔄 Sincronizando dados do GitHub...")
      if (window.GitHubAPI && window.GitHubAPI.updateGitHubStats) {
        window.GitHubAPI.updateGitHubStats()
      } else {
        console.error("[NCode] ❌ GitHubAPI não disponível")
      }
    })
  }

  const settingsBtn = document.getElementById("settingsBtn")
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      addTerminalMessage("⚙️ Abrindo configurações...")
      openFile("extras") // Abre a aba de extras
      setTimeout(() => {
        const configModal = document.getElementById("configModal")
        if (configModal) {
          configModal.classList.add("active")
        }
      }, 100)
    })
  }
}

// Navegação
function initializeNavigation() {
  const fileItems = document.querySelectorAll(".tree-item.file")

  fileItems.forEach((item) => {
    item.addEventListener("click", () => {
      const file = item.dataset.file
      openFile(file)
    })
  })

  const initialTab = document.querySelector('.tab[data-tab="home"]')
  if (initialTab) {
    initialTab.addEventListener("click", (e) => {
      if (!e.target.classList.contains("tab-close")) {
        switchToFile("home")
      }
    })

    const closeBtn = initialTab.querySelector(".tab-close")
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        closeTab("home")
      })
    }
  }
}

function openFile(fileName) {
  const fileNames = {
    home: "Dashboard.jsx",
    stack: "TechStack.ts",
    projects: "Projects.ts",
    mentoria: "Mentoria.py",
    about: "about-me.md",
    network: "Network.tsx", // Added network file
    extras: "Extras.js",
  }

  const icons = {
    home: "🏠",
    stack: "🔧",
    projects: "💼",
    mentoria: "🎓",
    about: "📝",
    network: "🤝", // Added network icon
    extras: "🎯",
  }

  if (!state.openTabs.includes(fileName)) {
    state.openTabs.push(fileName)
    addTab(fileName, fileNames[fileName], icons[fileName])
  }

  switchToFile(fileName)
  addTerminalMessage(`Aberto: ${fileNames[fileName]}`)
}

function addTab(fileName, displayName, icon) {
  const tabsContainer = document.querySelector(".editor-tabs")
  const tab = document.createElement("div")
  tab.className = "tab"
  tab.dataset.tab = fileName

  tab.innerHTML = `
    <span class="tab-icon">${icon}</span>
    <span>${displayName}</span>
    <button class="tab-close">×</button>
  `

  tabsContainer.appendChild(tab)

  tab.addEventListener("click", (e) => {
    if (!e.target.classList.contains("tab-close")) {
      switchToFile(fileName)
    }
  })

  tab.querySelector(".tab-close").addEventListener("click", (e) => {
    e.stopPropagation()
    closeTab(fileName)
  })
}

function switchToFile(fileName) {
  state.currentFile = fileName

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === fileName)
  })

  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.toggle("active", section.id === fileName)
  })
}

function closeTab(fileName) {
  if (state.openTabs.length === 1) return

  const tabIndex = state.openTabs.indexOf(fileName)
  state.openTabs.splice(tabIndex, 1)

  const tab = document.querySelector(`.tab[data-tab="${fileName}"]`)
  if (tab) tab.remove()

  if (state.currentFile === fileName) {
    const newFile = state.openTabs[Math.max(0, tabIndex - 1)]
    switchToFile(newFile)
  }
}

// Code Executor
function initializeCodeExecutor() {
  const runBtn = document.getElementById("runCode")
  const codeInput = document.getElementById("codeInput")
  const langSelect = document.getElementById("langSelect")
  const output = document.getElementById("codeOutput")

  runBtn.addEventListener("click", () => {
    const code = codeInput.value
    const lang = langSelect.value

    output.style.color = "var(--neon-green)"

    try {
      if (lang === "python") {
        executePythonSimulation(code, output)
      } else if (lang === "javascript") {
        executeJavaScript(code, output)
      }

      addTerminalMessage(`✅ Código ${lang} executado com sucesso`)
    } catch (error) {
      output.style.color = "var(--neon-red)"
      output.textContent = `Error: ${error.message}`
    }
  })
}

function executePythonSimulation(code, output) {
  output.textContent = "🐍 Python Simulation:\n"

  if (code.includes("fibonacci")) {
    output.textContent += "Fib(10) = 55\n"
    output.textContent += "✓ Função fibonacci executada com sucesso!"
  } else if (code.includes("print")) {
    const matches = code.match(/print$$['"](.+)['"]$$/g)
    if (matches) {
      matches.forEach((match) => {
        const text = match.match(/print$$['"](.+)['"]$$/)[1]
        output.textContent += text + "\n"
      })
    }
  } else {
    output.textContent += "Código Python executado!\n"
    output.textContent += "✓ Sem erros detectados"
  }
}

function executeJavaScript(code, output) {
  output.textContent = "⚡ JavaScript Execution:\n"

  if (code.includes("fibonacci")) {
    output.textContent += "Fib(10) = 55\n"
    output.textContent += "✓ Função fibonacci executada!"
  } else if (code.includes("console.log")) {
    const matches = code.match(/console\.log$$['"](.+)['"]$$/g)
    if (matches) {
      matches.forEach((match) => {
        const textMatch = match.match(/console\.log$$['"](.+)['"]$$/)
        if (textMatch && textMatch[1]) {
          output.textContent += textMatch[1].replace(/['"]/g, "") + "\n"
        }
      })
    }
  } else {
    output.textContent += "Código JavaScript executado!\n"
    output.textContent += "✓ Sem erros detectados"
  }
}

// Metrics Counter
function initializeMetricsCounter() {
  const metricValues = document.querySelectorAll(".metric-value")

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        observer.unobserve(entry.target)
      }
    })
  })

  metricValues.forEach((el) => observer.observe(el))
}

function animateCounter(element) {
  const target = Number.parseInt(element.dataset.target)
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      element.textContent = target + (element.textContent.includes("+") ? "+" : "")
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(current)
    }
  }, 16)
}

// Interactive Snippets
function initializeSnippets() {
  const snippetBtns = document.querySelectorAll(".snippet-btn")
  const snippetDisplay = document.getElementById("snippetDisplay")

  const snippets = {
    fibonacci: `// Fibonacci com Memoização
const fib = (n, memo = {}) => {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
};

console.log(fib(10)); // 55`,

    sorting: `// Quick Sort - O(n log n)
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

const numbers = [64, 34, 25, 12, 22];
console.log(quickSort(numbers));`,

    binarySearch: `// Binary Search - O(log n)
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1; // Not found
}

const sorted = [1, 3, 5, 7, 9, 11];
console.log(binarySearch(sorted, 7)); // 3`,
  }

  snippetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const snippetName = btn.dataset.snippet

      snippetBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      snippetDisplay.innerHTML = `<pre><code>${snippets[snippetName]}</code></pre>`

      addTerminalMessage(`📝 Snippet carregado: ${snippetName}`)
    })
  })
}

// Easter Eggs
function initializeEasterEggs() {
  // Easter Egg 1: Triple click no logo
  let logoClicks = 0
  const logo = document.querySelector(".logo")

  logo.addEventListener("click", () => {
    logoClicks++
    if (logoClicks === 3) {
      unlockEasterEgg(1)
      logoClicks = 0
    }
    setTimeout(() => (logoClicks = 0), 1000)
  })

  // Easter Egg 2: Digitar "nobre" no terminal
  let terminalSequence = ""
  document.addEventListener("keypress", (e) => {
    terminalSequence += e.key.toLowerCase()
    if (terminalSequence.includes("nobre")) {
      unlockEasterEgg(2)
      terminalSequence = ""
    }
    if (terminalSequence.length > 10) {
      terminalSequence = terminalSequence.slice(-5)
    }
  })

  // Easter Egg 3: Konami Code (↑↑↓↓)
  const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown"]
  let sequenceIndex = 0

  document.addEventListener("keydown", (e) => {
    if (e.key === sequence[sequenceIndex]) {
      sequenceIndex++
      if (sequenceIndex === sequence.length) {
        unlockEasterEgg(3)
        sequenceIndex = 0
      }
    } else {
      sequenceIndex = 0
    }
  })

  // Easter Egg 4: Clicar 5x no botão de sync
  let syncClicks = 0
  const syncBtn = document.getElementById("syncBtn")
  if (syncBtn) {
    syncBtn.addEventListener("click", () => {
      syncClicks++
      if (syncClicks === 5) {
        unlockEasterEgg(4)
        syncClicks = 0
      }
      setTimeout(() => (syncClicks = 0), 3000)
    })
  }

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "D") {
      e.preventDefault() // Previne comportamento padrão
      unlockEasterEgg(5)
    }
  })

  const easterEggBtn = document.getElementById("easterEggBtn")
  easterEggBtn.addEventListener("click", () => {
    openFile("extras")
    addTerminalMessage("🎮 Desafio: Encontre todos os easter eggs!")
  })
}

function unlockEasterEgg(eggNumber) {
  const egg = document.getElementById(`egg${eggNumber}`)
  if (!egg || egg.classList.contains("found")) return

  egg.classList.add("found")
  state.easterEggsFound++

  const messages = {
    1: "🎉 Easter Egg 1: Logo secreto desbloqueado! (3 cliques no logo)",
    2: "🤖 Easter Egg 2: Código mestre encontrado! (Digite 'nobre')",
    3: "⬆️⬆️⬇️⬇️ Easter Egg 3: Konami Code desbloqueado!",
    4: "🔄 Easter Egg 4: Sincronizador master! (5 cliques no sync)",
    5: "⌨️ Easter Egg 5: Atalho secreto! (Ctrl+Shift+D)", // Atualizado para Ctrl+Shift+D
  }

  egg.querySelector(".egg-status").textContent = "✓"

  addTerminalMessage(messages[eggNumber])

  if (state.easterEggsFound === 5) {
    setTimeout(() => {
      addTerminalMessage("🏆 CONQUISTA: Easter Egg Master!")
      addTerminalMessage("💎 Todos os 5 segredos descobertos!")
      triggerConfetti()
    }, 500)
  }
}

function triggerConfetti() {
  const colors = ["#61dafb", "#98c379", "#e5c07b", "#c678dd", "#e06c75"]
  const confettiCount = 100

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div")
    confetti.className = "confetti"
    confetti.style.left = Math.random() * 100 + "vw"
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.animationDelay = Math.random() * 3 + "s"
    confetti.style.animationDuration = Math.random() * 3 + 2 + "s"
    document.body.appendChild(confetti)

    setTimeout(() => confetti.remove(), 5000)
  }
}

// Modal
function initializeModal() {
  const modal = document.getElementById("tipsModal")
  const showBtn = document.getElementById("showTipsModal")
  const closeBtn = document.querySelector(".modal-close")

  showBtn.addEventListener("click", () => {
    modal.classList.add("active")
    addTerminalMessage("📖 Modal de dicas aberto")
  })

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active")
  })

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active")
    }
  })
}

function initializeContactForm() {
  const form = document.getElementById("contactForm")
  const feedback = form.querySelector(".form-feedback")
  const submitBtn = form.querySelector(".btn-submit")

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Get form data
    const formData = {
      name: document.getElementById("contactName").value,
      email: document.getElementById("contactEmail").value,
      subject: document.getElementById("contactSubject").value,
      message: document.getElementById("contactMessage").value,
    }

    // Show loading state
    submitBtn.classList.add("loading")
    feedback.style.display = "none"

    try {
      // Send email using EmailJS
      // Você precisa configurar uma conta em emailjs.com e criar um template
      // Substitua 'YOUR_SERVICE_ID' e 'YOUR_TEMPLATE_ID' pelos seus IDs
      const response = await emailjs.send(
        "YOUR_SERVICE_ID", // Substitua pelo seu Service ID
        "YOUR_TEMPLATE_ID", // Substitua pelo seu Template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
      )

      // Success
      feedback.className = "form-feedback success"
      feedback.textContent = "✅ Mensagem enviada com sucesso! Responderei em breve."
      feedback.style.display = "block"
      form.reset()

      addTerminalMessage(`📧 Email enviado de ${formData.name}`)
    } catch (error) {
      // Error
      feedback.className = "form-feedback error"
      feedback.textContent = "❌ Erro ao enviar mensagem. Tente novamente mais tarde."
      feedback.style.display = "block"

      console.error("EmailJS Error:", error)
      addTerminalMessage("❌ Erro ao enviar email")
    } finally {
      // Remove loading state
      submitBtn.classList.remove("loading")

      // Hide feedback after 5 seconds
      setTimeout(() => {
        feedback.style.display = "none"
      }, 5000)
    }
  })
}

function initializeChartHover() {
  // Será adicionado dinamicamente quando as barras forem criadas
  console.log("[NCode] 📊 Inicializador de hover do gráfico carregado")
}

function renderActivityChart(activityData) {
  console.log("[NCode] 📊 ========== RENDERIZANDO GRÁFICO DE ATIVIDADE ==========")
  console.log("[NCode] 📊 Dados recebidos:", activityData)
  console.log("[NCode] 📊 Número de meses:", activityData.length)

  const chartContainer = document.getElementById("activityChartContainer")
  console.log("[NCode] 📊 Container do gráfico encontrado:", chartContainer ? "SIM" : "NÃO")

  if (!chartContainer) {
    console.error("[NCode] ❌ Container do gráfico não encontrado")
    return
  }

  // Clear existing bars
  chartContainer.innerHTML = ""
  console.log("[NCode] 📊 Container limpo")

  // Get max commits for scaling
  const maxCommits = Math.max(...activityData.map((d) => d.commits), 1)
  console.log("[NCode] 📊 Máximo de commits para escala:", maxCommits)

  // Create bars for each month
  activityData.forEach((monthData, index) => {
    const bar = document.createElement("div")
    bar.className = "activity-bar"

    const heightPercent = Math.max((monthData.commits / maxCommits) * 100, 5)
    bar.style.height = `${heightPercent}%`
    bar.dataset.month = monthData.month
    bar.dataset.commits = monthData.commits

    console.log(`[NCode] 📊 Criando barra ${index + 1}:`, {
      month: monthData.month,
      commits: monthData.commits,
      height: heightPercent + "%",
    })

    chartContainer.appendChild(bar)

    // Add hover listener
    bar.addEventListener("mouseenter", () => {
      console.log("[NCode] 📊 Hover no gráfico:", monthData.month, "-", monthData.commits, "commits")
      addTerminalMessage(`📊 ${monthData.month}: ${monthData.commits} commits`)
    })
  })

  console.log("[NCode] 📊 Total de barras criadas:", chartContainer.children.length)
  console.log("[NCode] 📊 ========== GRÁFICO RENDERIZADO COM SUCESSO ==========")
  addTerminalMessage("📊 Gráfico de atividade atualizado com dados do GitHub")
}

// Make renderActivityChart available globally
window.renderActivityChart = renderActivityChart

// Extras Features Initialization
function initializeExtrasFeatures() {
  console.log("[NCode] 🎮 Inicializando recursos extras...")

  // Theme Customizer
  initializeThemeCustomizer()

  // Sound Effects
  initializeSoundEffects()

  // Performance Monitor
  initializePerformanceMonitor()

  // Config Modal
  initializeConfigModal()

  console.log("[NCode] ✅ Recursos extras carregados")
}

// Theme Customizer
function initializeThemeCustomizer() {
  const themeBtns = document.querySelectorAll(".theme-btn")

  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme
      applyTheme(theme)

      themeBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      addTerminalMessage(`🎨 Tema alterado para: ${theme}`)
    })
  })
}

function applyTheme(theme) {
  const root = document.documentElement

  const themes = {
    default: {
      primary: "#61dafb",
      secondary: "#98c379",
      accent: "#e5c07b",
    },
    purple: {
      primary: "#c678dd",
      secondary: "#e06c75",
      accent: "#d19a66",
    },
    matrix: {
      primary: "#00ff00",
      secondary: "#00cc00",
      accent: "#009900",
    },
    sunset: {
      primary: "#ff6b6b",
      secondary: "#ffd166",
      accent: "#f77f00",
    },
  }

  const colors = themes[theme]
  if (colors) {
    root.style.setProperty("--neon-blue", colors.primary)
    root.style.setProperty("--neon-green", colors.secondary)
    root.style.setProperty("--neon-orange", colors.accent)
  }
}

// Sound Effects
function initializeSoundEffects() {
  const soundToggle = document.getElementById("soundToggle")
  const testSoundBtn = document.getElementById("testSound")

  let soundEnabled = false

  if (soundToggle) {
    soundToggle.addEventListener("change", (e) => {
      soundEnabled = e.target.checked
      addTerminalMessage(`🔊 Sons ${soundEnabled ? "ativados" : "desativados"}`)
    })
  }

  if (testSoundBtn) {
    testSoundBtn.addEventListener("click", () => {
      if (soundEnabled) {
        playSound("click")
        addTerminalMessage("🔊 Som de teste reproduzido!")
      } else {
        addTerminalMessage("⚠️ Ative os sons primeiro!")
      }
    })
  }
}

function playSound(type) {
  // Simple beep usando Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = type === "click" ? 800 : 400
  oscillator.type = "sine"

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.1)
}

// Performance Monitor
function initializePerformanceMonitor() {
  const fpsCounter = document.getElementById("fpsCounter")
  const memoryUsage = document.getElementById("memoryUsage")
  const loadTime = document.getElementById("loadTime")
  const runTestBtn = document.getElementById("runPerformanceTest")

  // Calculate load time
  if (loadTime) {
    const perfData = performance.timing
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
    loadTime.textContent = `${(pageLoadTime / 1000).toFixed(2)}s`
  }

  // FPS Counter
  let fps = 0
  let lastTime = performance.now()
  let frames = 0

  function updateFPS() {
    frames++
    const currentTime = performance.now()

    if (currentTime >= lastTime + 1000) {
      fps = Math.round((frames * 1000) / (currentTime - lastTime))
      if (fpsCounter) {
        fpsCounter.textContent = fps
      }
      frames = 0
      lastTime = currentTime
    }

    requestAnimationFrame(updateFPS)
  }

  updateFPS()

  // Memory usage (se disponível)
  if (performance.memory && memoryUsage) {
    setInterval(() => {
      const used = performance.memory.usedJSHeapSize / 1048576
      memoryUsage.textContent = `${used.toFixed(1)} MB`
    }, 2000)
  }

  // Run performance test
  if (runTestBtn) {
    runTestBtn.addEventListener("click", () => {
      addTerminalMessage("🚀 Executando teste de performance...")

      setTimeout(() => {
        const metrics = {
          fps: fps,
          memory: performance.memory ? `${(performance.memory.usedJSHeapSize / 1048576).toFixed(1)} MB` : "N/A",
          loadTime: loadTime ? loadTime.textContent : "N/A",
        }

        addTerminalMessage(`📊 FPS: ${metrics.fps} | Memória: ${metrics.memory} | Load: ${metrics.loadTime}`)
        addTerminalMessage("✅ Teste concluído!")
      }, 1000)
    })
  }
}

// Config Modal
function initializeConfigModal() {
  const configModal = document.getElementById("configModal")
  const closeBtn = configModal?.querySelector(".modal-close")
  const refreshGitHubBtn = document.getElementById("refreshGitHub")

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      configModal.classList.remove("active")
      addTerminalMessage("⚙️ Configurações fechadas")
    })
  }

  if (configModal) {
    configModal.addEventListener("click", (e) => {
      if (e.target === configModal) {
        configModal.classList.remove("active")
      }
    })
  }

  if (refreshGitHubBtn) {
    refreshGitHubBtn.addEventListener("click", () => {
      addTerminalMessage("🔄 Atualizando dados do GitHub...")
      if (window.GitHubAPI && window.GitHubAPI.updateGitHubStats) {
        window.GitHubAPI.updateGitHubStats()
      }
    })
  }

  // Config toggles
  const animationsToggle = document.getElementById("animationsToggle")
  const particlesToggle = document.getElementById("particlesToggle")
  const highContrastToggle = document.getElementById("highContrastToggle")
  const reducedMotionToggle = document.getElementById("reducedMotionToggle")

  if (animationsToggle) {
    animationsToggle.addEventListener("change", (e) => {
      document.body.classList.toggle("no-animations", !e.target.checked)
      addTerminalMessage(`🎬 Animações ${e.target.checked ? "ativadas" : "desativadas"}`)
    })
  }

  if (highContrastToggle) {
    highContrastToggle.addEventListener("change", (e) => {
      document.body.classList.toggle("high-contrast", e.target.checked)
      addTerminalMessage(`🎨 Alto contraste ${e.target.checked ? "ativado" : "desativado"}`)
    })
  }

  if (reducedMotionToggle) {
    reducedMotionToggle.addEventListener("change", (e) => {
      document.body.classList.toggle("reduced-motion", e.target.checked)
      addTerminalMessage(`🐌 Movimento reduzido ${e.target.checked ? "ativado" : "desativado"}`)
    })
  }
}

// Terminal
function addTerminalMessage(message) {
  const terminal = document.querySelector(".terminal-content")
  const line = document.createElement("div")
  line.className = "terminal-line"
  line.innerHTML = `
    <span class="terminal-prompt">nobre@portfolio:~$</span>
    <span class="terminal-text">${message}</span>
  `

  const lastLine = terminal.querySelector(".terminal-line:last-child")
  if (lastLine) {
    const cursor = lastLine.querySelector(".terminal-cursor")
    if (cursor) cursor.remove()
  }

  terminal.appendChild(line)

  const newLine = document.createElement("div")
  newLine.className = "terminal-line"
  newLine.innerHTML = `
    <span class="terminal-prompt">nobre@portfolio:~$</span>
    <span class="terminal-text terminal-cursor">_</span>
  `
  terminal.appendChild(newLine)

  terminal.scrollTop = terminal.scrollHeight

  while (terminal.children.length > 50) {
    terminal.removeChild(terminal.firstChild)
  }
}
