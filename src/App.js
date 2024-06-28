import React, { useState, useEffect } from 'react';
import './App.css';
import Card from './components/Card';
import Loading from './components/Loading';

const App = () => {
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [result, setResult] = useState('');
  const [cardTexts, setCardTexts] = useState(['Contents', 'Pedagogy', 'Edutech']);

  const handleTextInputChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleUpdateClick = async () => {
    setCardTexts([textInput, 'Loading...', 'Loading...']); // 카드 텍스트 로딩 상태로 변경
    try {
      const pedagogyResponse = await fetch('./json/PedagogyList.json');
      const pedagogyData = await pedagogyResponse.json();
      const randomPedagogy = pedagogyData[Math.floor(Math.random() * pedagogyData.length)];

      const edutechResponse = await fetch('./json/EdutechList.json');
      const edutechData = await edutechResponse.json();
      const randomEdutech = edutechData[Math.floor(Math.random() * edutechData.length)];

      setCardTexts([textInput, randomPedagogy.Pedagogy, randomEdutech.name]);
    } catch (error) {
      console.error('Error fetching JSON:', error);
    }
  };

  const handleInitClick = () => {
    setTextInput('');
    setResult('');
    setCardTexts(['Contents', 'Pedagogy', 'Edutech']);
  };

  const handleGptButtonClick = async () => {
    setLoading(true); // 로딩 시작
    const api_key = process.env.REACT_APP_API_KEY; // config.apikey; // <- API 키 입력
    const content = cardTexts[0];
    const pedagogy = cardTexts[1];
    const edutech = cardTexts[2];

    const messages = [
      { role: 'system', content: 'You are a helpful teacher.' },
      {
        role: 'user',
        content: `${content} 활동을 ${pedagogy} 와 ${edutech} 를 이용해서 40분짜리 수업계획을 만들어줘`,
      },
    ];

    const data = {
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      n: 1,
      messages: messages,
    };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      setLoading(false); // 로딩 종료
      setResult(responseData.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <div className="App">
      
      <h1 className='header'>TPACK CARDS With GPT</h1>
      
      <div>
      <p className="author">만든이: 군산초등학교 유진호</p>
      </div>
      <div className="input-container">
        <input
          className="text-input"
          type="text"
          value={textInput}
          onChange={handleTextInputChange}
          placeholder="수업활동 입력"
        />
        <button className="update-button" onClick={handleUpdateClick}>
          수업설계
        </button>
        <button className="update-button" onClick={handleInitClick}>
          초기화
        </button>
      </div>
      <div className="card-container">
        {cardTexts.map((text, index) => (
          <Card key={index} index={index} text={text} />
        ))}
      </div>
      <div className="input-container">
        <button className="update-button" onClick={handleGptButtonClick}>
          수업계획 예시생성
        </button>
      </div>
      {loading ? ( // 로딩 중일 때 Loading 컴포넌트를 표시하고, 로딩이 끝나면 결과를 표시
        <Loading />
      ) : (
        <pre className="result pre">{result}</pre> // 결과를 pre 태그로 표시
      )}
    </div>
  );
};

export default App;
