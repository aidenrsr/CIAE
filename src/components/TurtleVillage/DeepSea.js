import './css/DeepSea.css';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function DeepSea() {
    const randomPosition = (maxX, maxY) => ({
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY),
    });

    const randomDirection = () => ({
        x: Math.random() > 0.5 ? 1 : -1,
        y: Math.random() > 0.5 ? 1 : -1,
    });

    const [turtlePosition, setTurtlePosition] = useState(randomPosition(300, 300));
    const [turtleDirection, setTurtleDirection] = useState('right');
    const [fishPosition, setFishPosition] = useState(randomPosition(300, 300));
    const [fishDirection, setFishDirection] = useState(randomDirection());
    const [showBubble, setShowBubble] = useState(false);
    const [sharkPosition, setSharkPosition] = useState(randomPosition(300, 300));
    const [sharkDirection, setSharkDirection] = useState(randomDirection());
    const [score, setScore] = useState(0);
    const [life, setLife] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [gameOverOpacity, setGameOverOpacity] = useState(0);
    const backgroundRef = useRef(null);
    
    // 속도 설정
    const turtleSpeed = 20;
    const fishSpeed = 19;
    const sharkSpeed = 19;

    // 방향 벡터의 크기를 일정하게 유지하는 함수
    const normalizeDirection = (direction) => {
        const length = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        return {
            x: (direction.x / length) || 1,
            y: (direction.y / length) || 1,
        };
    };

    const adjustDirectionSlightly = (direction) => normalizeDirection({
        x: direction.x + (Math.random() * 0.2 - 0.1),
        y: direction.y + (Math.random() * 0.2 - 0.1),
    });

    useEffect(() => {
        const turtleMoveInterval = setInterval(() => {
            if (gameOver) return;

            setTurtlePosition((pos) => {
                const backgroundRect = backgroundRef.current.getBoundingClientRect();
                let newPosition = { ...pos };

                switch (turtleDirection) {
                    case 'up':
                        newPosition.y = Math.max(0, pos.y - turtleSpeed);
                        break;
                    case 'down':
                        newPosition.y = Math.min(backgroundRect.height - 50, pos.y + turtleSpeed);
                        break;
                    case 'left':
                        newPosition.x = Math.max(0, pos.x - turtleSpeed);
                        break;
                    case 'right':
                        newPosition.x = Math.min(backgroundRect.width - 50, pos.x + turtleSpeed);
                        break;
                    default:
                        break;
                }
                return newPosition;
            });
        }, 50);

        return () => clearInterval(turtleMoveInterval);
    }, [gameOver, turtleDirection]);

    useEffect(() => {
        const moveEntity = (position, direction, speed, maxWidth, maxHeight) => {
            const adjustedDirection = adjustDirectionSlightly(direction);
            let newX = position.x + adjustedDirection.x * speed;
            let newY = position.y + adjustedDirection.y * speed;

            if (newX <= 0 || newX >= maxWidth) adjustedDirection.x *= -1;
            if (newY <= 0 || newY >= maxHeight) adjustedDirection.y *= -1;

            return {
                position: {
                    x: Math.min(maxWidth, Math.max(0, newX)),
                    y: Math.min(maxHeight, Math.max(0, newY)),
                },
                direction: adjustedDirection,
            };
        };

        const backgroundRect = backgroundRef.current.getBoundingClientRect();

        const fishMoveInterval = setInterval(() => {
            setFishPosition((pos) => {
                const result = moveEntity(pos, fishDirection, fishSpeed, backgroundRect.width - 30, backgroundRect.height - 30);
                setFishDirection(result.direction);
                return result.position;
            });
        }, 50);

        const sharkMoveInterval = setInterval(() => {
            setSharkPosition((pos) => {
                const result = moveEntity(pos, sharkDirection, sharkSpeed, backgroundRect.width - 30, backgroundRect.height - 30);
                setSharkDirection(result.direction);
                return result.position;
            });
        }, 50);

        return () => {
            clearInterval(fishMoveInterval);
            clearInterval(sharkMoveInterval);
        };
    }, [fishDirection, sharkDirection, gameOver]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (gameOver) return;

            switch (event.key) {
                case 'ArrowUp':
                    setTurtleDirection('up');
                    break;
                case 'ArrowDown':
                    setTurtleDirection('down');
                    break;
                case 'ArrowLeft':
                    setTurtleDirection('left');
                    break;
                case 'ArrowRight':
                    setTurtleDirection('right');
                    break;
                default:
                    return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [gameOver]);

    useEffect(() => {
        const backgroundRect = backgroundRef.current.getBoundingClientRect();

        const turtleRect = {
            left: turtlePosition.x,
            right: turtlePosition.x + 50,
            top: turtlePosition.y,
            bottom: turtlePosition.y + 50,
        };
        const fishRect = {
            left: fishPosition.x,
            right: fishPosition.x + 30,
            top: fishPosition.y,
            bottom: fishPosition.y + 30,
        };
        const sharkRect = {
            left: sharkPosition.x,
            right: sharkPosition.x + 30,
            top: sharkPosition.y,
            bottom: sharkPosition.y + 30,
        };

        if (
            turtleRect.left < fishRect.right &&
            turtleRect.right > fishRect.left &&
            turtleRect.top < fishRect.bottom &&
            turtleRect.bottom > fishRect.top
        ) {
            setShowBubble(true);
            setTimeout(() => setShowBubble(false), 1000);
            setFishPosition({
                x: Math.random() * (backgroundRect.width - 30),
                y: Math.random() * (backgroundRect.height - 30),
            });
            setScore(score + 1);
        }

        if (
            turtleRect.left < sharkRect.right &&
            turtleRect.right > sharkRect.left &&
            turtleRect.top < sharkRect.bottom &&
            turtleRect.bottom > sharkRect.top
        ) {
            setGameOver(true);
        }
    }, [turtlePosition, fishPosition, sharkPosition, gameOver]);

    useEffect(() => {
        if (gameOver) {
            setGameOverOpacity(1);
        }
    }, [gameOver]);

    const restartGame = () => {
        const backgroundRect = backgroundRef.current.getBoundingClientRect();
        setTurtlePosition(randomPosition(backgroundRect.width - 50, backgroundRect.height - 50));
        setFishPosition(randomPosition(backgroundRect.width - 30, backgroundRect.height - 30));
        setSharkPosition(randomPosition(backgroundRect.width - 30, backgroundRect.height - 30));
        setScore(0);
        setGameOver(false);
        setGameOverOpacity(0);
    };

    return (
        <div>
            {gameOver && (
                <div className='gameOver' style={{ opacity: gameOverOpacity, transition: 'opacity 1s' }}>
                    <h1 className='OverMent'>게임 오버!</h1>
                    <h3 className='ScoreMent'>점수: {score}</h3>
                    <button className='Restart' onClick={restartGame}>다시 시작</button>
                </div>
            )}
            <div className='menu'>
                <p className='pageName'>심해</p>
                <Link to='/Login'><p className='logOut'>로그아웃</p></Link>
                <div className='DeepSea_Background' ref={backgroundRef}>
                    <p className='Score'>점수: {score}</p>
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
                            transform: `rotate(${turtleDirection === 'left' ? '180deg' : turtleDirection === 'up' ? '-90deg' : turtleDirection === 'down' ? '90deg' : '0deg'})`,
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
                            '맛있어!'
                        </div>
                    )}
                    <div
                        style={{
                            position: 'absolute',
                            left: `${sharkPosition.x}px`,
                            top: `${sharkPosition.y}px`,
                            width: '30px',
                            height: '30px',
                            backgroundColor: 'red',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
