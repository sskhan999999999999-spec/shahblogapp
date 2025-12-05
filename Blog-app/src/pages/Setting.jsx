import React from "react";
import Container from "./Container";
import authService from "../appwrite/auth";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function Setting() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const user = await authService.getCurrentUser();
      console.log(user);
      

      const res = await authService.logout();
    

      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed! See console.");
    }
  };

  return (
    <div className="lg:mr-6 text-center place-content-center ">
      <Container>
        <div className="p-20">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
        </div>
      </Container>
    </div>
  );
}

export default Setting;
