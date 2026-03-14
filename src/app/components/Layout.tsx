import { Outlet } from "react-router";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div className="dark min-h-screen bg-black">
      <Navbar />
      <Outlet />
    </div>
  );
}
