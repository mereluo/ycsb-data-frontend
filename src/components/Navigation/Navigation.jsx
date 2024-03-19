import React from "react";
import "./navigation.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";

function Navigation() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    return (
        <Navbar expand="lg" style={{ backgroundColor: "#f3f5f6" }}>
            <Container>
                <img src="src/assets/ycsblogo.png" width={50} height={40} className="d-inline-block align-top" alt="" />
                <Navbar.Brand to="/" style={{ marginLeft: "20px" }}>
                    YCSB Database Repository
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link to="/" className={`nav-link ${isActive("/")}`}>
                            Home
                        </Link>
                        <Link to="/search" className={`nav-link ${isActive("/search")}`}>
                            Start Search
                        </Link>
                        <Link to="/upload" className={`nav-link ${isActive("/upload")}`}>
                            Upload
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default Navigation;
