// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/auth.jsx';
import Home from  "./component/home.jsx";
import Auth from "./component/auth.jsx";
import "./app.css";


function App() {
  return(
    <Router>
      <AuthProvider>
        
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path='/auth' element={<Auth/>}></Route>
        </Routes>
        
      </AuthProvider>
    </Router>
  )
}

export default App;
