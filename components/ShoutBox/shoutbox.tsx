import React, { useState, useEffect, useRef } from 'react';
import MessageInput from './messageinput';
import NameInput from './nameinput';
import MessageFormatter from './messageformatter';

const wsURL = process.env.NEXT_PUBLIC_SHOUTBOX_SOURCE || 'ws://localhost:3030';

interface ShoutBoxProps {
  limit: number;
  isOpen: boolean;
}

const Chat = ({ limit, isOpen }: ShoutBoxProps) => {
  const [name, setName] = useState('');
  const [isAdmin, setAdmin] = useState(false);
  const [messages, setMessages] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [colorSwitcher, setColorSwitcher] = useState(false);
  const webSocket = useRef<WebSocket>(null);
  const messagesViewport = useRef(null);

  useEffect(() => {
    // Connect client
    webSocket.current = new WebSocket(wsURL);
    webSocket.current.onopen = () => {
      webSocket.current.send(
        JSON.stringify({
          type: 'reload',
        })
      );

      if (!!name) {
        handleSubmitName(name);
      }

      setWsConnected(true);
    };

    // When receiving a message
    webSocket.current.onmessage = (e: any) => {
      if (e.data === 'PING') {
        return webSocket.current.send('PONG');
      }

      const { type, name, message } = JSON.parse(e.data);

      if (type === 'message' && name && message) {
        addMessage({ name, message });
      } else if (type === 'admin') {
        setAdmin(true);
      }
      // delete all messages from the banned person, unless this is them
      else if (type === 'ban' && name === 'Toimitus' && message !== name) {
        setMessages(messages.filter((m) => m.name !== message));
      }
      // load 20 newest messages on connect
      else if (type === 'reload' && name === 'Palvelin' && message) {
        message.forEach((m: any) => {
          addMessage(m);
        });
      }
    };

    // When connection closes
    webSocket.current.onclose = () => {
      const timer = setTimeout(() => setWsConnected(false), 5000);
      return () => clearTimeout(timer);
    };

    // scrollToBottom();
  }, []);

  function addMessage(message: any) {
    message = {
      ...message,
      color: colorSwitcher,
    };

    console.log(colorSwitcher);

    setMessages((messages) => [...messages, message].slice(-limit));
    colorSwitcher ? setColorSwitcher(false) : setColorSwitcher(true);
    scrollToBottom();
  }

  function submitMessage(messageString: string) {
    // on submitting the MessageSend form, send the message, add it to the list and reset the input
    const message = {
      type: 'message',
      name: name,
      message: messageString,
    };
    webSocket.current.send(JSON.stringify(message));
  }

  function handleSubmitName(name: string) {
    const message = {
      type: 'init',
      name,
    };

    webSocket.current.send(JSON.stringify(message));
  }

  function handleBanClick(name: string) {
    const message = {
      type: 'ban',
      name: name,
      message: name,
    };

    webSocket.current.send(JSON.stringify(message));
  }

  function scrollToBottom() {
    const el = messagesViewport.current;
    if (el) {
      el.scrollTo(0, el.scrollHeight);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="flex max-h-60 w-full max-w-6xl flex-col py-6 px-[25px] lg:flex-row">
      <div className="overflow-auto overflow-x-hidden" ref={messagesViewport}>
        <div className="text-white">
          {messages.map((message, index) => (
            <MessageFormatter
              key={index}
              message={message.message}
              name={message.name}
              color={index % 2 === 0 ? 'bg-coral' : 'bg-teal'}
              isAdmin={isAdmin}
              onBanClick={handleBanClick}
            />
          ))}
          {!wsConnected && (
            <div className="sbNotConnectedText">
              Ei yhteyttä chat-palvelimeen
            </div>
          )}
        </div>
        <div className="sbInputArea">
          {name ? (
            <MessageInput
              name={isAdmin ? 'Toimitus' : name}
              onSubmitMessage={(messageString: string) =>
                submitMessage(messageString)
              }
            />
          ) : (
            <NameInput
              onSubmitName={(name: string) => {
                handleSubmitName(name);
                setName(name);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;