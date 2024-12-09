import LoginPage from "./components/Auth/Login"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Users/Dashboard";


function App() {

  return (
    <Router>
      <Routes>

        <Route path="/" element={<LoginPage />} />

        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </Router>
  )
}

export default App
