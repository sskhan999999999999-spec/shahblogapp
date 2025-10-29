import React from "react";
import Nav from "../pages/Nav";
import { useEffect } from "react";
import authService from "../appwrite/auth";
import { Outlet, useNavigate } from "react-router-dom";
import {useDispatch} from 'react-redux'
import {login,logout} from '../store/authSlice'

function Home() {
   const dispatch = useDispatch();
   const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await authService.getCurrentUser(); // Appwrite se session check
        if (user) {
          dispatch(login(user));
        } else {
          dispatch(logout());
          navigate('/')
        }
      } catch (error) {
        dispatch(logout());
        navigate('/')
      }
    };

    checkUser();
  }, [dispatch,navigate]);
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <Nav />
      </div>

      <div className="pt-[70px] sm:pt-[80px] px-3">
        <Outlet />
      </div>
    </>
  );
}

export default Home;

