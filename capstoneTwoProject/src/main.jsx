import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './Pages/App.jsx'
import LoginPage from './Pages/LoginPage.jsx';
import Home from './Pages/Home.jsx';
import MaterialPage from './Pages/MaterialPage.jsx';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path='/Home' element={<Home />} />
      <Route path='/Material' element={<MaterialPage />} />
    </Routes>
  </BrowserRouter>
)
