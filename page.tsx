"use client";
import React, { useState } from 'react';
import { Box, Stack, TextField, Button, Typography } from '@mui/material';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#121212" // Dark background for a sleek look
    >
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        border="1px solid #444" // Softer border color
        borderRadius={8} // Rounded corners for a modern look
        p={2}
        spacing={3}
        bgcolor="#1E1E1E" // Slightly lighter than the background
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)" // Subtle shadow for depth
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          sx={{
            '::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant' ? '#3F51B5' : '#f50057' // Primary and secondary colors
                }
                color="white"
                borderRadius={16}
                p={2} // Reduced padding for a cleaner look
                maxWidth="80%" // Limit message width
              >
                <Typography variant="body1">{message.content}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            InputLabelProps={{
              style: { color: '#bbb' }, // Softer label color
            }}
            InputProps={{
              style: { color: 'white' }, // White text for input
            }}
            variant="outlined"
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={sendMessage}
            sx={{
              bgcolor: '#f50057', // Secondary color for the button
              '&:hover': { bgcolor: '#ff4081' }, // Lighter shade on hover
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
