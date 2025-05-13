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
import RegisterPage from './Pages/RegisterPage.jsx';
import LevelPage from './Pages/LevelPage.jsx';
import "./i18n";
import ProblemPage from './Pages/ProblemPage.jsx';
import ProblemPageX from './Pages/ProblemPageX.jsx';
import ProgressPage from './Pages/ProgressPage.jsx';
import Tournaments from './Pages/Tournaments.jsx';
import Admin from './Pages/admin.jsx';
import TournamentCompete from './Pages/TournamentCompete.jsx';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/Login' element={<LoginPage />} />
      <Route path='/Profile' element={<Profile />} />
      <Route path='/Register' element={<RegisterPage />} />

      <Route path='/Grade' element={<LevelPage />} />
      <Route path='/Grade/Material' element={<MaterialPage />} />
      <Route path='/Grade/Material/Ch1Page' element={<Ch1Page />} />
      <Route path='/Grade/Material/ProblemPage' element={<ProblemPage />} />
      <Route path='/Grade/Material/Ch1Page/x' element={<ProblemPageX />} />
      <Route path='/Progress' element={<ProgressPage />} />
      <Route path='/tournaments' element={<Tournaments />} />
      <Route path='/admin' element={<Admin />} />
      <Route path='/tournament-compete' element={<TournamentCompete />} />

      {/* <Route path='Ch2Page' element={<Ch2Page />} />
        <Route path='Ch3Page' element={<Ch3Page />} />
        <Route path='Ch4Page' element={<Ch4Page />} /> */}


      <Route />
    </Routes>
  </BrowserRouter>
)
