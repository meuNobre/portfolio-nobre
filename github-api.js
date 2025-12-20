const GITHUB_CONFIG = {
  username: "meuNobre",
  apiBaseUrl: "https://portfolio.discloud.app/api",
  repos: ["Path-Planner-FRC-for-FLL", "wayne-industries-project"],
}

async function fetchGitHubUser(username) {
  console.log("[NCode] 🔍 Buscando usuário GitHub:", username)
  try {
    const response = await fetch(`${GITHUB_CONFIG.apiBaseUrl}/user/${username}`)
    console.log("[NCode] 📡 Resposta da API (user):", response.status)
    if (!response.ok) throw new Error("Usuário não encontrado")
    const data = await response.json()
    console.log("[NCode] ✅ Dados do usuário recebidos:", data)
    return data
  } catch (error) {
    console.error("[NCode] ❌ Erro ao buscar usuário:", error)
    return null
  }
}

async function fetchGitHubRepos(username) {
  console.log("[NCode] 🔍 Buscando repositórios do usuário:", username)
  try {
    const response = await fetch(`${GITHUB_CONFIG.apiBaseUrl}/repos`)
    console.log("[NCode] 📡 Resposta da API (repos):", response.status)
    if (!response.ok) throw new Error("Erro ao buscar repositórios")
    const data = await response.json()
    console.log("[NCode] ✅ Repositórios recebidos:", data.length, "repos")
    return data
  } catch (error) {
    console.error("[NCode] ❌ Erro ao buscar repositórios:", error)
    return []
  }
}

async function fetchRepoCommits(username, repoName) {
  console.log("[NCode] 🔍 Buscando commits do repo:", repoName)
  try {
    const response = await fetch(`${GITHUB_CONFIG.apiBaseUrl}/repos/${repoName}/commits`)
    console.log("[NCode] 📡 Resposta da API (commits):", response.status)
    if (!response.ok) throw new Error("Erro ao buscar commits")
    const data = await response.json()
    console.log("[NCode] ✅ Commits recebidos do repo", repoName + ":", data.length)
    return data
  } catch (error) {
    console.error("[NCode] ❌ Erro ao buscar commits do repo", repoName + ":", error)
    return []
  }
}

async function fetchGitHubActivity(username) {
  console.log("[NCode] 🔍 Buscando atividade GitHub do usuário:", username)
  try {
    const response = await fetch(`${GITHUB_CONFIG.apiBaseUrl}/user/${username}/events`)
    console.log("[NCode] 📡 Resposta da API (activity):", response.status)
    if (!response.ok) throw new Error("Erro ao buscar atividade")
    const data = await response.json()
    console.log("[NCode] ✅ Eventos recebidos:", data.length)
    return data
  } catch (error) {
    console.error("[NCode] ❌ Erro ao buscar atividade:", error)
    return []
  }
}

async function generateActivityChart(username) {
  console.log("[NCode] 📊 Gerando gráfico de atividade dos últimos 12 meses")
  const activity = await fetchGitHubActivity(username)

  // Pegar commits dos repositórios específicos
  let allCommits = []
  for (const repo of GITHUB_CONFIG.repos) {
    const commits = await fetchRepoCommits(username, repo)
    allCommits = allCommits.concat(commits)
  }
  console.log("[NCode] 📈 Total de commits encontrados:", allCommits.length)

  // Criar objeto com os últimos 12 meses
  const monthsData = {}
  const now = new Date()

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = date.toLocaleString("pt-BR", { month: "short", year: "numeric" })
    monthsData[monthKey] = 0
  }

  // Contar commits por mês
  allCommits.forEach((commit) => {
    if (commit.commit && commit.commit.author && commit.commit.author.date) {
      const commitDate = new Date(commit.commit.author.date)
      const monthKey = commitDate.toLocaleString("pt-BR", { month: "short", year: "numeric" })
      if (monthsData.hasOwnProperty(monthKey)) {
        monthsData[monthKey]++
      }
    }
  })

  console.log("[NCode] 📊 Dados de atividade por mês:", monthsData)
  return monthsData
}

async function updateGitHubStats() {
  console.log("[NCode] 🚀 Iniciando atualização de estatísticas do GitHub")
  const user = await fetchGitHubUser(GITHUB_CONFIG.username)
  const repos = await fetchGitHubRepos(GITHUB_CONFIG.username)

  if (!user || !repos) {
    console.warn("[NCode] ⚠️ Não foi possível carregar dados do GitHub")
    return
  }

  // Calcular estatísticas reais
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0)
  const publicRepos = user.public_repos

  console.log("[NCode] 📊 Estatísticas calculadas:")
  console.log("[NCode]    Stars:", totalStars)
  console.log("[NCode]    Forks:", totalForks)
  console.log("[NCode]    Repos:", publicRepos)

  // Buscar total de commits
  let totalCommits = 0
  for (const repo of repos) {
    const commits = await fetchRepoCommits(GITHUB_CONFIG.username, repo.name)
    totalCommits += commits.length
  }
  console.log("[NCode] 📈 Total de commits:", totalCommits)

  // Atualizar cards
  updateGitHubCards(totalStars, totalCommits, publicRepos)

  // Gerar gráfico de atividade
  const activityData = await generateActivityChart(GITHUB_CONFIG.username)
  updateActivityChart(activityData)

  // Atualizar project stats com dados reais dos repos específicos
  await updateProjectStats()

  if (typeof window.addTerminalMessage === "function") {
    window.addTerminalMessage("✅ Dados do GitHub carregados com sucesso!")
  }
  console.log("[NCode] ✅ Atualização de estatísticas concluída")
}

