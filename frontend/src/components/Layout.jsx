import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

/**
 * Layout
 *
 * Root shell for all authenticated pages.
 * Structure: sidebar (desktop) + [navbar, main content, footer].
 */
function Layout({ children }) {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-50 font-sans text-slate-700 dark:bg-slate-950 dark:text-slate-300">
      {/* Ambient background layers */}
      <div className="pointer-events-none absolute inset-0 dark:bg-[radial-gradient(circle_at_18%_14%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_78%_10%,rgba(99,102,241,0.16),transparent_26%),linear-gradient(135deg,rgba(2,6,23,0.98),rgba(15,23,42,0.94))] opacity-0 dark:opacity-100" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(34,211,238,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.045)_1px,transparent_1px)] [background-size:40px_40px]" />

      {/* Collapsible sidebar (desktop only) */}
      <Sidebar />

      {/* Main column */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 pt-5 md:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-[1440px]">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Layout;
