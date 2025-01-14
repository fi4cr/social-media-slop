import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, ThumbsUp, Send } from 'lucide-react';

// Get base URL from Vite
const baseUrl = import.meta.env.BASE_URL;

const initialPosts = [
  
  {
    "id": 8,
    "author": "Jacob Davis",
    "avatar": "JD",
    "timestamp": "1 day ago",
    "content": "Finally got around to cleaning the garage 🧹🚗 #SpringCleaning #OrganizationGoals",
    "image": "photo-of-man-cleaning-garage.jpg",
    "imageDescription": "Photo of a man cleaning and organizing his garage",
    "likes": 132,
    "comments": [
      {
        "id": 1,
        "author": "Emily Thompson",
        "avatar": "ET",
        "content": "Looks great! I need to do the same with my garage soon.",
        "timestamp": "22 hrs ago"
      },
      {
        "id": 2,
        "author": "Michael Johnson",
        "avatar": "MJ",
        "content": "Satisfying before and after photos! Well done!",
        "timestamp": "20 hrs ago"
      }
    ],
    "shares": 8
  },
  {
    "id": 1,
    "author": "Emily Davis",
    "avatar": "ED",
    "timestamp": "3 hrs ago",
    "content": "Laundry day chaos! 🧺😩 Trying to tackle the mountain of clothes while the kids are making an even bigger mess. #MomLife #CleaningFrenzy 🧹",
    "image": "photo-of-messy-laundry-room.jpg",
    "imageDescription": "Photo of a cluttered laundry room with piles of clothes and toys scattered around.",
    "likes": 87,
    "comments": [
      {
        "id": 1,
        "author": "Sarah Johnson",
        "avatar": "SJ",
        "content": "I feel your pain! The struggle is real.",
        "timestamp": "2 hrs ago"
      }
    ],
    "shares": 5
  },
  {
    "id": 3,
    "author": "David Lee",
    "avatar": "DL",
    "timestamp": "9 hrs ago",
    "content": "Trying to cook dinner in this mess is a real challenge! 🍽️🌋 But hey, at least the kitchen smells amazing. 😋 #CookingAdventures #MessyKitchen 🍴",
    "image": "photo-of-messy-kitchen.jpg",
    "imageDescription": "Photo of a kitchen with dirty dishes piled in the sink, food scraps on the counter, and pots and pans scattered around.",
    "likes": 68,
    "comments": [
      {
        "id": 1,
        "author": "Samantha Brown",
        "avatar": "SB",
        "content": "I can relate! Cooking is always a battle with the mess.",
        "timestamp": "8 hrs ago"
      }
    ],
    "shares": 3
  },
  {
    "id": 4,
    "author": "Sophia Rodriguez",
    "avatar": "SR",
    "timestamp": "12 hrs ago",
    "content": "Spring cleaning in full swing! 🌸🧹 Trying to declutter and organize, but it's a never-ending battle. 😅 At least the house smells fresh! 🌼 #SpringCleaning #OrganizationGoals 📦",
    "image": "photo-of-messy-bedroom.jpg",
    "imageDescription": "Photo of a bedroom with clothes, books, and other items strewn across the floor and bed, as the owner attempts to sort and organize.",
    "likes": 94,
    "comments": [
      {
        "id": 1,
        "author": "Emily Davis",
        "avatar": "ED",
        "content": "I feel you! Spring cleaning is always a huge task, but so satisfying when it's done.",
        "timestamp": "11 hrs ago"
      }
    ],
    "shares": 6
  },
  {
    "id": 6,
    "author": "Michael Thompson",
    "avatar": "MT",
    "timestamp": "6 hrs ago",
    "content": "Laundry day 🧺🧽 Time to tackle the never-ending pile of clothes! 😅 #AdultingIsHard #LaundryLife",
    "image": "photo-of-man-doing-laundry.jpg",
    "imageDescription": "Photo of a man sorting laundry at home",
    "likes": 78,
    "comments": [
      {
        "id": 1,
        "author": "Jessica Davis",
        "avatar": "JD",
        "content": "I feel your pain! Laundry is the worst chore ever.",
        "timestamp": "5 hrs ago"
      },
      {
        "id": 2,
        "author": "David Wilson",
        "avatar": "DW",
        "content": "At least you're getting it done! Procrastination is my middle name when it comes to laundry.",
        "timestamp": "4 hrs ago"
      }
    ],
    "shares": 3
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
            {post.image && (
              <div className="mb-4">
                <img 
                  src={post.image} 
                  alt={post.imageDescription} 
                  className="w-full h-auto rounded-lg object-cover"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}

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
