export const findAllEventListingsByCorporate = async (userId, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/event-listing/corporate/${userId}`,
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
    console.log('There was a problem fetching the event listings', error);
    throw error;
  }
};

export const createEventListing = async (newEventListing, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/event-listing`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newEventListing),
        cache: 'no-store',
      }
    );
    const response = await res.json();
    console.log('API Response Status Code:', response.statusCode);
    if (response.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(response.message || 'An error occurred');
    }
  } catch (error) {
    console.log('There was a problem creating this Event Listing', error);
    throw error;
  }
};
