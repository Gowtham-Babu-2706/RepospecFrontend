import Home from './Pages/FirstPage/Home'
import NavBar from './utils/NavBar'
import { Routes, Route } from 'react-router-dom'
import SearchPage from './Pages/SearchPage'
import Upload from './Pages/Upload'
import About from './Pages/About'
import Login from './Pages/Login'
import Register from './Pages/Register'
import OAuth2Callback from './Pages/OAuth2Callback'
import ProtectedRoute from './utils/ProtectedRoute'

const App = () => {
  return (
    <div>
      <Routes>
        {/* Auth pages — no NavBar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />

        {/* Main app — with NavBar */}
        <Route
          path="/*"
          element={
            <>
              <NavBar />
              <div className="pt-10 md:pt-20">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/about" element={<About />} />
                  <Route
                    path="/upload"
                    element={
                      <ProtectedRoute>
                        <Upload />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App