import React from 'react';
import ProfilePage from '@/components/pages/ProfilePage';
import { serverSession } from '@/pages/api/auth/[...nextauth]';

const Profile = async () => {
  const session = await serverSession();

  if (!session) return null;

  return <ProfilePage sessionUser={session.user} />;
};

export default Profile;
