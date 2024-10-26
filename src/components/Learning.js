import './css/Learning.css';
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // Add this import
import axios from 'axios';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
 const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Button Component
function Button({ name, src, alt, onClick }) {
    return (
        <img
            src={src}
            className={name}
            alt={alt}
            onClick={onClick}
        />
    );
}

// Reading Component
function Reading({ onComprehensionTrigger }) {
    const [pageNumber, setPageNumber] = useState(1); // 현재 페이지 상태
    const [numPages, setNumPages] = useState(null); // 전체 페이지 수
    

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const goToPrevPage = () => {
        if (pageNumber > 2) {
            setPageNumber(pageNumber - 2); // 두 페이지씩 넘김
        }
    };

    const goToNextPage = () => {
        if (pageNumber + 1 < numPages) {
            setPageNumber(pageNumber + 2); // 두 페이지씩 넘김
        }
        // 4페이지 도달 시 comprehension 트리거
        if (pageNumber >= 9) {
            onComprehensionTrigger();
        }
    };

    return (
        <>
            <Button
                name='Learning_Button_Left'
                src='/Left.png'
                alt="Left navigation button"
                onClick={goToPrevPage} // 왼쪽 버튼 클릭 시 두 페이지 감소
            />
            <div className='Learning_Book_Left'>
                <Document
                    file='/Hamlet.pdf'
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="pdf-document"
                >
                    <Page pageNumber={pageNumber} renderTextLayer={false} className="pdf-page"/>
                </Document>
            </div>
            <div className='Learning_Book_Right'>
                <Document
                    file='/Hamlet.pdf'
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="pdf-document"
                >
                    {/* 왼쪽 페이지 다음 페이지 표시 */}
                    <Page pageNumber={pageNumber + 1} renderTextLayer={false} className="pdf-page"/>
                </Document>
            </div>
            <Button
                name='Learning_Button_Right'
                src='/Right.png'
                alt="Right navigation button"
                onClick={goToNextPage} // 오른쪽 버튼 클릭 시 두 페이지 증가
            />
        </>
    );
}


// Button, Reading 컴포넌트 등은 그대로...

function Comprehension({ onComprehensionComplete }) {
    const [active, setActive] = useState(false);

    // Comprehension이 처음 렌더링될 때 애니메이션 트리거
    useEffect(() => {
        const timer = setTimeout(() => {
            setActive(true);
        }, 100); // 짧은 딜레이 (0.1초)
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`Learning_Container ${active ? 'active' : ''}`}>
            <div className={`LearningWon ${active ? 'active' : ''}`}>
                <ul className='Comprehension_Container'>
                    <li className='Comprehension_problem'>유령은 누구와 닮은 모습을 하고 있나요?</li>
                    <li className='Comprehension_Button_A' onClick={onComprehensionComplete}>선왕</li>
                    <li className='Comprehension_Button_B'>왕자의 시중</li>
                    <li className='Comprehension_Button_C'>호레이쇼</li>
                </ul>
            </div>
        </div>
    );
}

function Ai () {
    const [transcript, setTranscript] = useState('');  // 인식된 텍스트 상태
    const [isListening, setIsListening] = useState(false);  // 음성 인식 활성화 여부
    const [aiResponse, setAiResponse] = useState('');  // AI 응답 상태
    useEffect(() => {
        // 브라우저가 SpeechRecognition을 지원하는지 확인
        if (!SpeechRecognition) {
          alert('이 브라우저는 음성 인식을 지원하지 않습니다. Chrome 브라우저에서 사용해주세요.');
          return;
        } 

        const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';  // 한국어 설정
    recognition.interimResults = false;  // 중간 결과 표시하지 않음

    // 음성 인식 결과를 처리하는 이벤트 핸들러
    recognition.onresult = async (event) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);

      try {
        const response = await axios.post('http://localhost:5001/chat', {
          message: speechToText
        });

        if (response.data.error) {
          setAiResponse(`오류: ${response.data.error}`);
        } else {
          setAiResponse(response.data.response);
        }
      } catch (error) {
        console.error('서버 응답 오류:', error);
        setAiResponse('서버에서 응답을 받지 못했습니다. 네트워크 연결을 확인해주세요.');
      }
    };

    recognition.onerror = (event) => {
      console.error('음성 인식 오류:', event.error);
    };

    // 음성 인식 시작/중지 제어
    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    // 컴포넌트 언마운트 시 음성 인식을 중지
    return () => {
      recognition.stop();
    };
  }, [isListening]);

  // 음성 인식 시작/중지 토글 함수
  const toggleListening = () => {
    setIsListening(prevState => !prevState);
  };

  return (
    <div>
      <p>음성 인식 AI</p>
      <button onClick={toggleListening}>
        {isListening ? '음성 인식 중지' : '음성 인식 시작'}
      </button>
      <p>인식된 텍스트: {transcript}</p>
      <p>AI 응답: {aiResponse}</p>
    </div>
  );
};

function UserResponse() {
    return (
        <div>
            <img src='/Mic.png' alt='AI_Chat_User1' className='AI_Chat_User_Mic'/>
            <img src='/More horizontal.png' alt='AI_Chat_User2' className='AI_Chat_User_Hor'/>
            <img src='/UserProfile.png' alt='AI_Chat_User3' className='AI_Chat_User_Image'/>
        </div>
    )
}

function Treatment() {
    return (
        <div className='Learning_Container active'> {/* 배경 유지 */}
            <div className='LearningWon active'> {/* 원이 그대로 유지 */}
                <Ai />
                <UserResponse />
            </div>
        </div>
    );
}

export default function Learning() {
    const [showComprehension, setShowComprehension] = useState(false);
    const [showTreatment, setShowTreatment] = useState(false);

    const handleComprehensionTrigger = () => {
        setShowComprehension(true);
    };

    const handleComprehensionComplete = () => {
        setShowComprehension(false);
        setShowTreatment(true); // Treatment 페이지로 이동
    };

    return (
        <div>
            <a href="/Home"><button className='Home_Button'>Home</button></a>
            {showTreatment ? (
                <Treatment /> // 원이 그대로 있는 상태에서 Treatment 화면 표시
            ) : showComprehension ? (
                <Comprehension onComprehensionComplete={handleComprehensionComplete} />
            ) : (
                <Reading onComprehensionTrigger={handleComprehensionTrigger} />
            )}
        </div>
    );
}
