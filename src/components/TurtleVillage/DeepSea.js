import './css/DeepSea.css';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
    const [gameOver, setGameOver] = useState(false);
    const [gameOverOpacity, setGameOverOpacity] = useState(0);
    const [life, setLife] = useState(3); // 초기 목숨
    const backgroundRef = useRef(null);

    const turtleSpeed = 20;
    const fishSpeed = 19;
    const [sharkSpeed, setSharkSpeed] = useState(40);

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
            const adjustedDirection = {
                x: direction.x + (Math.random() * 0.2 - 0.1),
                y: direction.y + (Math.random() * 0.2 - 0.1),
            };
            const length = Math.sqrt(adjustedDirection.x ** 2 + adjustedDirection.y ** 2) || 1;
            adjustedDirection.x /= length;
            adjustedDirection.y /= length;

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
    }, [fishDirection, sharkDirection, sharkSpeed, gameOver]);

    useEffect(() => {
        const speedIncreaseInterval = setInterval(() => {
            if (gameOver) return;
            setSharkSpeed((prevSpeed) => prevSpeed + 5);
        }, 10000);

        return () => clearInterval(speedIncreaseInterval);
    }, [gameOver]);

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
        if (gameOver) return; // 게임 오버 상태일 때 충돌 감지 로직 중단

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
            setLife((prevLife) => {
                const newLife = prevLife - 1;
                if (newLife <= 0) {
                    setGameOver(true);
                } else {
                    setGameOver(true); // 게임 오버 화면 표시
                }
                return newLife;
            });
        }
    }, [turtlePosition, fishPosition, sharkPosition, gameOver]);

    useEffect(() => {
        if (gameOver) {
            setGameOverOpacity(1);
        }
    }, [gameOver]);

    const restartGame = () => {
        if (life <= 0) return; // 목숨이 0 이하일 때 게임을 재시작하지 않음

        const backgroundRect = backgroundRef.current.getBoundingClientRect();
        setTurtlePosition(randomPosition(backgroundRect.width - 50, backgroundRect.height - 50));
        setFishPosition(randomPosition(backgroundRect.width - 30, backgroundRect.height - 30));
        setSharkPosition(randomPosition(backgroundRect.width - 30, backgroundRect.height - 30));
        setSharkSpeed(25);
        setScore(0);
        setGameOver(false);
        setGameOverOpacity(0);
    };

    const [HighestScore, setHighestScore] = useState(0);
    useEffect(() => {
        axios
            .get("http://127.0.0.1:5000/api/HighesetScore")
            .then((response) => {
                setHighestScore(response.data);
            })
            .catch((error) => console.error("Error fetching HighesetScore data:", error));
    }, []);

    if (score > HighestScore) {
        axios
            .put("http://127.0.0.1:5000/api/HighestScore", { score: score })
            .then((response) => {
                console.log("Score successfully updated:", response.data);
            })
            .catch((error) => {
                console.error("Error updating HighesetScore data:", error);
            });
    }

    return (
        <div>
            {gameOver && (
                <div className='gameOver' style={{ opacity: gameOverOpacity, transition: 'opacity 1s' }}>
                    <h1 className='OverMent'>게임 오버!</h1>
                    <h3 className='ScoreMent'>점수: {score}</h3>
                    <h3 className='HighestScore'>최고점수: {HighestScore}</h3>
                    {life > 0 ? (
                        <button className='Restart' onClick={restartGame}>다시 시작</button>
                    ) : (
                        <h1 className='NoLivesLeft'>남은 목숨이 없습니다!</h1>
                    )}
                </div>
            )}
            <div className='menu'>
                <p className='pageName'>심해</p>
                <Link to='/Login'><p className='logOut'>로그아웃</p></Link>
                <div className='DeepSea_Background' ref={backgroundRef}>
                    <p className='Score'>점수: {score}</p>
                    <p className='Life'>목숨: {life}</p>
                    <img src='/UnderTheSea.png' className='UnderTheSea_Image' alt='UnderTheSea'></img>

                    {/* 물고기 이미지 */}
                    <img
                        src='/mulkogi.png'
                        alt='Fish'
                        style={{
                            position: 'absolute',
                            left: `${fishPosition.x}px`,
                            top: `${fishPosition.y}px`,
                            width: '5vw',
                            height: '5vh',
                            transition: 'left 0.1s, top 0.1s',
                        }}
                    />

                    {/* 거북이 이미지 */}
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

                    {/* 상어 이미지 */}
                    <img
                        src='/jaws.png'
                        alt='Shark'
                        style={{
                            position: 'absolute',
                            left: `${sharkPosition.x}px`,
                            top: `${sharkPosition.y}px`,
                            width: '7vw',
                            height: '7vh',
                            transition: 'left 0.1s, top 0.1s',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
