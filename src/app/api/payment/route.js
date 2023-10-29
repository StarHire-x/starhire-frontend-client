//Get the Coporate as we need the status, will be put within the navbar

export const getCorporateByUserID = async (id, accessToken) => {
    try {
      console.log('TEST');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/corporate/${id}`,
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
      //console.log(response);
      if (response.statusCode === 200) {
        console.log(response.data);
        return await response.data;
      } else {
        throw new Error(response.message || 'An error occurred');
      }
    } catch (error) {
      console.log('There was a problem fetching the job applications', error);
      throw error;
    }
  };