import axios from "axios";

const messageAxios = axios.create({
  baseURL: "http://localhost:5001/",
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

async function sendMessage(body) {
  try {
    const response = await messageAxios.post("/messages/send", {
      UserID: body.UserID,
      message: body.message,
    });

    // Return the relevant data from the response
    return response.data;
  } catch (error) {
    console.error("Error during sending message to API", error);

    // Optionally throw an error or return a specific value
    throw new Error("Failed to send message");
  }
}

async function loadPrevMessages(body) {
  try {
    const response = await messageAxios.get("/auth/loadPrevMessages", {
      ChatroomID: body.ChatroomID,
    });
    return response.data;
  } catch (error) {
    console.log(
      "Error during GET for prev messages: ",
      error.response.data.message
    );
  }
}

export { sendMessage, loadPrevMessages };
