import "./App.css";
import {  Routes, Route,  } from "react-router-dom";
import Signup from "./signup/signup";
import Login from "./login/Login";

function App() {
  return (
      <Routes>
    
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
  );
}

export default App;
