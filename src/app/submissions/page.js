import sql, { initDb } from '@/lib/db';
import SubmissionsList from './SubmissionsList';

// Opt out of caching so it always fetches latest submissions
export const dynamic = 'force-dynamic';

export default async function SubmissionsPage() {
  await initDb().catch(e => console.error(e));
  
  let submissions = [];
  try {
    const { rows } = await sql`SELECT * FROM submissions ORDER BY createdAt DESC`;
    submissions = rows;
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
  }
  
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SubmissionsList initialData={submissions} />
      </div>
    </div>
  );
}
