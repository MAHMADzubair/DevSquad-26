'use client';

import Comments from './Comments';
import Auth from '@/components/Auth';
import { useAuth } from '@/lib/authContext';

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <main>
      {!user ? <Auth /> : <Comments />}
    </main>
  );
}
