import axios from 'axios';
import React, { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface IMessage {
  id: string;
  text: string;
  createdAt: Date;
  user: string;
}

const App = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState<string>('');

  const onSend = async () => {
    const userMessage: IMessage = {
      id: Math.random().toString(),
      text: input,
      createdAt: new Date(),
      user: 'user',
    };

    setMessages([...messages, userMessage]);

    // Replace this with the actual API call
    const response = await getChatGPTResponse(input);

    const botMessage: IMessage = {
      id: Math.random().toString(),
      text: response,
      createdAt: new Date(),
      user: 'bot',
    };

    setMessages([...messages, userMessage, botMessage]);
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
            Authorization: `Bearer API`,
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
    <View style={styles.container}>
      <Text style={styles.title}>Assistant</Text>
      <ScrollView style={styles.chatContainer}>
        {messages.map((message, index) => (
          <View key={index} style={message.user === 'user' ? styles.userMessageBox : styles.botMessageBox}>
            <Text style={message.user === 'user' ? styles.userMessageText : styles.botMessageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={onSend}>
          <Icon name="send" size={30} color="#0084ff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chatContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  userMessageBox: {
    alignSelf: 'flex-end',
    backgroundColor: '#0084ff',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  botMessageBox: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#000',
  },
});

export default App;
