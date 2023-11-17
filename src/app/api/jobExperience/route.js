export const createJobExperience = async (newJobExperience, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/job-experience`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newJobExperience),
        cache: "no-store",
      }
    );
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

export const getJobExperience = async (userId, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/job-experience/job-seeker/${userId}`,
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
      return response;
    } else {
      throw new Error(response.message || "An error occured");
    }
  } catch (error) {
    console.log("There was a problem fetching job preference", error);
    throw error;
  }
};

export const updateJobExperience = async (
  jobExperienceId,
  updateJobExperience,
  accessToken
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/job-experience/${jobExperienceId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updateJobExperience),
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
    console.log("There was a problem fetching job experience", error);
    throw error;
  }
};


export const deleteJobExperience = async (
  jobExperienceId,
  accessToken
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/job-experience/${jobExperienceId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );
    return await res.json();
  } catch (error) {
    console.log("There was a problem fetching job preference", error);
    throw error;
  }
};
