export const getAllCorporateInvoices = async (accessToken, corporateId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/invoice/corporate-id/${corporateId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }
    return await res.json();
  } catch (error) {
    console.log(
      `There was a problem fetching the invoices under corporateId ${corporateId}`,
      error
    );
    throw error;
  }
};

export const updateInvoicePayment = async (accessToken, invoiceId, request) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/invoice/invoice-payment/${invoiceId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(request),
      }
    );

    if (res.ok) {
      console.log(res);
      return res;
    } else {
      throw new Error(errorData.message || "An error occurred");
    }
  } catch (error) {
    console.log("There was a problem updating the job application", error);
    throw error;
  }
};

export const getCorporateInvoiceStats = async (userId, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/invoice/oneCorporate/${userId}`,
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
    if (response.statusCode === 200) {
      return response.data;
    } else {
      throw error;
    }
  } catch (error) {
    console.log("There was a problem updating the job application", error);
    throw error;
  }
};
