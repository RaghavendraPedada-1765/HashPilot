import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-base)",
        color: "var(--text-body)",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Navbar />

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "32px 36px",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;