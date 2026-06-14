import { Outlet } from "react-router";
import Header from "@/components/layouts/Header";

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
