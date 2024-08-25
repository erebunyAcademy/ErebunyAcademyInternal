import React from 'react';
import { redirect } from 'next/navigation';
import ProfilePage from '@/components/pages/ProfilePage';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import { ROUTE_SIGN_IN } from '@/utils/constants/routes';

const Profile = async () => {
  const session = await serverSession();

  if (!session) {
    redirect(ROUTE_SIGN_IN);
  }

  return session.user && <ProfilePage sessionUser={session.user} />;
};

export default Profile;
