import { Link, Outlet, useNavigation } from "@remix-run/react";
import { useEffect, lazy, Suspense } from "react";

export default function AppLayout() {
  const navigation = useNavigation();

  return (
    <>
      <ui-nav-menu>
        <Link to="/app" rel="home" prefetch="intent">Home</Link>
        <Link to="/app/analytics" prefetch="intent">Analytics</Link>
        <Link to="/app/market" prefetch="intent">Markets</Link>
        <Link to="/app/setting" prefetch="intent">Settings</Link>
        <Link to="/app/datepicker" prefetch="intent">date</Link>
      </ui-nav-menu>
      {navigation.state === "loading" ? null : (
        <main>
          <Outlet />
        </main>
      )}
    </>
  );
}