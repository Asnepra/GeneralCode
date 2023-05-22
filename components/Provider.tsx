import { Session } from 'next-auth';
import { SessionProvider} from 'next-auth/react';
import React from 'react'

interface ProviderProps {
  children: React.ReactNode;
  sessions?: Session | null | undefined; // Modify type to Session | null | undefined
}
const Provider:React.FC<ProviderProps> = ({
  children,
  sessions
}) => {
  return (
    <SessionProvider session={sessions}>
      {children}
    </SessionProvider>
  )
}

export default Provider;