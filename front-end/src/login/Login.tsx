import React, { useState } from "react";
import api from "../api/api";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/login", formData);

      console.log("Login Success ✅", res.data);

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      alert("Login successful 🎉");
        navigate("/");
    } catch (error) {
      const err = error as AxiosError<any>;
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full sm:w-3/4 md:w-1/3 p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded"
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <Link to="/forgot-password" className="text-blue-700 text-start p-2">Forgot password ?</Link>

          <p className="pr-4 p-2">User not register please ?<Link className="text-blue-700" to="/">signup</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
