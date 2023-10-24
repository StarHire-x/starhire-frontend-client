'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import styles from './page.module.css';

const EventPage = () => {
  const session = useSession();
  const router = useRouter();

  const [eventListings, setEventListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  const jobSeekerId =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.userId;
};

const toast = useRef(null);

export default EventPage;
