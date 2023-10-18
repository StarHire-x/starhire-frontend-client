'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import CreateATicketForm from '@/components/CreateATicketForm/CreateATicketForm';
import CreateATicketFormUnLoggedIn from '@/components/CreateATicketForm/CreateATicketFormUnLoggedIn';
import styles from './page.module.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Enums from '@/common/enums/enums';
import { createTicket } from '@/app/api/Ticket/route';
import { reportForumPostByPostId } from '@/app/api/forum/route';

const CreateATicketPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const session = useSession();
  const router = useRouter();

  const userIdRef =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.userId;

  const accessToken =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.accessToken;

  const userLoggedIn =
    session.status === 'authenticated' &&
    session.data &&
    session.data.user.role;

  console.log(userLoggedIn);

  const params = useSearchParams();
  const problem = params.get('problem');
  //this param is only used when user wish to report the forum post directly from the forum website.
  const forumPostId = params.get('forumPostId'); //it will fetch the forum post id from forum page to ticket page.

  const toast = useRef(null);

  const handleTicketCreation = async (newTicket) => {
    let payload;
    try {
      if (userLoggedIn === 'Corporate') {
        payload = {
          ...newTicket,
          corporateId: userIdRef,
          ticketCategory: problem,
        };
      } else if (userLoggedIn === 'Job_Seeker') {
        payload = {
          ...newTicket,
          jobSeekerId: userIdRef,
          ticketCategory: problem,
        };

        if (forumPostId) {
          // update forum post status to "Reported"
          await reportForumPostByPostId(forumPostId, accessToken);
        }
      } else {
        payload = {
          ...newTicket,
          ticketCategory: problem,
        };
      }
      const response = await createTicket(payload, accessToken);
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Your Ticket has been sent to our Admin Team for review',
        life: 5000,
      });
      setRefreshData((prev) => !prev);
    } catch (error) {
      console.error('There was an error creating the ticket', error.message);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 5000,
      });
    }
    setShowCreateDialog(false);
  };

  if (isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <ProgressSpinner />
      </div>
    );
  }

  if (
    session.status === 'authenticated' ||
    session.status === 'unauthenticated'
  ) {
    return (
      <>
        <Toast ref={toast} />
        <div className={styles.header}>
          <h1 className={styles.headerTitle} style={{ marginBottom: '15px' }}>
            Ticket Management
          </h1>
        </div>

        <div className={styles.cardsGrid}>
          {session.status === 'unauthenticated' ? (
            <CreateATicketFormUnLoggedIn onCreate={handleTicketCreation} />
          ) : (
            <CreateATicketForm
              onCreate={handleTicketCreation}
              forumPostId={forumPostId}
            />
          )}
        </div>
      </>
    );
  }
};

export default CreateATicketPage;
