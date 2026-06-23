import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Ahorros from './pages/Ahorros'
import Creditos from './pages/Creditos'
import Transferencias from './pages/Transferencias'
import Perfil from './pages/Perfil'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/registro" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/ahorros" element={<PrivateRoute><Ahorros /></PrivateRoute>} />
      <Route path="/creditos" element={<PrivateRoute><Creditos /></PrivateRoute>} />
      <Route path="/transferencias" element={<PrivateRoute><Transferencias /></PrivateRoute>} />
      <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}