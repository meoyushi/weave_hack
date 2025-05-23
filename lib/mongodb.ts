import { getAuth } from '@clerk/nextjs/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { UserProfile } from '@/types/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'portfolio');
    const userProfile = await db.collection<UserProfile>('userProfiles').findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}