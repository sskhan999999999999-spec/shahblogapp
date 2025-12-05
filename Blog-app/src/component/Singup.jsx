import React, { useState } from "react";
import authService from "../appwrite/auth";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Signup + Auto Login
      const session = await authService.createAccount(
        user.email,
        user.password,
        user.name
      );

      // Current user fetch kar lo
      const currentUser = await authService.getCurrentUser();

      if (currentUser) {
        dispatch(login({ userData: currentUser }));

        
        navigate("/home"); 
      }
    } catch (error) {
      console.error(error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="px-4 bg-gray-100">
    <div className=" w-full h-lvh flex items-center justify-center ">
      <form
        onSubmit={handleSubmit}
        className="border p-6 flex flex-col items-center w-full max-w-sm rounded-2xl bg-white shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Signup</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border rounded-lg p-2 mb-3"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-2 mb-3"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-2 mb-3"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg p-2 w-full font-semibold hover:bg-blue-700"
        >
          Signup
        </button>

        <p className="text-sm mt-3">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer font-semibold"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
    </div>
  );
}

export default Signup;
