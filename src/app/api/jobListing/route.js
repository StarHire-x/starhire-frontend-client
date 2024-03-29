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
    const transformedData = {
      ...newJobListing,
      requiredDocuments: newJobListing.requiredDocuments.join(','),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/job-listing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(transformedData),
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
    const transformedData = {
      ...request,
      requiredDocuments: request.requiredDocuments.join(','),
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/job-listing/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(transformedData),
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
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/saved-job-listing/save/${jobListingId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }
    // Check if there's any content to parse before trying to parse it
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.log('There was a problem saving the job listing', error);
    throw error;
  }
};

export const fetchSavedJobListings = async (userId, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/saved-job-listing/saved/${userId}`,
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

export const unsaveJobListing = async (jobListingId, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/saved-job-listing/unsave/${jobListingId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.log('There was a problem un-saving the job listing', error);
    throw error;
  }
};

export const checkIfJobIsSaved = async (jobListingId, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/saved-job-listing/is-saved/${jobListingId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    );

    if (res.status === 200) {
      return { statusCode: 200 };
    } else if (res.status === 404) {
      return { statusCode: 404 };
    } else {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }
  } catch (error) {
    console.log(
      'There was a problem checking if the job listing is saved',
      error
    );
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

    // Check if the response is an array
    if (Array.isArray(jobListings)) {
      // Fetch saved status for each job listing
      const jobsWithSavedStatus = await Promise.all(
        jobListings.map(async (job) => {
          try {
            const savedStatus = await checkIfJobIsSaved(
              job.jobListingId,
              accessToken
            );
            return {
              ...job,
              isSaved: savedStatus.statusCode === 200,
            };
          } catch (error) {
            console.error(
              `Error checking saved status for job ${job.jobListingId}:`,
              error
            );
            // In case of an error, default to not saved
            return { ...job, isSaved: false };
          }
        })
      );

      return jobsWithSavedStatus;
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

export const removeJobListingAssignment = async (
  jobSeekerId,
  jobListingId,
  accessToken
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/job-listing/rejectJobListing/${jobSeekerId}/${jobListingId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const response = await res.json();

    if (response.statusCode === 200) {
      return response;
    } else {
      throw new Error(response.message || 'An error occurred');
    }
  } catch (error) {
    console.log(
      'There was a problem assigning job listing to job seekers and assigning job listing to job seekers',
      error
    );
    throw error;
  }
};
