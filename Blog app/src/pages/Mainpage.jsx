import React, { useEffect, useState, useRef } from "react";
import service from "../appwrite/config";
import conf from "../conf/conf";
import {
  Heart,
  MessageCircle,
  Image,
  MoreHorizontal,
  Share2,
  Trash2Icon,
 
} from "lucide-react";
import authService from "../appwrite/auth";
import { Query } from "appwrite";
import Container from "./Container.jsx";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {  useNavigate } from "react-router-dom";
import Modal from "./Modal";
import Comments from "./Comments";
import deltesound from "../assets/DeleteSound.mp3"


function Page() {
  const [posts, setPosts] = useState([]);
  const [mediaUrls, setMediaUrls] = useState({});
  const [likes, setLikes] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading,setloading] = useState(false)
  const videoRefs = useRef({}); 
  const [openComments, setOpenComments] = useState(false);
const [selectedPostId, setSelectedPostId] = useState(null);



  useEffect(() => {
    const fetchUser = async () => {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    setloading(true)

    const loadData = async () => {
      try {
        const res = await service.getPosts();
        setPosts(res.documents);

        const likedRes = await service.databases.listDocuments(
          conf.appwriteDataBaseId,
          conf.appwriteLikesCollectionId,
          [Query.equal("userId", user.$id)]
        );
        setLikedPosts(likedRes.documents.map((doc) => doc.postId));

        const urls = {};
        const likeCounts = {};

        res.documents.forEach((post) => {
          if (post.featuredImage) {
            urls[post.$id] = {
              type: "image",
              url: service.getFileUrl(post.featuredImage),
            };
          } else if (post.videoFile) {
            urls[post.$id] = {
              type: "video",
              url: service.getFileUrl(post.videoFile),
            };
          }
          likeCounts[post.$id] = post.likes || 0;
        });

        setMediaUrls(urls);
        setLikes(likeCounts);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally  {
        setloading(false)

      }
    };

    loadData();
  }, [user]);

  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play(); 
          } else {
            video.pause(); 
          }
        });
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] } 
    );

    Object.values(videoRefs.current).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [mediaUrls]);

  const handleLike = async (postId) => {
    try {
      const result = await service.likePost(postId, user.$id);
      setLikes((prev) => ({ ...prev, [postId]: result.count }));

      if (result.liked) {
        setLikedPosts((prev) => [...prev, postId]);
      } else {
        setLikedPosts((prev) => prev.filter((id) => id !== postId));
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await service.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.$id !== postId));
      const Delte = new Audio(deltesound)
      Delte.play()
    } catch (error) {
      console.error("Delete error", error);
    }
  };
  

  
  return (
    <Container>
      <div className="max-w-3xl ">
        <h2 className="text-3xl font-semibold text-blue-400 mb-4 text-center border-b-2 border-gray-300 pb-3">
          All Posts
        </h2>
         {posts.length === 0 && (
          <p className="text-xl text-center">No post yet</p>
        )}
        {loading === true && (
          <p className="text-center text-xl">Loading...</p>
        )}
       
        
        {posts.map((post) => (
          <div
            key={post.$id}
            className="border-b-2 border-gray-400 py-2 mb-6 space-y-2  "
          >
            <div className="flex justify-between pr-2">
              <h3 className="text-lg font-semibold pl-2">{post.title}</h3>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="p-2 rounded-full hover:bg-gray-200 bg-white">
                    <MoreHorizontal />
                  </MenuButton>
                </div>
                <MenuItems className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg focus:outline-none z-50">
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => handleDelete(post.$id)}
                        className={`flex w-full items-center gap-2 px-3 py-2 ${
                          active ? "text-red-500" : ""
                        }`}
                      >
                        <Trash2Icon size={16} /> Delete
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        className={`flex w-full items-center gap-2 px-3 py-2 ${
                          active ? "text-blue-500" : ""
                        }`}
                      >
                        <Share2 size={16} /> Share
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>

            <p className="pl-2">{post.content}</p>

            {/* ✅ Image / Video Display */}
            {mediaUrls[post.$id] ? (
              mediaUrls[post.$id].type === "video" ? (
                // <button onClick={()=>{handleVideoComponent(post.$id)}}>
                 <div className="">
                  <video
                  ref={(el) => (videoRefs.current[post.$id] = el)}
                  src={mediaUrls[post.$id].url}
                  controls
                  muted
                  className="w-full lg:h-[500px]  sm:h-fit object-cover rounded-lg md:h-[600px]"
                />
                {/* // </button> */}
                </div>
              ) : (
                <div className="py-10 bg-black">
                <img
                  src={mediaUrls[post.$id].url}
                  alt="Post"
                
                  className="w-full lg:h-[500px] sm:h-fit object-cover rounded-lg h-fit"
                />
                </div>
              )
            ) : (
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-md">
                <Image className="text-gray-400" size={24} />
              </div>
            )}

            <div className="flex justify-between items-center pt-2 px-3">
              <div className="flex items-center gap-2">
                <button onClick={() => handleLike(post.$id)}>
                  <Heart
                    size={26}
                    className={`cursor-pointer transition-colors duration-300 ${
                      likedPosts.includes(post.$id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-500 hover:text-red-500"
                    }`}
                  />
                </button>
                <span className="text-sm">{likes[post.$id] || 0}</span>
              </div>
              
              <button
              onClick={() => {
                setSelectedPostId(post.$id);
                setOpenComments(true);
              }}
            >
              <MessageCircle size={26} className="text-gray-500" />
              </button>  
                
              
              
            </div>
          </div>
        ))}
      </div>
        <Modal open={openComments} setOpen={setOpenComments}>
        {selectedPostId && (
       <Comments postId={selectedPostId} onClose={() => setOpenComments(false)} />
       )}
      </Modal>    
    </Container>
  );
}

export default Page;
