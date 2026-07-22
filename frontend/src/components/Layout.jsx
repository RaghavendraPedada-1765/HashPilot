import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

/**
 * Layout
 *
 * Root shell for all pages.
 * Structure: fixed sidebar (220px) + [compact navbar, scrollable content].
 * No footer — this is a desktop application.
 */
function Layout({ children }) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--bg-base)", color: "var(--text-primary)", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Main column */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto w-full max-w-[1440px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
