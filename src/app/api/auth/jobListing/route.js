export const findAllJobListingsByCorporate = async (userId, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/job-listing/corporate/${userId}`,
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
    console.log(response);
    if (response.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(response.message || 'An error occurred');
    }
  } catch (error) {
    console.log('There was a problem fetching the job listings', error);
    throw error;
  }
};

export const createJobListing = async (newJobListing, accessToken) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/job-listing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(newJobListing),
      cache: 'no-store',
    });
    const response = await res.json();
    console.log(response);
    if (response.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(response.message || 'An error occurred');
    }
  } catch (error) {
    console.log('There was a problem creating this jobListing', error);
    throw error;
  }
};

export const updateJobListing = async (request, id, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/job-listing/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(request),
      }
    );
    const response = await res.json();
    console.log(response);
    if (response.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(response.message || 'An error occurred');
    }
  } catch (error) {
    console.log('There was a problem fetching the job listings', error);
    throw error;
  }
};

export const removeJobListing = async (id, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/job-listing/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );

    console.log(res);
    if (res.ok) {
      return;
    } else {
      throw new Error(errorData.message || 'An error occurred');
    }
    return await res.json();
  } catch (error) {
    console.log('There was a problem fetching the job listings', error);
    throw error;
  }
};

export const findAssignedJobListingsByJobSeeker = async (
  userId,
  accessToken
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/job-listing/assigned/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );

    // Directly parse the response as JSON, expecting an array
    const jobListings = await res.json();
    console.log(jobListings);

    // Check if the response is an array and return it directly
    if (Array.isArray(jobListings)) {
      return jobListings;
    } else {
      throw new Error('Unexpected response format from the server');
    }
  } catch (error) {
    console.log(
      'There was a problem fetching the assigned job listings for the job seeker',
      error
    );
    throw error;
  }
};

export const getJobApplicationsByJobListingId = async (id, accessToken) => {
  try {
    console.log('TEST');
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/job-listing/corporate/jobApplications/${id}`,
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
    console.log(response);
    if (response.statusCode === 200) {
      return await response.data;
    } else {
      throw new Error(response.message || 'An error occurred');
    }
  } catch (error) {
    console.log('There was a problem fetching the job applications', error);
    throw error;
  }
};

export const getJobSeekersByJobApplicationId = async (id, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/job-Application/corporate/jobSeekers/${id}`,
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
    console.log(response);
    if (response.statusCode === 200) {
      return await response.data;
    } else {
      throw new Error(response.message || 'An error occurred');
    }
  } catch (error) {
    console.log('There was a problem fetching the job applications', error);
    throw error;
  }
};

export const viewOneJobListing = async (jobListingId, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/job-listing/${jobListingId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData);
      throw new Error(errorData.message);
    }
    return await res.json();
  } catch (error) {
    console.log('There was a problem fetching single job listing', error);
    throw error;
  }
};

export const saveJobListing = async (jobListingId, accessToken) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/job-listing/${jobListingId}/save`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ jobListingId: jobListingId }), // Adjust this as needed
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Could not save job listing.');
  }

  return response.json();
};

export const getSavedJobListings = async (accessToken) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/job-listing/saved`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Could not fetch saved job listings.');
  }

  return response.json();
};
