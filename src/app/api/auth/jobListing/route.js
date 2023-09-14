export const findAllJobListingsByCorporate = async (accessToken) => {
  try {
    const res = await fetch(
      `http://localhost:8080/jobListing/corporate/${session.user.userId}`,
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
      throw new Error(errorData.message || 'An error occurred');
    }
    return await res.json();
  } catch (error) {
    console.log('There was a problem fetching the job listings', error);
    throw error;
  }
};

export const createJobListing = async (newJobListing, accessToken) => {
  try {
    const res = await fetch(`http://localhost:8080/jobListing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(newJobListing),
      cache: 'no-store',
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData);
      throw new Error(errorData.message);
    }
    return await res.json();
  } catch (error) {
    console.log('There was a problem creating this jobListing', error);
    throw error;
  }
};

export const updateJobListing = async (request, id, accessToken) => {
  try {
    const res = await fetch(`http://localhost:8080/jobListing/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request),
    });

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

export const removeJobListing = async (request, id) => {
  try {
    const res = await fetch(`http://localhost:8080/jobListing/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

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
