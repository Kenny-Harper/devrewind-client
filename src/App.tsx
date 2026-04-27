/*
 * WHAT THIS FILE DOES (plain English)
 *
 * This is the root of the React app. It sets up routing — meaning it decides
 * which page component to show based on the URL the user is on.
 *
 * / (home)           = Landing page with Login with GitHub button
 * /dashboard         = Where the user lands after logging in
 * /wrapped/:username = The public shareable card page
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Wrapped from './pages/Wrapped'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wrapped/:username" element={<Wrapped />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App