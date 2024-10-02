import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Flask 서버로 POST 요청을 보냅니다.
      const res = await axios.post('http://localhost:5000/api/predict', {
        prompt: prompt,
      });

      // 서버로부터 받은 응답을 상태에 저장합니다.
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error occurred while getting a response from OpenAI');
    }
  };

  return (
    <div>
      <h1>React와 OpenAI 소통</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="질문을 입력하세요"
        />
        <button type="submit">전송</button>
      </form>

      <div>
        <h2>OpenAI 응답:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default App;