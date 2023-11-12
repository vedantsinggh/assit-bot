import axios from 'axios';
import React, { useState } from 'react';
import { ScrollView, TextInput, Button, View, Text } from 'react-native';

const App = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');

  const onSend = async () => {
    setMessages([...messages, `You: ${input}`]);

    const response = await getChatGPTResponse(input);

    setMessages([...messages, `You: ${input}`, `ChatGPT: ${response}`]);
    setInput('');
  };

const getChatGPTResponse = async (message: string): Promise<string> => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: message,
        max_tokens: 60,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer your-api-key`,
        },
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].text.trim();
    } else {
      throw new Error('No response from ChatGPT');
    }
  } catch (error) {
    console.error(error);
    return 'An error occurred while getting response from ChatGPT';
  }
};

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ScrollView style={{ flex: 1 }}>
        {messages.map((message, index) => (
          <Text key={index}>{message}</Text>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, marginRight: 10 }}
          value={input}
          onChangeText={setInput}
        />
        <Button title="Send" onPress={onSend} />
      </View>
    </View>
  );
};

export default App;
