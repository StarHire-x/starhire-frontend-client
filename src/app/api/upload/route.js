export const uploadFile = async (file, accessToken) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData, // You don't need the content-type header, browsers will automatically recognize the multipart form data
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || 'An error occurred during the file upload.'
      );
    }
    const responseJson = await res.json();
    return responseJson;
  } catch (error) {
    console.log('There was a problem uploading the file', error);
    throw error;
  }
};

export const uploadFileNonAccessToken = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || 'An error occurred during the file upload.'
      );
    }
    const responseJson = await res.json();
    return responseJson;
  } catch (error) {
    console.log('There was a problem uploading the file', error);
    throw error;
  }
};

export const generateResume = async (jobSeekerData, accessToken) => {
  try {
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(jobSeekerData), // You don't need the content-type header, browsers will automatically recognize the multipart form data
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || "An error occurred during the file upload."
      );
    }
    const responseJson = await res.json();
    return responseJson;
  } catch (error) {
    console.log("There was a problem uploading the pdf", error);
    throw error;
  }
};