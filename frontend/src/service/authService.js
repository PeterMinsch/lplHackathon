import axios from "axios";

const authAxios = axios.create({
  baseURL: "http://localhost:5001/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // added this for local testing
});

async function signUpStudent(body) {
  try {
    const response = await authAxios.post("/auth/create-user", {
      Username: body.Username,
      AuthenticationData: body.AuthenticationData,
      FirstName: body.FirstName,
      LastName: body.LastName,
      Email: body.Email,
    });
    return response;
  } catch (error) {
    console.error("Error during student sign up:", error.response.data.message);
    return error.response;
  }
}

async function login(body) {
  try {
    const response = await authAxios.post("/auth/login", {
      Email: body.Email,
      AuthenticationData: body.AuthenticationData,
    });
    if (response.status === 200 && response.data && response.data.User) {
      // if a user
      return response.data.User;
    } else {
      console.error("Unexpected server response:", response);
      throw new Error("Failed to log in. Unexpected response from server.");
    }
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message ||
          "Failed to log in. Please check your credentials."
      );
    } else if (error.request) {
      console.error("No response received:", error.request);
      throw new Error("Failed to log in. Server did not respond.");
    } else {
      console.error("Error setting up request:", error.message);
      throw new Error("Failed to log in. Please try again.");
    }
  }
}

export const verifyRole = async () => {
  try {
    const response = await authAxios.get("/auth/verify", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error verify role: ", error);
    throw error;
  }
};

export { signUpStudent, login };
