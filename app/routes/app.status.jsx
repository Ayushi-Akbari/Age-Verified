import { useSearchParams } from "@remix-run/react";

export default function AppStatus() {
  const [searchParams] = useSearchParams();

  const shop = searchParams.get("shop");
  const themeId = searchParams.get("themeId");
  const userId = searchParams.get("userId");

  console.log("Shop:", shop);
  console.log("Theme ID:", themeId);
  console.log("User ID:", userId);

  return (
    <div>
      <h2>App Status</h2>
      <p>Shop: {shop || "Not found"}</p>
      <p>Theme ID: {themeId || "Not found"}</p>
      <p>User ID: {userId || "Not found"}</p>
    </div>
  );
}
