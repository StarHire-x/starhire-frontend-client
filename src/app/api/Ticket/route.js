  export const createTicket = async (newTicket, accessToken) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newTicket),
        cache: 'no-store',
      });
      const response = await res.json();
      console.log("RESPONSE IS: " + res);
      if (response.statusCode === 200) {
        return response.data;
      } else {
        throw new Error(response.message || 'An error occurred');
      }
    } catch (error) {
      console.log('There was a problem creating the Ticket', error);
      throw error;
    }
  };

  