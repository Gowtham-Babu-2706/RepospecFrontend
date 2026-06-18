import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCodeBranch,
  faXmark,
  faBars,
  faRightToBracket,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthContext();
  const navigate = useNavigate();

  const itemLinks = [
    { title: "Home", href: "/" },
    { title: "Search", href: "/search" },
    { title: "Upload", href: "/upload" },
    { title: "About", href: "/about" },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  // Extract initials for avatar
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <nav className="w-full bg-white border-b border-gray-300 px-4 md:px-6 py-4 overflow-x-hidden fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-base md:text-lg whitespace-nowrap"
        >
          <FontAwesomeIcon icon={faCodeBranch} />
          RepoSpec
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-gray-600">
          {itemLinks.map((item, idx) => (
            <Link
              key={idx}
              to={item.href}
              className="px-3 py-2 rounded-lg hover:bg-gray-200 hover:text-black transition"
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Avatar + name */}
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {user?.name || user?.email || "User"}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
              >
                <FontAwesomeIcon icon={faRightToBracket} />
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white transition"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)" }}
              >
                <FontAwesomeIcon icon={faUser} />
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 border-t border-gray-200 pt-4 flex flex-col gap-3">
          {itemLinks.map((item, idx) => (
            <Link
              key={idx}
              to={item.href}
              className="py-2 text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              {item.title}
            </Link>
          ))}

          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 py-1">
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                    }}
                  >
                    {initials}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {user?.name || user?.email || "User"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-left py-2 text-red-500 text-sm flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="py-2 text-gray-700 text-sm font-medium flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FontAwesomeIcon icon={faRightToBracket} />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="py-2 text-sm font-medium flex items-center gap-2"
                  style={{ color: "#7c3aed" }}
                  onClick={() => setIsOpen(false)}
                >
                  <FontAwesomeIcon icon={faUser} />
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;