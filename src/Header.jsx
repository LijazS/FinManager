import './Header.css';
import { signOut } from "firebase/auth";
import { auth } from "./config/firebase-config"; // adjust the path if your file structure is different
import { useNavigate } from "react-router-dom"; // if you're using React Router

const Header = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                localStorage.removeItem("auth");
                console.log("User signed out");
                navigate("/");
            })
            .catch((error) => {
                console.error("Sign-out error", error);
            });
    };

    const handleSelection = (type, value) => {
        const filter = { type, value }; // e.g., { type: "year", value: "This Year" }
        localStorage.setItem("chartFilter", JSON.stringify(filter));
        console.log("Chart filter saved:", filter);
          window.dispatchEvent(new CustomEvent("chartFilterUpdated", { detail: filter }));
        // optionally: navigate or trigger update
        console.log("event listener dispatched :", filter);
    };

    return (
        <header>
            <nav className="nav-bar">
                <ul className="nav-links">
                    <li><a href="#">Home</a></li>
                    <li className="dropdown">
                        <a href="#">Charts ▾</a>
                        <ul className="dropdown-content">
                            <li className="nested-dropdown">
                                <a href="#">By Year ▸</a>
                                <ul className="nested-content">
                                    {["This Year", "Last 2 Years", "Last 3 Years", "Lifetime"].map(
                                        (label) => (
                                            <li key={label}>
                                                <a
                                                    href="#"
                                                    onClick={() => handleSelection("year", label)}
                                                >
                                                    {label}
                                                </a>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </li>
                            <li className="nested-dropdown">
                                <a href="#">By Month ▸</a>
                                <ul className="nested-content">
                                    <li>
                                        <a href="#" onClick={() => handleSelection("month", "This Month")}>
                                            This Month
                                        </a>
                                    </li>
                                    {[
                                        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                                    ].map((month) => (
                                        <li key={month}>
                                            <a href="#" onClick={() => handleSelection("month", month)}>
                                                {month}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li><a href="#">Services</a></li>
                </ul>
                <div className="signout-card" onClick={handleSignOut}>
                    <ul className="nav-signout">
                        <li><a href="#">Sign Out</a></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};



export default Header;