import { NextResponse } from 'next/server';
import { fetchGithubProfile, fetchGithubRepos, fetchRepoReadme } from '@/lib/github';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const repo = searchParams.get('repo');
    const refresh = searchParams.get('refresh') === 'true';

    if (repo) {
      // Fetch README for a specific repository
      const readme = await fetchRepoReadme(repo, refresh);
      return NextResponse.json({ readme });
    }

    // Fetch profile and all repositories
    const [profile, repos] = await Promise.all([
      fetchGithubProfile(),
      fetchGithubRepos(refresh),
    ]);

    return NextResponse.json({ profile, repos });
  } catch (error: any) {
    console.error('API github error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}
