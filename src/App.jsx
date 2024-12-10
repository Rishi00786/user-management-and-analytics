import LoginPage from "./components/Auth/Login"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Users/Dashboard";
import Analytics from "./components/Dashboard/Analytics/Analytics";


function App() {

  return (
    <Router>
      <Routes>

        <Route path="/" element={<LoginPage />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/analytics-dashboard" element={<Analytics />} />
        
      </Routes>
    </Router>
  )
}

export default App
