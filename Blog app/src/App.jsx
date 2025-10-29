import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";

import Login from "./component/Login";
import Signup from "./component/Singup";
import Home from "./component/Home";
import Page from "./pages/Mainpage"; 
import Video from "./pages/Video";
import CreatePost from "./pages/CreatePost";
import Setting from "./pages/Setting";
import Comments from "./pages/Comments";
import SplashScreen from "./pages/SplashScreen";
import { useState } from "react";

function App() {
  const [showSplash,setShowSplash] = useState(true)
  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={()=>setShowSplash(false)}/>
      ):(
          <Provider store={store}>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          
          <Route path="/home" element={<Home />}>
         
            <Route index element={<Page />} />
            <Route path="page" element={<Page/>}/>
            <Route path="video" element={<Video />} />
            <Route path="createpost" element={<CreatePost />} />
            <Route path="setting" element={<Setting/>}/>
            
            
          </Route>
          <Route path="/comments/:postId" element={<Comments />} />

        </Routes>
      </BrowserRouter>
    </Provider>
      )}
    
    </>
  );
}

export default App;
