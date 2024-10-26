import './css/DeepSea.css';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function DeepSea() {
    const [turtlePosition, setTurtlePosition] = useState({ x: 0, y: 0 });
    const [turtleDirection, setTurtleDirection] = useState('right');
    const [fishPosition, setFishPosition] = useState({ x: 200, y: 200 });
    const [showBubble, setShowBubble] = useState(false);
    const backgroundRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const step = 10;
            const backgroundRect = backgroundRef.current.getBoundingClientRect();
            const turtleSize = { width: 50, height: 50 }; // 거북이 이미지의 크기를 적절히 조정하세요

            const newPosition = { ...turtlePosition };

            switch (event.key) {
                case 'ArrowUp':
                    newPosition.y = Math.max(0, turtlePosition.y - step);
                    break;
                case 'ArrowDown':
                    newPosition.y = Math.min(backgroundRect.height - turtleSize.height, turtlePosition.y + step);
                    break;
                case 'ArrowLeft':
                    newPosition.x = Math.max(0, turtlePosition.x - step);
                    setTurtleDirection('left');
                    break;
                case 'ArrowRight':
                    newPosition.x = Math.min(backgroundRect.width - turtleSize.width, turtlePosition.x + step);
                    setTurtleDirection('right');
                    break;
                default:
                    return;
            }

            // 거북이와 물고기의 충돌 감지
            const turtleRect = {
                left: newPosition.x,
                right: newPosition.x + 50,
                top: newPosition.y,
                bottom: newPosition.y + 50
            };
            const fishRect = {
                left: fishPosition.x,
                right: fishPosition.x + 30,
                top: fishPosition.y,
                bottom: fishPosition.y + 30
            };

            if (
                turtleRect.left < fishRect.right &&
                turtleRect.right > fishRect.left &&
                turtleRect.top < fishRect.bottom &&
                turtleRect.bottom > fishRect.top
            ) {
                setShowBubble(true);
                setTimeout(() => setShowBubble(false), 1000);
                // 물고기를 새로운 위치로 이동
                setFishPosition({
                    x: Math.random() * (backgroundRect.width - 30),
                    y: Math.random() * (backgroundRect.height - 30)
                });
            }

            setTurtlePosition(newPosition);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [turtlePosition, fishPosition]);

    return (
        <div>
            <div className='menu'>
                <p className='pageName'>심해</p>
                <Link to='/Login'><p className='logOut'>로그아웃</p></Link>
                <div className='DeepSea_Background' ref={backgroundRef}>
                    <img src='/UnderTheSea.png' className='UnderTheSea_Image' alt='UnderTheSea'></img>
                    <div 
                        style={{
                            position: 'absolute',
                            left: `${fishPosition.x}px`,
                            top: `${fishPosition.y}px`,
                            width: '30px',
                            height: '30px',
                            backgroundColor: 'Yellow',
                        }}
                    />
                    <img 
                        src='/Turtle_Right.png' 
                        alt='Turtle'
                        style={{
                            position: 'absolute',
                            left: `${turtlePosition.x}px`,
                            top: `${turtlePosition.y}px`,
                            transform: `scaleX(${turtleDirection === 'left' ? -1 : 1})`,
                            transition: 'left 0.1s, top 0.1s',
                            width: '10%',
                            height: '10%',
                        }}
                    />
                    {showBubble && (
                        <div style={{
                            position: 'absolute',
                            left: `${turtlePosition.x + 60}px`,
                            top: `${turtlePosition.y - 30}px`,
                            backgroundColor: 'white',
                            borderRadius: '15px',
                            padding: '5px 10px',
                            boxShadow: '0 0 5px rgba(0,0,0,0.3)',
                        }}>
                            맛있어!
                        </div>
                    )}
                </div>
            </div>
            {/* 여기에 DeepSea 컴포넌트의 주요 내용을 추가하세요 */}
        </div>
    )
}