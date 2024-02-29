import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/Navigation/Navigation.jsx";
import Home from "./components/Home/home.jsx";
import Upload from "./components/Upload/Upload.jsx";
import ResultMain from "./components/Result/ResultMain.jsx";
import { Route, Routes } from "react-router-dom";
import Search from "./components/Search/Search.jsx";
import { FieldProvider } from "./context/FieldContext.jsx";

function App() {
    return (
        <>
            <div>
                <Navigation />
                <div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/search"
                            element={
                                <FieldProvider>
                                    <Search />
                                </FieldProvider>
                            }
                        />
                        <Route
                            path="/upload"
                            element={
                                <FieldProvider>
                                    <Upload />
                                </FieldProvider>
                            }
                        />
                        <Route path="/resultMain" element={<ResultMain />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default App;
