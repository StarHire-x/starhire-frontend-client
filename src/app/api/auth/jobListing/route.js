export const findAllJobListingsByCorporate = async (userId, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/job-listing/corporate/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const response = await res.json();
    console.log(response)
    if (response.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(response.message || "An error occurred");
    }
  } catch (error) {
    console.log('There was a problem fetching the job listings', error);
    throw error;
  }
};

export const createJobListing = async (newJobListing, accessToken) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/job-listing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(newJobListing),
      cache: "no-store",
    });
    const response = await res.json();
    console.log(response);
    if (response.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(response.message || "An error occurred");
    }
  } catch (error) {
    console.log('There was a problem creating this jobListing', error);
    throw error;
  }
};

export const updateJobListing = async (request, id, accessToken) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/job-listing/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request),
    });
    const response = await res.json();
    console.log(response);
    if (response.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(response.message || "An error occurred");
    }
  } catch (error) {
    console.log('There was a problem fetching the job listings', error);
    throw error;
  }
};

export const removeJobListing = async (id, accessToken) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/job-listing/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
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
