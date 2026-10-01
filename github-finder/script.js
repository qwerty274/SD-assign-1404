const form = document.querySelector('#search-form');
const usernameInput = document.querySelector('#username');
const status = document.querySelector('#status');
const emptyState = document.querySelector('#empty-state');
const profilePanel = document.querySelector('#profile-panel');
const repoList = document.querySelector('#repo-list');

const elements = {
  avatar: document.querySelector('#avatar'),
  name: document.querySelector('#name'),
  handle: document.querySelector('#handle'),
  profileLink: document.querySelector('#profile-link'),
  bio: document.querySelector('#bio'),
  location: document.querySelector('#location'),
  followers: document.querySelector('#followers'),
  following: document.querySelector('#following'),
  repositories: document.querySelector('#repositories'),
  repoCount: document.querySelector('#repo-count')
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = usernameInput.value.trim();
  if (username) loadProfile(username);
});

async function loadProfile(username) {
  setLoading(true);
  status.textContent = '';
  try {
    const [profileResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=stars&direction=desc&per_page=6`)
    ]);

    if (!profileResponse.ok) {
      if (profileResponse.status === 404) throw new Error('No public profile found for that username.');
      if (profileResponse.status === 403) throw new Error('GitHub API rate limit reached. Please try again later.');
      throw new Error('GitHub could not return that profile right now.');
    }
    if (!reposResponse.ok) throw new Error('The profile loaded, but repositories are unavailable right now.');

    const profile = await profileResponse.json();
    const repositories = await reposResponse.json();
    renderProfile(profile, repositories);
  } catch (error) {
    profilePanel.hidden = true;
    emptyState.hidden = false;
    status.textContent = error.message;
  } finally {
    setLoading(false);
  }
}

function renderProfile(profile, repositories) {
  elements.avatar.src = profile.avatar_url;
  elements.avatar.alt = `${profile.login}'s profile picture`;
  elements.name.textContent = profile.name || profile.login;
  elements.handle.textContent = `@${profile.login}`;
  elements.handle.href = profile.html_url;
  elements.profileLink.href = profile.html_url;
  elements.bio.textContent = profile.bio || 'This profile has not added a bio yet.';
  elements.location.textContent = profile.location ? `⌖  ${profile.location}` : '⌖  Location not listed';
  elements.followers.textContent = formatNumber(profile.followers);
  elements.following.textContent = formatNumber(profile.following);
  elements.repositories.textContent = formatNumber(profile.public_repos);
  elements.repoCount.textContent = `${repositories.length} shown`;
  repoList.innerHTML = repositories.length ? repositories.map(repositoryCard).join('') : '<p class="bio">No public repositories yet.</p>';
  profilePanel.hidden = false;
  emptyState.hidden = true;
  status.textContent = '';
  profilePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function repositoryCard(repository) {
  const description = repository.description || 'No description provided.';
  const language = repository.language || 'Code';
  return `<a class="repo-card" href="${repository.html_url}" target="_blank" rel="noreferrer">
    <h4>${escapeHtml(repository.name)}</h4>
    <p>${escapeHtml(description)}</p>
    <span class="repo-meta"><span><span class="language-dot"></span> ${escapeHtml(language)}</span><span>★ ${formatNumber(repository.stargazers_count)}</span></span>
  </a>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character]);
}

function formatNumber(value) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

function setLoading(isLoading) {
  const button = form.querySelector('button');
  button.disabled = isLoading;
  button.querySelector('span:first-child').textContent = isLoading ? 'Searching...' : 'Explore';
}
