import { Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'

import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Todos from './components/Todos'
import Posts from './components/Posts'
import Info from './components/Info'
import Layout from './components/Layout'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

import './styles/global.css'

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          <Route
            path="/users/:userId/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:userId/info"
            element={
              <ProtectedRoute>
                <Info />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:userId/posts"
            element={
              <ProtectedRoute>
                <Posts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:userId/todos"
            element={
              <ProtectedRoute>
                <Todos />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  )
}

export default App
