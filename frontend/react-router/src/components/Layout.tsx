import { NavLink, Outlet } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

export default function Layout() {
  const { count } = useCart();
  const { isLogged, user, logout } = useAuth();

  return (
    <div className="layout">
      <header className="header">
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Products
          </NavLink>

          <NavLink to="/cart" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Cart ({count})
          </NavLink>

          {isLogged && (
            <NavLink to="/orders" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              My Orders
            </NavLink>
          )}

          <span style={{ flex: 1 }} />

          {!isLogged ? (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                Register
              </NavLink>
            </>
          ) : (
            <>
              <span className="nav-link" style={{ opacity: 0.8 }}>
                {user?.email}
              </span>
              <button className="nav-link" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
