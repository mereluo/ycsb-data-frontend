import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/Navigation/Navigation.jsx";
import Home from "./components/Home/home.jsx";
import Upload from "./components/Upload/Upload.jsx";
import Result from "./components/Result/Result.jsx";
import { Route, Routes } from "react-router-dom";
import Questions from "./components/Questions/Questions.jsx";

function App() {
    return (
        <>
            <div>
                <Navigation />
                <div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/start" element={<Questions />} />
                        <Route path="/upload" element={<Upload />} />
                        <Route path="/result" element={<Result />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default App;
