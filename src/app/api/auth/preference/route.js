export const createJobPreference = async (newJobPreference, accessToken) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/job-preference`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(newJobPreference),
      cache: "no-store",
    });
    const response = await res.json();
    console.log(response);
    if (response.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(response.message || "An error occurred");
    }
  } catch (error) {
    console.log("There was a problem creating this jobListing", error);
    throw error;
  }
};

export const getExistingJobPreference = async (userId, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/job-preference/job-seeker/${userId}`,
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
    if(response.statusCode === 200) {
        return response;
    } else {
        throw new Error(response.message || "An error occured");
    }
  } catch (error) {
    console.log("There was a problem fetching job preference", error);
    throw error;
  }
};

export const updateJobPreference = async (jobPreferenceId, updateJobPreference, accessToken) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/job-preference/${jobPreferenceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updateJobPreference),
          cache: "no-store",
        }
      );
      const response = await res.json();
      if (response.statusCode === 200) {
        return response;
      } else {
        throw new Error(response.message || "An error occured");
      }
    } catch (error) {
      console.log("There was a problem fetching job preference", error);
      throw error;
    }
}
