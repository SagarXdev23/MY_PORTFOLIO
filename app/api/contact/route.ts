import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    
    if (!email || !message) {
      return NextResponse.json({ success: false, error: 'Email and message are required' }, { status: 400 });
    }

    // 1. Log contact query locally for secure Admin Panel access
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    const logPath = path.join(dataDir, 'contact_logs.json');
    
    let logs: any[] = [];
    try {
      const data = await fs.readFile(logPath, 'utf-8');
      logs = JSON.parse(data);
    } catch (e) {
      // File doesn't exist yet, proceed with empty logs
    }
    
    const newLog = {
      timestamp: new Date().toISOString(),
      name: name || 'Anonymous',
      email,
      message
    };
    
    logs.unshift(newLog); // Put new query at the top
    await fs.writeFile(logPath, JSON.stringify(logs, null, 2), 'utf-8');

    // 2. Dispatch/Forward to Formspree email receiver endpoint
    try {
      const formspreeRes = await fetch('https://formspree.io/f/mbdvoezg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name || 'Anonymous',
          email,
          message
        })
      });
      
      if (!formspreeRes.ok) {
        console.error('Formspree dispatch status failed:', formspreeRes.statusText);
      }
    } catch (err) {
      console.error('Formspree dispatch exception occurred:', err);
    }

    return NextResponse.json({ success: true, message: 'Message sent and logged successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to process request' }, { status: 500 });
  }
}
