const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("usernameInput");

const loading = document.getElementById("loading");
const error = document.getElementById("error");
const profileCard = document.getElementById("profileCard");

const avatar = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const bio = document.getElementById("bio");
const joinDate = document.getElementById("joinDate");
const portfolio = document.getElementById("portfolio");

const reposContainer = document.getElementById("repos");

searchBtn.addEventListener("click", () => {

  const username = usernameInput.value.trim();

  if (username !== "") {
    fetchGitHubUser(username);
  }

});

async function fetchGitHubUser(username) {

  loading.classList.remove("hidden");

  error.classList.add("hidden");

  profileCard.classList.add("hidden");

  try {

    const response = await fetch(
      `https://api.github.com/users/${username}`
    );

    if (!response.ok) {
      throw new Error("User not found");
    }

    const data = await response.json();

    displayProfile(data);

    fetchRepos(data.repos_url);

  } catch (err) {

    error.classList.remove("hidden");

  } finally {

    loading.classList.add("hidden");

  }
}

function displayProfile(user) {

  profileCard.classList.remove("hidden");

  avatar.src = user.avatar_url;

  nameEl.textContent = user.name || user.login;

  bio.textContent = user.bio || "No bio available";

  joinDate.textContent = formatDate(user.created_at);

  portfolio.href = user.blog || "#";

}

async function fetchRepos(repoUrl) {

  reposContainer.innerHTML = "";

  const response = await fetch(repoUrl);

  const repos = await response.json();

  const latestRepos = repos.slice(0, 5);

  latestRepos.forEach(repo => {

    const repoLink = document.createElement("a");

    repoLink.href = repo.html_url;

    repoLink.target = "_blank";

    repoLink.textContent = repo.name;

    const div = document.createElement("div");

    div.appendChild(repoLink);

    reposContainer.appendChild(div);

  });
}

function formatDate(dateString) {

  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
