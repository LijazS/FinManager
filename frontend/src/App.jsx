import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { Auth } from "./pages/auth/index"
import { Base } from "./pages/base/index"



const App = () => {
  

  return (
   <div className='App'>
      
      <Router>
        <Routes>
          <Route path='/' exact element={<Auth />}/>
          <Route path='/base' element={<Base />}/>
        </Routes>
      </Router>

      

    </div>
  )
}

export default App