function updateGitHubCards(stars, commits, repos) {
  console.log("[NCode] 🎯 Atualizando cards de estatísticas")
  const githubCards = document.querySelectorAll(".github-card")

  if (githubCards.length >= 3) {
    const starsValue = githubCards[0].querySelector(".github-value")
    const commitsValue = githubCards[1].querySelector(".github-value")
    const reposValue = githubCards[2].querySelector(".github-value")

    if (starsValue) {
      console.log("[NCode] ⭐ Atualizando stars para:", stars)
      animateValue(starsValue, 0, stars, 1500)
    }
    if (commitsValue) {
      console.log("[NCode] 💻 Atualizando commits para:", commits)
      animateValue(commitsValue, 0, commits, 1500)
    }
    if (reposValue) {
      console.log("[NCode] 📦 Atualizando repos para:", repos)
      animateValue(reposValue, 0, repos, 1500)
    }
  }
}

function updateActivityChart(activityData) {
  console.log("[NCode] 📊 ========== INICIANDO UPDATE ACTIVITY CHART ==========")
  console.log("[NCode] 📊 Tipo de activityData:", typeof activityData)
  console.log("[NCode] 📊 activityData:", activityData)

  const months = Object.keys(activityData)
  const values = Object.values(activityData)

  console.log("[NCode] 📊 Meses encontrados:", months)
  console.log("[NCode] 📊 Valores encontrados:", values)

  const chartData = months.map((month, index) => ({
    month: month,
    commits: values[index],
  }))

  console.log("[NCode] 📊 Dados do gráfico formatados:", chartData)
  console.log("[NCode] 📊 Verificando se window.renderActivityChart existe:", typeof window.renderActivityChart)

  if (typeof window.renderActivityChart === "function") {
    console.log("[NCode] 📊 Chamando window.renderActivityChart com", chartData.length, "meses")
    window.renderActivityChart(chartData)
    console.log("[NCode] 📊 window.renderActivityChart foi chamada com sucesso")
  } else {
    console.error("[NCode] ❌ Função renderActivityChart não encontrada no window")
    console.error(
      "[NCode] ❌ Funções disponíveis no window:",
      Object.keys(window).filter((k) => k.includes("render") || k.includes("chart")),
    )
  }
  console.log("[NCode] 📊 ========== FIM UPDATE ACTIVITY CHART ==========")
}

async function updateProjectStats() {
  console.log("[NCode] 🎯 Atualizando estatísticas dos projetos")

  for (const repoName of GITHUB_CONFIG.repos) {
    try {
      const response = await fetch(`${GITHUB_CONFIG.apiBaseUrl}/repos/${repoName}`)

      if (response.ok) {
        const repoData = await response.json()
        console.log("[NCode] 📦 Dados do repo", repoName + ":", repoData)

        // Encontrar o card do projeto no DOM
        const projectCards = document.querySelectorAll(".project-card")
        projectCards.forEach((card) => {
          const title = card.querySelector("h3")?.textContent || ""
          // Mapear nomes de projetos para repos
          if (
            (title.includes("Path Planner") && repoName === "Path-Planner-FRC-for-FLL") ||
            (title.includes("Wayne") && repoName === "wayne-industries-project")
          ) {
            const stats = card.querySelector(".project-stats")
            if (stats) {
              stats.innerHTML = `
                <span>⭐ ${repoData.stargazers_count}</span>
                <span>🔀 ${repoData.forks_count}</span>
                <span>👁️ ${repoData.watchers_count}</span>
              `
              console.log("[NCode] ✅ Stats atualizadas para", repoName)
            }
          }
        })
      }
    } catch (error) {
      console.error("[NCode] ❌ Erro ao buscar repo", repoName + ":", error)
    }
  }
}

function animateValue(element, start, end, duration) {
  const range = end - start
  const increment = range / (duration / 16)
  let current = start

  const timer = setInterval(() => {
    current += increment
    if (current >= end) {
      element.textContent = end > 0 ? `${end}+` : "0"
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(current)
    }
  }, 16)
}

window.GitHubAPI = {
  updateGitHubStats,
  fetchGitHubUser,
  fetchGitHubRepos,
  fetchRepoCommits,
  fetchGitHubActivity,
  generateActivityChart,
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("[NCode] 🎬 Inicializando integração GitHub")
    updateGitHubStats()
  })
} else {
  console.log("[NCode] 🎬 Inicializando integração GitHub (documento já carregado)")
  updateGitHubStats()
}
