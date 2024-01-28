import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { sendMessage } from "../service/messageService";

const defaultTheme = createTheme();

export default function LandingPage() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [assistantResponse, setAssistantResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const getMessages = async () => {
    setLoading(true);

    try {
      const userID = sessionStorage.getItem("userID");
      console.log(`userID is ${userID}`);
      console.log(`message is ${userInput}`);
      const response = await sendMessage({
        UserID: 8,
        message: userInput,
      });

      // Ensure the response has the 'choices' property
      if (response.choices && response.choices.length > 0) {
        const messageContent = response.choices[0].message.content;

        // Update chat history with the user's input
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { text: userInput, type: "user" },
        ]);

        // Update chat history with the assistant's response
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { text: messageContent, type: "assistant" },
        ]);

        // Set the assistant's response to display it in the TextField
        setAssistantResponse(messageContent);
      } else {
        console.error("Error: Response data is undefined");
      }

      // Reset user input
      setUserInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle the error, e.g., show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            height: "70vh",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              padding: 2,
              border: "1px solid #ccc",
              borderRadius: "4px",
              display: "flex",
              flexDirection: "column-reverse",
            }}
          >
            {/* Display chat history here */}
            {chatHistory.map((message, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    message.type === "assistant" ? "flex-start" : "flex-end",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    background:
                      message.type === "assistant" ? "#001F3F" : "#FF8C00",
                    padding: "10px",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                >
                  <div>
                    {message.type === "user" && (
                      <span style={{ fontWeight: "bold", marginRight: "5px" }}>
                        User:
                      </span>
                    )}
                    {message.type === "assistant" && (
                      <span style={{ fontWeight: "bold", marginRight: "5px" }}>
                        Vergil:
                      </span>
                    )}
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              marginTop: 2,
            }}
          >
            <TextField
              sx={{ flexGrow: 1, marginRight: 2 }}
              margin="normal"
              required
              fullWidth
              id="message"
              label="Type your message..."
              name="message"
              value={userInput}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#FF8C00", color: "#fff" }}
              onClick={getMessages}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </Button>
          </Box>
          {/* Display assistant's response */}
          <TextField
            sx={{ flexGrow: 1, marginTop: 2 }}
            margin="normal"
            fullWidth
            id="assistant-response"
            label="Assistant's Response"
            name="assistant-response"
            value={assistantResponse}
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {"By "}
            <Link color="inherit" href="https://www.csusm.edu/index.html">
              Vergil
            </Link>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
