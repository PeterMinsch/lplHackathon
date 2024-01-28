import axios from "axios";

const messageAxios = axios.create({
  baseURL: "http://localhost:5000/",
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

async function sendMessage(body) {
  try {
    const response = await messageAxios.get("/message/send", {
      UserID: body.UserID,
      message: body.message,
    });
  } catch (error) {
    console.log(
      "Error during sending message to API",
      error.response.data.message
    );
  }
}

async function loadPrevMessages(body) {
  try {
    const response = await messageAxios.get("/auth/loadPrevMessages", {
      ChatroomID: body.ChatroomID,
    });
  } catch (error) {
    console.log(
      "Error during GET for prev messages: ",
      error.response.data.message
    );
  }
}

export { sendMessage, loadPrevMessages };
