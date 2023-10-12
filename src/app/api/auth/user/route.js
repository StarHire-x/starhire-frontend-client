import { NextResponse } from "next/server";

export const createUser = async (userData) => {
  try {
    console.log(userData)
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message }, { status: errorData.statusCode });
      // throw new Error(errorData.message || "An error occurred");
    }
    return await response;
  } catch (error) {
    console.log("Encountered a problem when creating a new user", error);
    // return NextResponse.json({ error: error }, { status: 500 });
  }
};

export const getUsers = async (accessToken) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "An error occurred");
    }

    return await res.json();
  } catch (error) {
    console.log("There was a problem fetching the users", error);
    throw error;
  }
};

export const updateUser = async (request, id, accessToken) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request),
    });

    if (res.ok) {
      return true;
    } else {
      throw new Error(errorData.message || "An error occurred");
    }
    return await res.json();
  } catch (error) {
    console.log("There was a problem fetching the users", error);
    throw error;
  }
};

export const deleteUser = async (request, id) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}?role=${request}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    console.log(res);
    if (res.ok) {
      return;
    } else {
      throw new Error(errorData.message || "An error occurred");
    }
    return await res.json();
  } catch (error) {
    console.log("There was a problem fetching the users", error);
    throw error;
  }
};

export const getUserByEmailRole = async (email, role) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/find?email=${email}&role=${role}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    const responseBody = await res.json();

    if (responseBody.statusCode === 404) {
      throw new Error(responseBody.message || "An error occurred");
    }
    return await responseBody;
  } catch (error) {
    console.log("There was a problem fetching the users", error);
    throw error;
  }
};

export const getUserByUserId = async (userId, role, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/search?userId=${userId}&role=${role}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );
    const responseBody = await res.json();

    if (responseBody.statusCode === 404) {
      throw new Error(responseBody.message || "An error occurred");
    }
    return await responseBody;
  } catch (error) {
    console.log("There was a problem fetching the users", error);
    throw error;
  }
};

export const getAllCorporateSocial = async (accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/corporate/social`,
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
      throw new Error(response.message || "An error occurred");
    }
  } catch (error) {
    console.log(
      "There was a problem obtaining the job application from job seeker",
      error
    );
    throw error;
  }
}

export const followCorporate = async (corporateId, jobSeekerId, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/corporate/following/${corporateId}/${jobSeekerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const response = await res.json();

    if (response.statusCode === 200) {
      return response.message;
    } else {
      throw new Error(response.message || "An error occurred");
    }
  } catch (error) {
    console.log(
      "There was a problem obtaining the job application from job seeker",
      error
    );
    throw error;
  }
};

export const unfollowCorporate = async (
  corporateId,
  jobSeekerId,
  accessToken
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/corporate/unfollow/${corporateId}/${jobSeekerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const response = await res.json();

    if (response.statusCode === 200) {
      return response.message;
    } else {
      throw new Error(response.message || "An error occurred");
    }
  } catch (error) {
    console.log(
      "There was a problem obtaining the job application from job seeker",
      error
    );
    throw error;
  }
};

export const getMyFollowings = async (
  jobSeekerId,
  accessToken
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/job-seeker/followings/${jobSeekerId}`,
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
      throw new Error(response.message || "An error occurred");
    }
  } catch (error) {
    console.log(
      "There was a problem obtaining the job application from job seeker",
      error
    );
    throw error;
  }
};