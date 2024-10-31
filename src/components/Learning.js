import './css/Learning.css';
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

async function callOpenAI(messages, setAiResponse) {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const url = 'https://api.openai.com/v1/chat/completions';

    const data = {
        model: "gpt-4",
        messages: messages, // 전체 대화 기록을 포함
        max_tokens: 3000,
        stream: false // 스트리밍 비활성화
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const jsonResponse = await response.json();
        const newMessage = jsonResponse.choices[0].message.content;
        setAiResponse(newMessage); // 새로운 AI 응답 설정
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        setAiResponse('API 호출 중 오류가 발생했습니다.');
    }
}

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
// 버튼 컴포넌트 정의
function Button({ name, src, alt, onClick }) {
    return <img src={src} className={name} alt={alt} onClick={onClick} />; // 이미지 버튼 생성
}

// PDF 문서 보기 및 탐색을 위한 컴포넌트
function Reading({ onAITrigger }) {
    const [pageNumber, setPageNumber] = useState(1); // 현재 페이지 번호 상태
    const [numPages, setNumPages] = useState(null); // 총 페이지 수 상태

    // PDF 문서 로드 성공 시 총 페이지 수를 설정하는 함수
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    // 이전 페이지로 이동하는 함수
    const goToPrevPage = () => {
        if (pageNumber > 2) setPageNumber(pageNumber - 2);
    };

    // 다음 페이지로 이동하는 함수
    const goToNextPage = () => {
        if (pageNumber + 1 < numPages) {
            setPageNumber(pageNumber + 2);
        }
        if (pageNumber >= 9) {
            onAITrigger(); // 9페이지 이상일 경우 AI 트리거
        }
    };

    return (
        <>
            <Button
                name='Learning_Button_Left'
                src='/Left.png'
                alt="Left navigation button"
                onClick={goToPrevPage} // 왼쪽 화살표 버튼으로 이전 페이지로 이동
            />
            <div className='Learning_Book_Left'>
                <Document file='/Hamlet.pdf' onLoadSuccess={onDocumentLoadSuccess} className="pdf-document">
                    <Page pageNumber={pageNumber} renderTextLayer={false} className="pdf-page"/> {/* 왼쪽 페이지 표시 */}
                </Document>
            </div>
            <div className='Learning_Book_Right'>
                <Document file='/Hamlet.pdf' onLoadSuccess={onDocumentLoadSuccess} className="pdf-document">
                    <Page pageNumber={pageNumber + 1} renderTextLayer={false} className="pdf-page"/> {/* 오른쪽 페이지 표시 */}
                </Document>
            </div>
            <Button
                name='Learning_Button_Right'
                src='/Right.png'
                alt="Right navigation button"
                onClick={goToNextPage} // 오른쪽 화살표 버튼으로 다음 페이지로 이동
            />
        </>
    );
}

function Ai() {
    const [messages, setMessages] = useState([
        { "role": "system", "content": "You are a turtle character, 10 years old, specializing in psychological and bibliotherapy. \
            You attend elementary school. You have a lively and cheerful personality, and you’re skilled at keeping conversations going.\
             You empathize well with others' words and speak kindly, with a cute tone typical of teenagers. Use informal language instead of honorifics, \
             and add emojis seldomly. Answer in Korean. 반말 쓰라고." },
        { "role": "assistant", "content": "오늘 주인공이 겪은 거랑 비슷한 일 너도 겪어본 적 있어? " } // 초기 질문
    ]);
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [aiResponse, setAiResponse] = useState("오늘 주인공이 겪은 거랑 비슷한 일 너도 겪어본 적 있어?" );
    const [showContinue, setShowContinue] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [showHomeButton, setShowHomeButton] = useState(false);
    const [stopCount, setStopCount] = useState(0); // 추가: Stop 버튼 클릭 횟수 상태

    const startListening = () => {
        setIsListening(true);
        setShowContinue(false);
        setIsDone(false);
    };

    const handleStop = async () => {
        setIsListening(false);
        setShowContinue(true);
        setStopCount(stopCount + 1); // Stop 버튼 클릭 횟수 증가

        // 유저의 답변 추가
        const userMessage = { "role": "user", "content": transcript };
        const updatedMessages = [...messages, userMessage]; // 기존 메시지 + 유저 응답

        // AI로부터 새 질문을 받음
        await callOpenAI(updatedMessages, (response) => {
            setAiResponse(response);
            setMessages([...updatedMessages, { "role": "assistant", "content": response }]); // 전체 대화 기록 업데이트
        });

        // 유저의 답변에 따라 AI 질문을 업데이트
        if (transcript) {
            const followUpQuestion = `당신의 답변에 대해 더 이야기해볼까요?`; // 사용자 답변에 기반한 후속 질문
            setAiResponse(followUpQuestion);
            setMessages([...updatedMessages, { "role": "assistant", "content": followUpQuestion }]); // 후속 질문 추가
        }

        setTranscript(''); // 유저 답변 초기화
    };

    const handleDone = () => {
        setAiResponse('');
        setTranscript('');
        setIsListening(false);
        setShowContinue(false);
        setIsDone(true);
        setShowHomeButton(true);
    };

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const speechToText = event.results[0][0].transcript;
            setTranscript(speechToText);
        };

        recognition.onerror = (event) => {
            console.error('음성 인식 오류:', event.error);
        };

        if (isListening) recognition.start();
        else recognition.stop();

        return () => recognition.stop();
    }, [isListening]);

    // 변경 후
if (showHomeButton) {
    return (
        <div className='Learning_Container active'>
            <div className='LearningWon active'>
                <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h1 className='MessageForUser'>This is the End of our Test!</h1>
                    <a href="/Home">
                        <button className='Home_Button'>Home</button>
                    </a>
                </div>
            </div>
        </div>
        
    );
}

return (
    <div className={`Learning_Container active ${isDone ? 'completed' : ''}`}>
        <div className='LearningWon active'>
            <img src='/Teacher.png' alt='AI_Chat_Bot' className='AI_ChatBot_Image'/>
            <img src='/UserProfile.png' alt='AI_Chat_User3' className='AI_Chat_User_Image'/>
            {!isListening && !showContinue && (
                <img src='/AnswerStart.png' alt='Start' className='AnswerStart' onClick={startListening}/>
            )}
            {isListening && (
                <img src='/Stop.png' alt='Stop' className='AnswerStart' onClick={handleStop}/>
            )}
            {showContinue && (
                <img src='/ContinueStart.png' alt='continue' className='Continue' onClick={() => { setShowContinue(false); startListening(); }}/>
            )}
            {stopCount >= 2 && ( // Stop 버튼을 2번 이상 누르면 Done 버튼 표시
                <img src='/Done.png' onClick={handleDone} className='Done'/>
            )}
            <div className='AI_Question'>
                <h3>{aiResponse}</h3>
            </div>
            <div className='User'>
                <p>{transcript}</p>
            </div>
        </div>
    </div>
);
}

export default function Learning() {
    const [showAI, setShowAI] = useState(false);

    const handleAITrigger = () => {
        setShowAI(true);
    };

    return (
        <div>
            {showAI ? (
                <Ai />
            ) : (
                <Reading onAITrigger={handleAITrigger} />
            )}
        </div>
    );
}
