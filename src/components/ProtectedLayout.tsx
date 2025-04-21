import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  return (
    <>
      <Navbar />
      <main className="container py-8">
        <Outlet />
      </main>
    </>
  );
}
