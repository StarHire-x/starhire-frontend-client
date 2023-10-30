export const getCorporateByUserID = async (id, accessToken) => {
    try {
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
      const sessionData = await res.json();
      console.log('API Response Status Code:', res.status);
      console.log(sessionData.data);
  
      if (res.status === 201) {
        return sessionData.data; 
      } else {
        throw new Error(sessionData.message || 'An error occurred');
      }
    } catch (error) {
      console.log('There was a problem creating this checkout session', error);
      throw error;
    }
  };

  //get the subscription details
  export const getCorporateNextBillingCycleBySubID = async (id, accessToken) => {
    try {
      console.log("I AM HERE");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/billing-cycle-details/${id}`,
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
        console.log(response.data);
        return await response.data;
      } else {
        throw new Error(response.message || 'An error occurred');
      }
    } catch (error) {
      console.log('There was a problem fetching the Bill cycle', error);
      throw error;
    }
  };
  