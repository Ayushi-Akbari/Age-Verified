import { Outlet } from "@remix-run/react";
import { StrictMode } from "react";

export default function AppLayout() {
  return (
    <>
      <ui-nav-menu>
        <a href="/app" rel="home">Home</a>
        <a href="/app/analytics">Analytics</a>
        <a href="/app/plans">Plans</a>
        <a href="/app/setting">Settings</a>
      </ui-nav-menu>

      <main>
        <Outlet />
      </main>
    </>
  );
}
