import fs from 'fs/promises';
import path from 'path';

let githubToken: string | null = null;

// Read token from assets/key.txt
async function getGithubToken(): Promise<string> {
  if (githubToken) return githubToken;
  try {
    const keyPath = path.join(process.cwd(), 'assets', 'key.txt');
    const content = await fs.readFile(keyPath, 'utf-8');
    githubToken = content.trim();
    return githubToken;
  } catch (error) {
    console.error('Error reading GitHub token:', error);
    return '';
  }
}

// Memory Cache structure
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cacheStore: {
  profile?: CacheItem<any>;
  repos?: CacheItem<any[]>;
  readmes: Record<string, CacheItem<string>>;
} = {
  readmes: {},
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchGithubProfile() {
  const now = Date.now();
  if (cacheStore.profile && (now - cacheStore.profile.timestamp < CACHE_DURATION)) {
    return cacheStore.profile.data;
  }

  const token = await getGithubToken();
  const response = await fetch('https://api.github.com/users/SagarXdev23', {
    headers: {
      'User-Agent': 'Sagar-Portfolio-App',
      ...(token ? { Authorization: `token ${token}` } : {}),
    },
    next: { revalidate: 300 } // Cache at Next.js level as well
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub profile: ${response.statusText}`);
  }

  const data = await response.json();
  cacheStore.profile = { data, timestamp: now };
  return data;
}

export async function fetchGithubRepos(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cacheStore.repos && (now - cacheStore.repos.timestamp < CACHE_DURATION)) {
    return cacheStore.repos.data;
  }

  const token = await getGithubToken();
  // Fetch repos owned by Sagar
  const response = await fetch('https://api.github.com/users/SagarXdev23/repos?per_page=100&sort=updated', {
    headers: {
      'User-Agent': 'Sagar-Portfolio-App',
      ...(token ? { Authorization: `token ${token}` } : {}),
    },
    next: { revalidate: 300 }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub repos: ${response.statusText}`);
  }

  let repos = await response.json();
  if (Array.isArray(repos)) {
    // Filter out forks if desired, or keep them. Let's keep owned repos
    repos = repos.filter(repo => !repo.fork);
  } else {
    repos = [];
  }

  cacheStore.repos = { data: repos, timestamp: now };
  return repos;
}

export async function fetchRepoReadme(repoName: string, forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cacheStore.readmes[repoName] && (now - cacheStore.readmes[repoName].timestamp < CACHE_DURATION)) {
    return cacheStore.readmes[repoName].data;
  }

  const token = await getGithubToken();
  // Try fetching main branch or master branch README.md
  // First, we can query the default branch
  let defaultBranch = 'main';
  try {
    const repos = await fetchGithubRepos();
    const repoInfo = repos.find((r: any) => r.name.toLowerCase() === repoName.toLowerCase());
    if (repoInfo) {
      defaultBranch = repoInfo.default_branch || 'main';
    }
  } catch (e) {
    console.error('Error fetching repo info for default branch:', e);
  }

  // Fetch raw README
  const response = await fetch(`https://raw.githubusercontent.com/SagarXdev23/${repoName}/${defaultBranch}/README.md`, {
    headers: {
      'User-Agent': 'Sagar-Portfolio-App',
      ...(token ? { Authorization: `token ${token}` } : {}),
    },
    next: { revalidate: 300 }
  });

  if (!response.ok) {
    // Try master as fallback
    const fallbackResponse = await fetch(`https://raw.githubusercontent.com/SagarXdev23/${repoName}/master/README.md`, {
      headers: {
        'User-Agent': 'Sagar-Portfolio-App',
        ...(token ? { Authorization: `token ${token}` } : {}),
      }
    });
    if (!fallbackResponse.ok) {
      return `### ${repoName}\nNo README.md found for this repository. Visit the [GitHub repository page](https://github.com/SagarXdev23/${repoName}) for more details.`;
    }
    const data = await fallbackResponse.text();
    cacheStore.readmes[repoName] = { data, timestamp: now };
    return data;
  }

  const data = await response.text();
  cacheStore.readmes[repoName] = { data, timestamp: now };
  return data;
}

export function clearGithubCache() {
  cacheStore.profile = undefined;
  cacheStore.repos = undefined;
  cacheStore.readmes = {};
}
