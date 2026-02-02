import dynamic from 'next/dynamic';

const ForumContent = dynamic(() => import('./ForumClient'), { ssr: false });

export default function ForumPage() {
  return <ForumContent />;
}
