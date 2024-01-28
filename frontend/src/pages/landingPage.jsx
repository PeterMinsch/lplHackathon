import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const defaultTheme = createTheme();

export default function LandingPage() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // Make a request to the OpenAI API with the user's input
      const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_OPENAI_API_KEY",
        },
        body: JSON.stringify({
          prompt: userInput,
          max_tokens: 150,
        }),
      });

      const responseData = await response.json();

      // Update the chat history with the user input and OpenAI's response
      setChatHistory([...chatHistory, { type: "user", text: userInput }]);
      setChatHistory([...chatHistory, { type: "assistant", text: responseData.choices[0].text }]);

      // Clear the user input field
      setUserInput("");
    } catch (error) {
      console.error("Error fetching response from OpenAI:", error);
    }
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
            height: "70vh", // Set the height of the container to 70% of the viewport height
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto", // Enable vertical scroll for the chat history
              padding: 2,
              border: "1px solid #ccc",
              borderRadius: "4px",
              display: "flex",
              flexDirection: "column-reverse", // Display chat history in reverse order
            }}
          >
            {/* Display chat history here */}
            {chatHistory.map((message, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: message.type === "assistant" ? "flex-start" : "flex-end",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    background: message.type === "assistant" ? "#001F3F" : "#FF8C00",
                    padding: "10px",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                >
                  <div>
                    {message.type === "user" && (
                      <span style={{ fontWeight: "bold", marginRight: "5px" }}>User:</span>
                    )}
                    {message.type === "assistant" && (
                      <span style={{ fontWeight: "bold", marginRight: "5px" }}>Vergil:</span>
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
              onClick={handleFormSubmit}
            >
              Send
            </Button>
          </Box>
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
