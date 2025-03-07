import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './Pages/App.jsx'
import LoginPage from './Pages/LoginPage.jsx';
import Home from './Pages/HomePage.jsx';
import MaterialPage from './Pages/MaterialPage.jsx';
import Profile from './Pages/ProfilePage.jsx';
import Ch1Page from './Pages/Ch1Page.jsx';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path='/Home' element={<Home />} />
      <Route path='/Login' element={<LoginPage />} />
      <Route path='/Profile' element={<Profile />} />

      <Route path='Material' element={<MaterialPage />} />
      <Route path='Material/Ch1Page' element={<Ch1Page />} />
      {/* <Route path='Ch2Page' element={<Ch2Page />} />
        <Route path='Ch3Page' element={<Ch3Page />} />
        <Route path='Ch4Page' element={<Ch4Page />} /> */}


      <Route />
    </Routes>
  </BrowserRouter>
)
