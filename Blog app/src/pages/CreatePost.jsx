import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";
import service from "../appwrite/config";
import { ID } from "appwrite";
import Container from "./Container";
import successSound from "../assets/audio.mp3";

function CreatePost() {
  const [post, setPost] = useState({ title: "", content: "" });
  const [file, setFile] = useState(null);
  const [video, setVideo] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const fakeProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 5;
      });
    }, 150);
    return interval;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);
      const progressInterval = fakeProgress();

      const user = await authService.getCurrentUser();
      if (!user) {
        alert("Please login first!");
        setLoading(false);
        clearInterval(progressInterval);
        return;
      }

      if (file && video) {
        alert("Please select only one: image OR video");
        setLoading(false);
        clearInterval(progressInterval);
        return;
      }

      let fileId = null;
      let videoId = null;

      if (file) {
        const uploaded = await service.uploadFile(file);
        fileId = uploaded.$id;
      }

      if (video) {
        if (video.size > 50 * 1024 * 1024) {
          alert("Video too large! Please upload below 50MB.");
          setLoading(false);
          clearInterval(progressInterval);
          return;
        }

        const uploadedVideo = await service.videoFile(video);
        videoId = uploadedVideo?.$id || null;
      }

      await service.createPost({
        title: post.title,
        slug: ID.unique(),
        content: post.content,
        featuredImage: fileId,
        videoFile: videoId,
        status: "active",
        userId: user.$id,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const sound = new Audio(successSound);
      sound.play();

      setSuccess(true);
      setTimeout(() => navigate("/home/page"), 1000);
    } catch (err) {
      console.error("❌ Post creation failed:", err);
      alert("Upload failed. error due to internet connection, please try again.");
      setProgress(0);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000); // Reset progress
    }
  };

  return (
    <Container>
      <form
        onSubmit={handleSubmit}
        className="p-6 max-w-md mx-auto mt-8 bg-white shadow-lg rounded-xl"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          Create New Post
        </h2>

        <input
          type="text"
          placeholder="Title"
          className="block border p-2 mb-2 w-full rounded"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Content"
          className="block border p-2 mb-2 w-full rounded"
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
          required
        />

        <label className="block text-sm text-gray-700">Upload Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className={`block w-full mb-2 ${
            video ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />

        <label className="block text-sm text-gray-700 mt-2">Upload Video:</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          className={`w-full mb-4 hover:outline-yellow-600 ${file ? "opacity-50 cursor-not-allowed" : ""}`}
        />

        {/* 🟦 Animated Create Button */}
        <button
          type="submit"
          disabled={loading}
          className={`relative overflow-hidden text-black  hover:text-white font-semibold px-4 py-2 rounded w-full transition-all duration-300 
           ${
            loading ? "cursor-wait" : "bg-blue-600 hover:bg-blue-700"
          }
          `}
        >
          {/* Progress fill inside button */}
          {loading && (
            <span
              className="absolute top-0 left-0 h-full bg-blue-500  transition-all duration-150"
              style={{ width: `${progress}%` }}
            ></span>
          )}

          {/* Button text (stay visible above the animation) */}
          <span className="relative z-10">
            {loading ? "Uploading..." : "Create Post"}
          </span>
        </button>

        {success && (
          <div className="fixed bottom-[-100px] left-1/2 transform -translate-x-1/2 animate-slide-up bg-green-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg w-full max-w-[300px] text-center">
            🎉 Post Created Successfully!
          </div>
        )}
      </form>
    </Container>
  );
}

export default CreatePost;
