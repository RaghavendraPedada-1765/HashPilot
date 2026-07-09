import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="relative flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-sans overflow-hidden">
      <div className="pointer-events-none absolute inset-0 dark:premium-surface opacity-100" />
      <div className="pointer-events-none absolute inset-0 mesh-bg opacity-40" />
      <Sidebar />

      <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 pt-5 md:p-8 lg:p-10">
          <div className="max-w-[1440px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
