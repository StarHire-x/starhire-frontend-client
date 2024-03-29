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

export const findAllEventRegistrationsByEventListing = async (
  id,
  accessToken
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/event-listing/corporate/eventRegistrations/${id}`,
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
    if (response.statusCode === 200) {
      return await response.data;
    } else {
      throw new Error(response.message || 'An error occurred');
    }
  } catch (error) {
    console.log('There was a problem fetching the event registrations', error);
    throw error;
  }
};

export const findAllEventListings = async (accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/event-listing`,
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
    console.log('There was a problem fetching all event listings', error);
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

export const updateEventListing = async (request, id, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/event-listing/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(request),
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData);
      throw new Error(errorData.message);
    }
    return await res.json();
  } catch (error) {
    console.log('There was a problem fetching all event listings', error);
    throw error;
  }
};

export const cancelEventListing = async (id, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/event-listing/${id}/cancel`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData);
      throw new Error(
        errorData.message || 'An error occurred while cancelling the event'
      );
    }

    return await res.json();
  } catch (error) {
    console.log('There was a problem cancelling the event listing', error);
    throw error;
  }
};

// export const removeEventListing = async (id, accessToken) => {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/event-listing/${id}`,
//       {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${accessToken}`,
//         },
//         cache: 'no-store',
//       }
//     );

//     console.log(res);
//     if (res.ok) {
//       return;
//     } else {
//       throw new Error(errorData.message || 'An error occurred');
//     }
//     return await res.json();
//   } catch (error) {
//     console.log('There was a problem deleting this event listing', error);
//     throw error;
//   }
// };

export const viewAllPremiumUsers = async (accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/corporate/premium-users`,
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
    console.log('There was a problem fetching all Premium users', error);
    throw error;
  }
};

export const viewAllNonPremiumUsers = async (accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/corporate/non-premium-users`,
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
    console.log('There was a problem fetching all non Premium users', error);
    throw error;
  }
};

export const findAllRegisteredEvents = async (userId, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/event-registration/existing-events/${userId}`,
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

export const getAllPremiumUsersEvents = async (accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/event-listing/premium-events`,
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

export const getAllNonPremiumUsersEvents = async (accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/event-listing/non-premium-events`,
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
