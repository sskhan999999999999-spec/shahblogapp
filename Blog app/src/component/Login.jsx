import React, { useState, useEffect } from "react";
import authService from "../appwrite/auth";
import { useDispatch } from "react-redux";
import { login, logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          dispatch(login({ userData: currentUser }));
          navigate("/home", { replace: true });
        }
      } catch (error) {
        console.log("No existing session:", error.message);
      }
    };
    checkUser();
  }, [dispatch, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await authService.login(user.email, user.password);
      const currentUser = await authService.getCurrentUser();

      if (currentUser) {
        dispatch(login({ userData: currentUser }));
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Login failed. Please check your credentials.");
    }
  };

  

  return (
    <div className="px-4 bg-gray-100">
      <div className="w-full h-lvh flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="border p-6 flex flex-col items-center w-full max-w-sm rounded-2xl bg-white shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Login</h2>

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
            Login
          </button>

          <h3 className="mt-3">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-blue-600 font-semibold"
            >
              Signup
            </button>
          </h3>
        </form>

        
      </div>
    </div>
  );
}

export default Login;
