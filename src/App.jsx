import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/Navigation/Navigation.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import Upload from "./components/Upload/Upload.jsx";
import Result from "./components/Result/Result.jsx";
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
                        <Route path="/" element={<HomePage />} />
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
                        <Route path="/result" element={<Result />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default App;
