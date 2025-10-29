import React, { useEffect, useState, useRef } from "react";
import service from "../appwrite/config";
import conf from "../conf/conf";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Trash2Icon,
} from "lucide-react";
import authService from "../appwrite/auth";
import { ID, Query } from "appwrite";
import Container from "./Container.jsx";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Modal from "./Modal";
import Comments from "./Comments";
import { useLocation } from "react-router-dom";



function Page() {
  const location = useLocation()
  // const extraVideo = location.state?.dataurl
  // console.log("New post",extraVideo,);
  const [posts, setPosts] = useState([]);
  const [mediaUrls, setMediaUrls] = useState({});
  const [likes, setLikes] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    const loadData = async () => {
      try {
        const res = await service.getPosts();

        const videoPosts = res.documents.filter((post) => post.videoFile);
        setPosts(videoPosts);

        const likedRes = await service.databases.listDocuments(
          conf.appwriteDataBaseId,
          conf.appwriteLikesCollectionId,
          [Query.equal("userId", user.$id)]
        );

        setLikedPosts(likedRes.documents.map((doc) => doc.postId));

        const urls = {};
        const likeCounts = {};

        videoPosts.forEach((post) => {
          urls[post.$id] = {
            type: "video",
            url: service.getFileUrl(post.videoFile),
          };
          likeCounts[post.$id] = post.likes || 0;
        });

        setMediaUrls(urls);
        setLikes(likeCounts);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
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
      { threshold: 0.5 }
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

       
        const audio = new Audio(successAudio);
        audio.play();
      } else {
        setLikedPosts((prev) => prev.filter((id) => id !== postId));
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };
  // useEffect(()=>{
  //   if(extraVideo){
  //     setMediaUrls(prev=>({
  //       ...prev,
  //       custom:{type:"video",url:extraVideo}
  //     }))
  //     setPosts(prev=>[
  //       {$id:"custom",title:"clicked post",content:"post from another page"},
  //       ...prev
  //     ])
  //   }
  // },[extraVideo])

  
  const handleDelete = async (postId) => {
    try {
      await service.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.$id !== postId));
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  return (
    <Container>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold text-blue-400 mb-4 text-center border-b-2 border-gray-300 pb-3">
          Videos
        </h2>

        {loading && <p className="text-center text-xl">Loading...</p>}

        {posts.map((post) => (
          <div
            key={post.$id}
            className="border-b-2 border-gray-400 py-4 mb-6 space-y-3"
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

            
            {mediaUrls[post.$id] && (
              <video
                ref={(el) => (videoRefs.current[post.$id] = el)}
                src={mediaUrls[post.$id].url }
                controls
                muted
                className="w-full object-cover rounded-lg"
              />
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
          <Comments
            postId={selectedPostId}
            onClose={() => setOpenComments(false)}
          />
        )}
      </Modal>
    </Container>
  );
}

export default Page;
