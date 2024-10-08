'use client';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function SignInButton(): JSX.Element {
  const { data: session } = useSession();
  useEffect(() => {
    if (!session) {
      signIn('defra-b2c');
    }
  }, [session]);
  return <></>;
}
