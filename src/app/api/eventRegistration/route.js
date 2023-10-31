import { NextResponse } from 'next/server';

export const createEventRegistration = async (
  newEventRegistration,
  accessToken
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/event-registration`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newEventRegistration),
        cache: 'no-store',
      }
    );
    const response = await res.json();

    if (response.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(response.message || 'An error occurred');
    }
  } catch (error) {
    console.log('There was a problem creating this event registration', error);
    throw error;
  }
};

export const findExistingJobApplication = async (
  jobSeekerId,
  eventListingId,
  accessToken
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/event-registration/existing/${jobSeekerId}/${eventListingId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );
    const response = await res.json();
    console.log('Find existing event registration');
    console.log(response);
    if (response.statusCode === 200 || response.statusCode === 404) {
      return response;
    } else {
      return NextResponse.json(
        { error: response.message },
        { status: response.statusCode }
      );
    }
  } catch (error) {
    console.log('There was a problem finding this event registration', error);
  }
};
