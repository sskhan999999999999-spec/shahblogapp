import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import service from "../appwrite/config";
import authService from "../appwrite/auth";
import Container from "./Container";
import { ArrowLeftCircle,  } from "lucide-react";
import conf from "../conf/conf";

function Comments({postId,onClose}) {
  
  
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
 
  

 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const current = await authService.getCurrentUser();
        setUser(current);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };
    fetchUser();
  }, []);

  const loadComments = async () => {
    if (!postId) return;
    
    
    try {
      const res = await service.getComments(postId);
      setComments(res?.documents || []);
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!postId) return alert("❌ postId missing!");
    if (!text.trim()) return alert("❌ Comment cannot be empty!");
    if (!user) return alert("❌ Please login!");

    

    try {
      await service.createComment({
        postId :postId,
        userId: user?.$id,
        username: user?.name || "Anonymous",
        text,
      });
      setText("");
      loadComments();
    } catch (err) {
      console.error("Create comment error:", err);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);
    const handleDelete = async (commentId) => {
 
  const ok = await service.deleteComment(commentId);
  if (ok) {
    setComments((prev) => prev.filter((c) => c.$id !== commentId));
  }
};

  return (
    <Container>
  <div className="flex flex-col min-h-screen bg-gray-50 relative">
    {/* Header */}
    <div className="flex justify-between px-4 bg-gray-200 shadow w-full max-w-sm top-0 items-center z-10 fixed p-4">
      <h2 className="text-2xl font-semibold">Comments</h2>
      <button onClick={onClose} className="text-xl">
        <ArrowLeftCircle />
      </button>
    </div>

    {/* Scrollable comments area */}
    <div className=" lg:mt-10 overflow-y-auto px-4 flex-1">
      {comments.length > 0 ? (
        comments.map((c) => (
          <div>
          <div key={c.$id} className="mb-2 bg-white shadow-sm rounded-lg p-3">
            <p className="font-medium text-gray-800">{c.username}</p>
            <p className="text-gray-600 text-sm">{c.text}</p>
            </div>
            {user?.$id === c.userId && (
              <div className="text-right mb-1 ">
                <button
                  onClick={() => handleDelete(c.$id)}
                  className="hover:text-red-600 text-3 mt-1"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm text-center mt-10">No comments yet.</p>
      )}
    </div>

    {/* Footer input */}
    <form
      onSubmit={addComment}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm border-t bg-white p-3 flex items-center gap-2 shadow-md"
    >
      <input
        type="text"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-full transition"
      >
        Post
      </button>
    </form>
  </div>
</Container>

  );
}

export default Comments;
