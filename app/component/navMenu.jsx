// app/components/NavMenu.jsx
import { Link } from "@remix-run/react";

export default function NavMenu() {
  return (
    <nav style={{ marginBottom: "1rem" }}>
      <ul style={{ listStyle: "none", display: "flex", gap: "1rem" }}>
        <li><Link to="/app/index" rel="home">Home</Link></li>
        <li><Link to="/app/analytics">Analytics</Link></li>
        <li><Link to="/app/plans">Plans</Link></li>
        <li><Link to="/app/setting">Setting</Link></li>
      </ul>
    </nav>
  );
}
