import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
export default function Comments({ imageId }) {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
const navigate=useNavigate();
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const access_token = localStorage.getItem('access_token');
        const response = await fetch(`http://localhost:2800/user/comments/image/${imageId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: access_token,
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        
        // Fetch usernames for each comment user
        const commentsWithUsernames = await Promise.all(data.map(async (comment) => {
          const userResponse = await fetch(`http://localhost:2800/user/profile/${comment.user}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: access_token,
            },
            credentials: 'include',
          });
          if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
          }
          const userData = await userResponse.json();
          return { ...comment, username: userData.username };
        }));
        
        setComments(commentsWithUsernames);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();

  }, [imageId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const access_token = localStorage.getItem('access_token');
    if (newCommentText.trim()) {
      try {
        const response = await fetch(`http://localhost:2800/user/comment/${imageId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: access_token,
          },
          body: JSON.stringify({
            commentText: newCommentText,
          }),
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to add comment');
        }
        const data = await response.json();
        setComments(prevComments => [...prevComments, data]);
        setNewCommentText('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {Array.isArray(comments) && comments.map((comment, index) => (
          <li key={index}>
            <strong onClick={(()=>navigate(`/otherprofile/${comment.user}`))}>{comment.username}: </strong> 
            <h3>{comment.comments}</h3>
           
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          className='text-black font-semibold'
        />
        <button type="submit">Add Comment</button>

      
      </form>
    </div>
  );
}
