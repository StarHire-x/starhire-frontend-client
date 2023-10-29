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
