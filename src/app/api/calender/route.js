import { NextResponse } from "next/server";

// export const createJobApplication = async (newJobApplication, accessToken) => {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/job-application`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(newJobApplication),
//         cache: "no-store",
//       }
//     );
//     const response = await res.json();

//     if (response.statusCode === 200) {
//       return response.data;
//     } else {
//       throw new Error(response.message || "An error occurred");
//     }
//   } catch (error) {
//     console.log("There was a problem creating this jobListing", error);
//     throw error;
//   }
// };

export const getInterviewDates = async (
  userId,
  role,
  accessToken
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/interview/${userId}/${role}`,
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
    //console.log(response);
    if (response.statusCode === 200) {
      return response;
    } else {
      return NextResponse.json(
        { error: response.message },
        { status: response.statusCode }
      );
    }
  } catch (error) {
    console.log("There was a problem finding interviews", error);
  }
};