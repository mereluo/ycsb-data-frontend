import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/Navigation/Navigation.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import SingleUpload from "./components/Upload/SingleUpload.jsx";
import Result from "./components/Result/Result.jsx";
import { Route, Routes } from "react-router-dom";
import Search from "./components/Search/Search.jsx";
import { FieldProvider } from "./context/FieldContext.jsx";
import BatchUpload from "./components/Upload/BatchUpload.jsx";

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
                            path="/single-upload"
                            element={
                                <FieldProvider>
                                    <SingleUpload />
                                </FieldProvider>
                            }
                        />
                        <Route path="/batch-upload" element={<BatchUpload />} />
                        <Route path="/result" element={<Result />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default App;
