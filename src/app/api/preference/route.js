import { NextResponse } from "next/server";
import { ConnectedOverlayScrollHandler } from "primereact/utils";

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
    if (response.statusCode === 200) {
      return response.data;
    } else {
      console.log("Encountered the following error when creating job preference: " + response.message);
      return NextResponse.json({ error: response.message }, { status: response.statusCode });
    }
  } catch (error) {
    console.log("Encountered an unexpected problem when creating the job preference", error.message);
  }
};

export const getExistingJobPreference = async (userId, role, accessToken) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/job-preference/${role}/${userId}`,
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
      return NextResponse.json({ error: response.message }, { status: response.statusCode });
    }
  } catch (error) {
    console.log("Encountered a problem when fetching job preference", error.message);
  }
};

export const updateJobPreference = async (jobPreferenceId, updateJobPreference, accessToken) => {
    try {
      console.log("Sending request...")
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
      console.log("received response: ", response)
      if (response.statusCode === 200) {
        return response;
      } else {
        return NextResponse.json({ error: response.message }, { status: response.statusCode });
      }
    } catch (error) {
      console.log("Encountered a problem when updating the job preference", error.message);
    }
}
