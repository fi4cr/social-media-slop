import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, ThumbsUp, Send } from 'lucide-react';

const initialPosts = [
  {
    id: 1,
    author: "Jane Smith",
    avatar: "JS",
    timestamp: "2 hrs ago",
    content: "Just finished my first marathon! 🏃‍♀️ Feeling accomplished and exhausted at the same time. Thank you to everyone who supported me along the way! #running #achievement",
    likes: 142,
    comments: [
      { id: 1, author: "Mike Johnson", avatar: "MJ", content: "Amazing achievement! 👏", timestamp: "1 hr ago" },
      { id: 2, author: "Sarah Wilson", avatar: "SW", content: "You're inspiring! 🌟", timestamp: "30 min ago" }
    ],
    shares: 5
  },
  {
    id: 2,
    author: "John Doe",
    avatar: "JD",
    timestamp: "4 hrs ago",
    content: "Made some homemade pizza tonight! 🍕 Nothing beats the satisfaction of making it from scratch.",
    likes: 89,
    comments: [
      { id: 1, author: "Emma Davis", avatar: "ED", content: "Recipe please! 😋", timestamp: "2 hrs ago" }
    ],
    shares: 2
  },
  {
    id: 3,
    author: "Tech News Daily",
    avatar: "TD",
    timestamp: "6 hrs ago",
    content: "Breaking: New breakthrough in quantum computing promises to revolutionize data processing. Scientists say this could lead to significant advances in artificial intelligence and cryptography.",
    likes: 1247,
    comments: [
      { id: 1, author: "Tech Enthusiast", avatar: "TE", content: "This is groundbreaking!", timestamp: "5 hrs ago" }
    ],
    shares: 89
  },
  {
    id: 4,
    author: "Travel Adventures",
    avatar: "TA",
    timestamp: "8 hrs ago",
    content: "🌅 Sunset in Santorini - sometimes a picture is worth a thousand words. Who's been here? Share your experiences below! #Greece #Travel #Wanderlust",
    likes: 2389,
    comments: [
      { id: 1, author: "Wanderlust", avatar: "WL", content: "On my bucket list! 😍", timestamp: "7 hrs ago" }
    ],
    shares: 156
  },
  {
    id: 5,
    author: "Foodie Chronicles",
    avatar: "FC",
    timestamp: "12 hrs ago",
    content: "Just discovered this hidden gem of a ramen shop! The broth has been simmering for 48 hours and you can taste the depth of flavor in every spoonful. 🍜 #FoodieLife #Ramen",
    likes: 543,
    comments: [
      { id: 1, author: "Ramen Lover", avatar: "RL", content: "Location please! 🙏", timestamp: "11 hrs ago" }
    ],
    shares: 23
  }
];

export default function FacebookFeed() {
  const [posts, setPosts] = useState(initialPosts);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [newComments, setNewComments] = useState({});
  const [showComments, setShowComments] = useState({});

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleCommentChange = (postId, value) => {
    setNewComments(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  const handleSubmitComment = (postId) => {
    if (!newComments[postId]?.trim()) return;

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: post.comments.length + 1,
              author: "You",
              avatar: "ME",
              content: newComments[postId],
              timestamp: "Just now"
            }
          ]
        };
      }
      return post;
    }));

    setNewComments(prev => ({
      ...prev,
      [postId]: ""
    }));
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-100 min-h-screen p-4">
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow p-4">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {post.avatar}
                </div>
                <div>
                  <h3 className="font-semibold">{post.author}</h3>
                  <p className="text-gray-500 text-sm">{post.timestamp}</p>
                </div>
              </div>
              <button className="text-gray-500 hover:bg-gray-100 rounded-full p-2">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Post Content */}
            <p className="mb-4">{post.content}</p>

            {/* Post Stats */}
            <div className="flex items-center justify-between text-gray-500 text-sm mb-4 border-b border-t py-2">
              <div className="flex items-center space-x-2">
                <ThumbsUp size={16} className="text-blue-500" />
                <span>{likedPosts.has(post.id) ? post.likes + 1 : post.likes}</span>
              </div>
              <div className="flex space-x-4">
                <span>{post.comments.length} comments</span>
                <span>{post.shares} shares</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mb-4">
              <button 
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 flex-1 justify-center ${
                  likedPosts.has(post.id) ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                <Heart size={20} fill={likedPosts.has(post.id) ? "currentColor" : "none"} />
                <span>Like</span>
              </button>
              <button 
                onClick={() => toggleComments(post.id)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 flex-1 justify-center text-gray-500"
              >
                <MessageCircle size={20} />
                <span>Comment</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 flex-1 justify-center text-gray-500">
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>

            {/* Comments Section */}
            {showComments[post.id] && (
              <div className="space-y-4">
                {post.comments.map(comment => (
                  <div key={comment.id} className="flex space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                      {comment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-2">
                        <p className="font-semibold text-sm">{comment.author}</p>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{comment.timestamp}</p>
                    </div>
                  </div>
                ))}
                
                {/* New Comment Input */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                    ME
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newComments[post.id] || ""}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSubmitComment(post.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleSubmitComment(post.id)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}