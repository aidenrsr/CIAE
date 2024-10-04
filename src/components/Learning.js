import './css/Learning.css';
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
// Button Component
function Button({ name, src, alt }) {
    if (name === 'Learning_Button_Left') {
        return (
            <img src={src} className={name} alt={alt} onClick={
                console.log('Left button clicked')
            }/>
        );
    } else if (name === 'Learning_Button_Right') {
        return (
            <img src={src} className={name} alt={alt} onClick={
                console.log('Right button clicked')
            }/>
        );
    }
}

// Reading Component
function Reading(props) {
    const [pageNumber, setPageNumber] = useState(1); // 페이지 상태 추가
    const [numPages, setNumPages] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const goToPrevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const goToNextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    return (
        <>
            <Button 
                name='Learning_Button_Left' 
                src='/Left.png' 
                alt="Left navigation button" 
                onClick={goToPrevPage} // 왼쪽 버튼 클릭 시 페이지 감소
            />
            <div className='Learning_Book_Left'>
                <Document
                    file='/Hamlet.pdf'
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} />
                </Document>
            </div>
            <div className='Learning_Book_Right'></div>
            <Button 
                name='Learning_Button_Right' 
                src='/Right.png' 
                alt="Right navigation button" 
                onClick={goToNextPage} // 오른쪽 버튼 클릭 시 페이지 증가
            />
        </>
    );
}

/* From here, it is the main part of our project */
// Comprehension Component
function Comprehension({ onComprehensionComplete }) {
    return (
        <div className='Learning_Container'>
            <div className='LearningWon'>
                <ul>
                    <li className='Comprehension_problem'>!</li>
                    <li className='Comprehension_Button_A' onClick={onComprehensionComplete} />
                    <li className='Comprehension_Button_B' />
                    <li className='Comprehension_Button_C' />
                </ul>
            </div>
        </div>
    );
}
// Treatment Component
function Treatment(props) {
    if (props.name === 'Treatment') {
        return (
            <div className='Learning_Container'>
                <div className='LearningWon'>
                    
                </div>
            </div>
        );
    }
}

// Main Component
export default function Learning() {
    const [showComprehension, setShowComprehension] = useState(true);

    const handleComprehensionComplete = () => {
        setShowComprehension(false);
    };

    return (
        <div>
            <a href="src/components/Home.js"><button className='Home_Button'>Home</button></a>
            {showComprehension ? (
                <>
                    <Comprehension onComprehensionComplete={handleComprehensionComplete} /> 
                    <Reading />
                </>
            ) : (
                <Reading />
            )}
        </div>
    );
}

