import './css/Village.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CustomDropdown({ options, selectedOption, onOptionSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="dropdownContainer">
            <img className='dropdown' src='/dropdown.png' alt='drop' onClick={toggleDropdown}></img>
            <div className="dropdownHeader" onClick={toggleDropdown}>
                {selectedOption}
            </div>
            {isOpen && (
                <ul className="dropdownList">
                    {options.map((option) => (
                        <li
                            key={option}
                            className="dropdownItem"
                            onClick={() => {
                                onOptionSelect(option);
                                setIsOpen(false);
                            }}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function Village() {
    const [currentBoard, setCurrentBoard] = useState('자유게시판');
    const [mode, setMode] = useState('view');
    const [searchTerm, setSearchTerm] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedPost, setSelectedPost] = useState(null);
    const [replies, setReplies] = useState('');
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [posts, setPosts] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [selectedBoard, setSelectedBoard] = useState('자유게시판'); 

    // 게시물 목록 불러오기
    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/api/posts?board=${currentBoard}`)
            .then(response => setPosts(response.data))
            .catch(error => console.error("Error fetching posts:", error));
    }, [currentBoard]);

    const handleBoardChange = (newBoard) => {
        setCurrentBoard(newBoard);
        setMode('view');
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        axios.get(`http://127.0.0.1:5000/api/posts?board=${currentBoard}&search=${searchTerm}`)
            .then(response => setPosts(response.data))
            .catch(error => console.error("Error searching posts:", error));
    };

    const handlePostClick = () => {
        setMode('post');
    };

    // 게시물 작성하기
    const handlePostSubmit = () => {
        if (title && content) {
            axios.post('http://127.0.0.1:5000/api/posts', {
                title,
                content,
                board_type: selectedBoard
            })
            .then(() => {
                setCurrentBoard(selectedBoard);
                setMode('view');
                setTitle('');
                setContent('');
                return axios.get(`http://127.0.0.1:5000/api/posts?board=${selectedBoard}`);
            })
            .then(response => setPosts(response.data))
            .catch(error => alert("Error creating post:", error));
        } else {
            alert('제목과 내용을 모두 입력해주세요.');
        }
    };

    const handleListItemClick = (post) => {
        setSelectedPost(post);
        setLikeCount(post.like_count);
        setMode('detail');
    };

    const handleReplyChange = (event) => {
        setReplies(event.target.value);
    };

    // 댓글 추가하기
    const handleReplySubmit = () => {
        if (replies) {
            axios.post(`http://127.0.0.1:5000/api/posts/${selectedPost.id}/replies`, { content: replies })
                .then(response => {
                    setSelectedPost(prevPost => ({
                        ...prevPost,
                        replies: [...prevPost.replies, response.data]
                    }));
                    setReplies('');
                    setShowReplyInput(false);
                })
                .catch(error => console.error("Error posting reply:", error));
        }
    };

    const toggleReplyInput = () => {
        setShowReplyInput(!showReplyInput);
    };

    // 좋아요 클릭
    const handleHeartClick = () => {
        if (!hasLiked) {
            axios.put(`http://127.0.0.1:5000/api/posts/${selectedPost.id}/like`)
                .then(() => {
                    setHasLiked(true);
                    setLikeCount(prevCount => prevCount + 1);
                })
                .catch(error => console.error("Error liking post:", error));
        }
    };

    return (
        <div className='menu'>
            <p className='pageName'>거북이 마을</p>
            <Link to='/Login'><p className='logOut'>로그아웃</p></Link>

            {/* 게시판 선택 버튼 */}
            <p  className={`FreeBoard ${currentBoard === '자유게시판' ? 'selected' : ''}`}
                onClick={() => handleBoardChange('자유게시판')}>자유게시판</p>

            
            <p className={`InfoBoard ${currentBoard === '정보게시판' ? 'selected' : ''}`}
                onClick={() => handleBoardChange('정보게시판')}>정보게시판</p>

            <p className={`WorryBoard ${currentBoard === '고민게시판' ? 'selected' : ''}`}
                onClick={() => handleBoardChange('고민게시판')}>고민게시판</p>

            {/* 게시판 내용 표시 */}
            <div className='board'>
                {mode === 'view' && (
                    <div>
                        {/* 검색창 */}
                        <div className='searchContainer'>
                            <input
                                type='text'
                                placeholder='#키워드 검색'
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className='searchInput'
                            />
                            <div onClick={handleSearch} className='searchButton'>
                                <img className='SearchImg' src='/Search.png' alt='search' />
                            </div>
                        </div>
                        <div className='contentBorder' />
                        <ul>
                            {posts.map((post, index) => (
                                <div
                                    className='userList'
                                    key={index}
                                    onClick={() => handleListItemClick(post)}
                                >
                                    <img className='mainAvatar' src='/58.png' alt='avatar'></img>
                                    <p className='titleOfContent'>{post.title}</p>
                                </div>
                            ))}
                        </ul>
                        <img className='PostButton' src='/post.png' alt='post' onClick={handlePostClick}></img>
                    </div>
                )}
                {mode === 'post' && (
                    <div>
                        <img className='WritingAvatar' src='/58.png' alt='Avatar'/>
                        <CustomDropdown
                            options={["자유게시판", "정보게시판", "고민게시판"]}
                            selectedOption={selectedBoard}
                            onOptionSelect={(value) => setSelectedBoard(value)}
                        />
                        
                        <div className='dividerS' />
                        <input
                            type="text"
                            placeholder="게시물 제목 작성하기"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="titleInput"
                        />
                        <textarea
                            placeholder="게시글 내용 작성하기"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="contentInput"
                        />
                        <button className="LetsPost" onClick={handlePostSubmit}>게시하기</button>
                    </div>
                )}
                {mode === 'detail' && selectedPost && (
                    <div>
                        <div className="dropdownHeader">
                            {selectedBoard}
                        </div>
                        <div className='dividerS' />
                        <img className='Avatar' src='/58.png' alt='profile'/>
                        <h2 className='viewTitle'>{selectedPost.title}</h2>
                        <div className='viewContent' style={{ whiteSpace: 'pre-wrap' }}>{selectedPost.content}</div>
                        <div onClick={handleHeartClick}>
                            <img 
                                className='Heart' 
                                src={hasLiked ? '/favorite_filled.png' : '/favorite.png'} 
                                alt='heart'
                                style={{ filter: hasLiked ? 'invert(34%) sepia(98%) saturate(7496%) hue-rotate(353deg) brightness(101%) contrast(110%)' : 'none' }}
                            />
                            <p className='HeartNum'>{likeCount}</p>
                        </div>
                        
                        <div onClick={toggleReplyInput}>
                            <img className='UsersendReply' src='/send.png' alt='send'/>
                            <p className='Respond'>댓글달기</p>
                        </div>

                        <div className='divider' />
                        {showReplyInput && (
                            <div className='fixedReply'>
                                <input
                                    className='reply'
                                    placeholder='댓글 달기'
                                    value={replies}
                                    onChange={handleReplyChange}
                                />
                                <img
                                    className='replyPost'
                                    src='/send.png'
                                    alt='send'
                                    onClick={handleReplySubmit}
                                />
                            </div>
                        )}

                        <div className='replyList'>
                            {selectedPost.replies && selectedPost.replies.map((reply, index) => (
                                <li key={index} className='replyItem'>
                                    <img className='ReplyAvatar' src='/58.png' alt='avatar'></img>
                                    <p className='ReplyText'>{reply.content}</p>
                                </li>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
