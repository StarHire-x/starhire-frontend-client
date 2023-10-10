  export const createTicket = async (newTicket, accessToken) => {
    try {
      const transformedData = {
        ...newTicket,
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/ticket`, {
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
  