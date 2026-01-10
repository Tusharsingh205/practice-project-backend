import React, { useState } from "react";
import api from "../api/api";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";

// ✅ Form data type
interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  contact: string;
}

const Signup: React.FC = () => {

  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
  });
  

  const navigate = useNavigate();

  // ✅ Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit handler
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    console.log("Form Data 👉", formData);

    try {
      const res = await api.post(
        "/register",
        formData
      );
      console.log("API Response ✅", res.data);
      alert("User registered successfully ✅");
      navigate("/login");

    } catch (error) {
      const err = error as AxiosError<any>;
      console.error("API Error ❌", err.response?.data);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-black-300 shadow w-full sm:w-3/4 md:w-1/2 lg:w-1/3 p-6 sm:p-8 rounded-lg shadow-md ">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-center to-blue-700 from-purple-900 via-pink-600  bg-gradient-to-r text-transparent bg-clip-text">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 mb-3 border rounded"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 mb-3 border rounded"
          />

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full p-2 mb-3 border rounded"
          />

          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-2 mb-3 border rounded"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Sign Up
          </button>

          <p className="text-center pt-2">
            Already have an account?
            <Link to="/login" className="text-blue-700 font-semibold">
              {" "}Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
