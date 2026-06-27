import React from 'react';
import { fetchGithubProfile, fetchGithubRepos } from '@/lib/github';
import PortfolioClient from '@/components/PortfolioClient';

// Force dynamic or configure Next.js revalidation
export const revalidate = 300; // Revalidate cache every 5 minutes

// Static Fallback Repositories in case of GitHub API errors or rate limit failures
const FALLBACK_REPOS = [
  {
    id: 1,
    name: 'QuickBite-Food-Delivery-App',
    description: 'A complete food delivery web application built with the MERN stack (MongoDB, Express, React, Node.js). Integrates secure role-based JWT auth (Customer, Admin, Owner) and Stripe Payment gateway with webhooks.',
    language: 'JavaScript',
    stargazers_count: 5,
    forks_count: 1,
    html_url: 'https://github.com/SagarXdev23/Food_Delivery_Mini-Project',
    homepage: 'https://github.com/SagarXdev23/Food_Delivery_Mini-Project'
  },
  {
    id: 2,
    name: 'SmartScribe-AI-Study-Assistant',
    description: 'An AI study companion that processes notes to generate smart summaries, flashcards, and quizzes using OpenAI API. Built with React, Node.js, Express, and MongoDB, featuring streaming AI responses.',
    language: 'JavaScript',
    stargazers_count: 4,
    forks_count: 0,
    html_url: 'https://github.com/SagarXdev23/Ai-project',
    homepage: 'https://github.com/SagarXdev23/Ai-project'
  },
  {
    id: 3,
    name: 'ChatWave-Real-Time-Chat',
    description: 'A real-time messaging application featuring group chats, private channels, typing indicators, and message history persistence. Powered by React, Socket.io, Node.js, Express, and MongoDB.',
    language: 'JavaScript',
    stargazers_count: 3,
    forks_count: 0,
    html_url: 'https://github.com/SagarXdev23/KeyBattle-Modern-Typing-Test',
    homepage: 'https://github.com/SagarXdev23/KeyBattle-Modern-Typing-Test'
  },
  {
    id: 4,
    name: 'Quill-Journaling-App',
    description: 'A clean and minimal journaling web app built with HTML, CSS, and JavaScript. Supports secure registration, log in, and journaling logs grouped by categories like goals, thoughts, and memories.',
    language: 'HTML',
    stargazers_count: 1,
    forks_count: 0,
    html_url: 'https://github.com/SagarXdev23/Quill-Journaling-App',
    homepage: 'https://quill-journaling-app.vercel.app'
  },
  {
    id: 5,
    name: 'Brick_Breaker-Java-Game',
    description: 'A classic desktop brick breaker game built from scratch in Java utilizing AWT and Swing frameworks. Implements custom collision physics, score tracking, dynamic levels, and state management.',
    language: 'Java',
    stargazers_count: 2,
    forks_count: 0,
    html_url: 'https://github.com/SagarXdev23/Brick_Breaker-Java-Game',
    homepage: 'https://github.com/SagarXdev23/Brick_Breaker-Java-Game'
  },
  {
    id: 6,
    name: 'WeatherForecast',
    description: 'A responsive weather dashboard fetching real-time weather alerts and hourly forecasts using a Weather API. Developed using vanilla HTML, CSS, and modern asynchronous JavaScript.',
    language: 'CSS',
    stargazers_count: 1,
    forks_count: 0,
    html_url: 'https://github.com/SagarXdev23/WeatherForecast',
    homepage: 'https://github.com/SagarXdev23/WeatherForecast'
  }
];

const FALLBACK_PROFILE = {
  login: 'SagarXdev23',
  name: 'Sagar Mishra',
  bio: 'Aspiring Full-Stack Developer | Learning Java, HTML, CSS & JS | Passionate about building responsive web apps & solving problems 🚀',
  avatar_url: 'https://avatars.githubusercontent.com/u/170653373?v=4',
  html_url: 'https://github.com/SagarXdev23'
};

export default async function PortfolioHome() {
  let repos = FALLBACK_REPOS;
  let profile = FALLBACK_PROFILE;

  try {
    // Attempt real-time GitHub fetching
    const [fetchedProfile, fetchedRepos] = await Promise.all([
      fetchGithubProfile(),
      fetchGithubRepos(),
    ]);

    if (fetchedProfile) profile = fetchedProfile;
    if (fetchedRepos && fetchedRepos.length > 0) repos = fetchedRepos;
  } catch (error) {
    console.error('Error fetching real-time GitHub data, falling back to static metadata:', error);
  }

  return (
    <main className="flex-grow-1">
      <PortfolioClient repos={repos} profile={profile} />
    </main>
  );
}
