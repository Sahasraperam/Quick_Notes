import React from 'react'
import {Route, Routes} from "react-router";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// data-theme="retro"
const App = () => {
  return (
    <div data-theme="pastel">
      <div
  className="absolute inset-0 -z-10
  [background:radial-gradient(125%_125%_at_50%_10%,#f8f3d9_40%,#e9d8a6_70%,#d4a373_100%)]"
/>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      </Routes>
    </div>
  )
}

export default App
