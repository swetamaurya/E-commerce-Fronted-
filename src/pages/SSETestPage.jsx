import { useState, useEffect, useRef } from "react";
import { orderSSE } from "../services/api";

export default function SSETestPage() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const connectSSE = () => {
      try {
        console.log('Testing SSE connection...');
        const eventSource = orderSSE.connect();
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          console.log('SSE connection opened');
          setIsConnected(true);
          setMessages(prev => [...prev, { type: 'info', message: 'Connected to SSE', timestamp: new Date() }]);
        };

        eventSource.onmessage = (event) => {
          console.log('SSE message received:', event.data);
          const data = JSON.parse(event.data);
          setMessages(prev => [...prev, { type: 'message', message: JSON.stringify(data, null, 2), timestamp: new Date() }]);
        };

        eventSource.onerror = (error) => {
          console.error('SSE connection error:', error);
          setIsConnected(false);
          setMessages(prev => [...prev, { type: 'error', message: `Error: ${error.type}`, timestamp: new Date() }]);
        };

      } catch (error) {
        console.error('Error creating SSE connection:', error);
        setMessages(prev => [...prev, { type: 'error', message: `Connection failed: ${error.message}`, timestamp: new Date() }]);
      }
    };

    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">SSE Connection Test</h1>
        
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-lg font-medium">
              Status: {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={clearMessages}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Clear Messages
          </button>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">SSE Messages:</h3>
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet...</p>
          ) : (
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <div key={index} className={`p-2 rounded text-sm ${
                  msg.type === 'error' ? 'bg-red-100 text-red-800' :
                  msg.type === 'info' ? 'bg-blue-100 text-blue-800' :
                  'bg-white text-gray-800'
                }`}>
                  <div className="font-mono text-xs text-gray-500 mb-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                  <pre className="whitespace-pre-wrap">{msg.message}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
