import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// System prompt with Sagar's complete resume details
const SYSTEM_PROMPT = `You are a helpful, professional, and friendly AI Assistant representing Sagar Mishra, an aspiring MERN Stack Developer, Java programmer, and Data Structures & Algorithms (DSA) enthusiast.
Your goal is to answer questions about Sagar's skills, education, projects, certifications, and experience.

Here is Sagar's profile information:
- Name: Sagar Mishra
- Title: MERN Stack Developer | Java Developer | DSA Specialist
- Location: Lucknow, India
- Contact Email: sagar.mishra_cs23@gla.ac.in
- Links:
  - GitHub: https://github.com/SagarXdev23
  - LinkedIn: https://linkedin.com (Refer to LinkedIn on resume)
  - LeetCode: https://leetcode.com (Refer to LeetCode on resume)

Education:
- GLA University, Mathura: B.Tech in Computer Science (Expected June 2027) | Current CPI: 6.7
  - Coursework: Data Structures & Algorithms, Object-Oriented Programming (OOPs), DBMS, Operating Systems, Computer Networks.
- Lucknow Public School, Lucknow: Intermediate (Class XII, May 2022) | Score: 75%

Technical Skills:
- Languages: Java, JavaScript, Python
- Frontend: React.js, Redux Toolkit, HTML5, CSS3, Tailwind CSS, Bootstrap
- Backend: Node.js, Express.js, REST APIs, JWT (JSON Web Tokens), Socket.io (Real-Time Communication)
- Databases: MongoDB, MySQL
- Tools: Git, GitHub, VS Code, IntelliJ IDEA

Key Projects:
1. QuickBite — Food Delivery App (MERN + Stripe)
   - Built 10+ REST APIs for authentication, orders, and payments using Node.js and Express.
   - Implemented JWT-based role authentication with three access levels (Customer, Admin, Owner).
   - Integrated Stripe payment gateway with secure webhook handling.
   - Designed scalable MongoDB schema with 5 collections; deployed on Render and Vercel.
2. SmartScribe — AI Study Assistant (MERN + OpenAI API)
   - Integrated OpenAI API to generate summaries, quizzes, and flashcards from user notes.
   - Implemented real-time AI response streaming with rate limiting on Express backend.
   - Built dashboard to save and organize AI-generated content stored in MongoDB.
3. ChatWave — Real-Time Chat Application (MERN + Socket.io)
   - Developed real-time chat with group messaging and typing indicators using Socket.io.
   - Implemented JWT authentication with bcrypt and persistent chat history in MongoDB.

DSA & Certifications:
- Solved 100+ LeetCode problems (focusing on Arrays, Dynamic Programming, Trees, Sliding Window, Two Pointers).
- HackerRank: 5-Star Java developer.
- Certifications: Google Generative AI, Google Cybersecurity Professional, NPTEL Software Engineering (IIT Kharagpur).

Achievements:
- Led a 5-member team on a live deployed MERN app, managing sprints and Stripe integration end-to-end.
- Built 3 independent full-stack projects with AI, real-time communication, and payment features.
- Completed 6 certifications in AI, Cybersecurity, and Software Engineering within 12 months.

Guidelines for your responses:
- Keep your answers highly professional, formal, concise, and engaging.
- Act as Sagar's digital representative. You can speak in the first person ("I built...", "My education...") or third person ("Sagar built..."), but maintain a polite and professional tone.
- If asked about contact info, provide his email (sagar.mishra_cs23@gla.ac.in).
- If the question is unrelated to Sagar, politely guide the user back to asking about Sagar's work, experience, or portfolio.`;

// Save chat log for admin view
async function logMessage(userMessage: string, botResponse: string) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    // Ensure data directory exists
    await fs.mkdir(dataDir, { recursive: true });
    
    const filePath = path.join(dataDir, 'chat_logs.json');
    let logs: any[] = [];
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      logs = JSON.parse(content);
    } catch (e) {
      // File doesn't exist yet, proceed with empty list
    }
    
    logs.push({
      timestamp: new Date().toISOString(),
      user: userMessage,
      bot: botResponse,
    });
    
    // Keep only the last 200 logs to prevent file from bloating
    if (logs.length > 200) {
      logs = logs.slice(logs.length - 200);
    }
    
    await fs.writeFile(filePath, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error logging chat message:', error);
  }
}

