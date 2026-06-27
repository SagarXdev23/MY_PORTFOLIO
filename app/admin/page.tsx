import React from 'react';
import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import AdminDashboardClient from '@/components/AdminDashboardClient';

export const revalidate = 0; // Force server-side execution without caching for log updates

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  // Enforce secure cryptographic validation on the server side
  if (!token) {
    redirect('/admin/login');
  }

  const payload = verifyToken(token);
  if (!payload) {
    redirect('/admin/login');
  }

  // Load chat logs from data/chat_logs.json
  let chatLogs: any[] = [];
  try {
    const filePath = path.join(process.cwd(), 'data', 'chat_logs.json');
    const content = await fs.readFile(filePath, 'utf-8');
    chatLogs = JSON.parse(content);
    chatLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    // If file doesn't exist yet, proceed with empty logs
  }

  // Load contact logs from data/contact_logs.json
  let contactLogs: any[] = [];
  try {
    const filePath = path.join(process.cwd(), 'data', 'contact_logs.json');
    const content = await fs.readFile(filePath, 'utf-8');
    contactLogs = JSON.parse(content);
    contactLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    // If file doesn't exist yet, proceed with empty logs
  }

  return (
    <main className="min-h-screen bg-bg-secondary text-white">
      <AdminDashboardClient chatLogs={chatLogs} contactLogs={contactLogs} />
    </main>
  );
}
