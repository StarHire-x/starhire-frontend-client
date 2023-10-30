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
//Create a checkout session
/*
export const createCheckoutSession = async (newCheckoutSession, accessToken) => {
    try {
      console.log(newCheckoutSession);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(newCheckoutSession),
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
      console.log('There was a problem creating this checkout session', error);
      throw error;
    }
  };
  */

  export const createCheckoutSession = async (newCheckoutSession, accessToken) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(newCheckoutSession),
          cache: 'no-store',
        }
      );
  
      // Handle response directly as Stripe session object
      const sessionData = await res.json();
      console.log('API Response Status Code:', res.status);
      console.log(sessionData.data);
  
      if (res.status === 201) {
        return sessionData.data; // This should be the Stripe session object.
      } else {
        throw new Error(sessionData.message || 'An error occurred');
      }
    } catch (error) {
      console.log('There was a problem creating this checkout session', error);
      throw error;
    }
  };
  