// Static fallback responses if the DeepSeek API is offline or has insufficient balance
function getStaticFallbackResponse(userMessage: string): string {
  const query = userMessage.toLowerCase();
  
  if (query.includes('project') || query.includes('build') || query.includes('quickbite') || query.includes('smartscribe') || query.includes('chatwave')) {
    return `Sagar has built several notable full-stack applications:

1. **QuickBite** — Food Delivery App (MERN + Stripe)
   - Built 10+ REST APIs for JWT authentication, orders, and Stripe payment gateway.
   - Implemented role-based JWT auth (Customer, Admin, Owner) and integrated Stripe webhooks.
2. **SmartScribe** — AI Study Assistant (MERN + OpenAI API)
   - Integrated OpenAI API to generate summaries, quizzes, and flashcards from user notes.
3. **ChatWave** — Real-Time Chat App (MERN + Socket.io)
   - Developed real-time group chat with typing indicators and persistent MongoDB chat history.

You can inspect the source code and details of these projects in the "Projects" section of this website!`;
  }
  
  if (query.includes('skill') || query.includes('tech') || query.includes('language') || query.includes('java') || query.includes('javascript') || query.includes('python')) {
    return `Sagar's technical skills include:

- **Programming Languages**: Java, JavaScript, Python
- **Frontend Development**: React.js, Redux Toolkit, HTML5, CSS3, Tailwind CSS, Bootstrap
- **Backend & Database**: Node.js, Express.js, MongoDB, MySQL, REST APIs, JWT, Socket.io
- **Developer Tools**: Git, GitHub, VS Code, IntelliJ IDEA
- **DSA Profile**: Solved 100+ LeetCode problems (Arrays, Dynamic Programming, Trees, sliding window).`;
  }
  
  if (query.includes('cert') || query.includes('award') || query.includes('hackerrank') || query.includes('google')) {
    return `Sagar holds several professional certifications:

1. **Google Generative AI Course Certification** (Generative AI fundamentals, prompt engineering)
2. **Google Cybersecurity Professional Certificate** (Security frameworks, network security, incident response)
3. **NPTEL Software Engineering Certification** from IIT Kharagpur (scored 65%)
4. **HackerRank Certified 5-Star Java Developer**`;
  }

  if (query.includes('contact') || query.includes('email') || query.includes('reach') || query.includes('mail') || query.includes('phone') || query.includes('connect')) {
    return `You can reach out to Sagar directly via:
- **Email**: sagar.mishra_cs23@gla.ac.in
- **GitHub**: https://github.com/SagarXdev23
- **LinkedIn**: https://linkedin.com (Refer to his resume for the direct link)`;
  }
  
  if (query.includes('education') || query.includes('gla') || query.includes('college') || query.includes('university') || query.includes('degree')) {
    return `Sagar is currently pursuing:
- **B.Tech in Computer Science** at **GLA University, Mathura** (Expected graduation: June 2027) | Current CPI: 6.7
- Coursework: Data Structures & Algorithms, Object-Oriented Programming (OOPs), DBMS, Operating Systems, Computer Networks.
- Schooling: Intermediate from **Lucknow Public School, Lucknow** (Class XII, May 2022) | Score: 75%`;
  }

  return `Hello! I am Sagar's AI assistant. 

Sagar Mishra is a B.Tech Computer Science student at GLA University, Lucknow, specializing in MERN Stack Development, Java, and Data Structures & Algorithms. 

Feel free to ask me about:
- 💻 His **technical skills** (Java, JavaScript, React, Node.js, MongoDB)
- 🚀 His **key projects** (QuickBite, SmartScribe, ChatWave)
- 🎓 His **education** or **certifications** (Google Cybersecurity, Google GenAI, NPTEL)
- ✉️ How to **contact** him (sagar.mishra_cs23@gla.ac.in)

*(Note: My online AI engine is currently resting, so I am answering using my built-in profile database!)*`;
}

export async function POST(request: Request) {
  let lastUserMessage = '';
  try {
    const { messages } = await ioParseBody(request);
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required and must be an array' }, { status: 400 });
    }

    lastUserMessage = messages[messages.length - 1]?.content || '';
    const apiKey = process.env.DEEPSEEK_API_KEY;

    // Fallback response if no DeepSeek API key is configured
    if (!apiKey) {
      const fallbackResponse = getStaticFallbackResponse(lastUserMessage);
      await logMessage(lastUserMessage, fallbackResponse);
      return NextResponse.json({ message: fallbackResponse });
    }

    // Call DeepSeek API
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map((m: any) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('DeepSeek API error response:', errText);
      
      // Fallback to static assistant responses if API fails/has insufficient balance
      const fallbackResponse = getStaticFallbackResponse(lastUserMessage);
      await logMessage(lastUserMessage, fallbackResponse);
      return NextResponse.json({ message: fallbackResponse });
    }

    const json = await response.json();
    const botResponse = json.choices[0]?.message?.content || 'Sorry, I encountered an issue generating a response.';

    await logMessage(lastUserMessage, botResponse);
    return NextResponse.json({ message: botResponse });
  } catch (error: any) {
    console.error('AI Assistant API error:', error);
    
    // Safety fallback responder
    const fallbackResponse = getStaticFallbackResponse(lastUserMessage);
    try {
      await logMessage(lastUserMessage, fallbackResponse);
    } catch (e) {}
    
    return NextResponse.json({ message: fallbackResponse });
  }
}

// Utility to parse request body safely
async function ioParseBody(request: Request) {
  try {
    return await request.json();
  } catch (e) {
    return {};
  }
}
