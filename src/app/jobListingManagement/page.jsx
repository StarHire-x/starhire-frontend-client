'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function JobListingManagement() {
  const session = useSession();

  const router = useRouter();

  console.log(session);

  if (session.status === 'unauthenticated') {
    router?.push('/login');
  }
}
