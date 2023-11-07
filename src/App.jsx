import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navigation from "./components/Navigation/Navigation.jsx";
import Home from "./components/home/home.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import Questions from "./components/Questions/Questions.jsx";

function App() {

  return (
    <>
        <div>
            <Navigation/>
            <div>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/start' element={<Questions />} />
                </Routes>

            </div>

        </div>

    </>
  )
}

export default App;
