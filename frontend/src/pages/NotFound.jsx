export default function NotFound() {
  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", background: "#f3f4f6" }}
    >
      <div className="row w-100">
        <div className="col-12 text-center">
          <h1 style={{ fontSize: "2.5rem", color: "#2563eb" }}>404</h1>
          <p style={{ fontSize: "1.2rem", color: "#222" }}>
            Página no encontrada
          </p>
        </div>
      </div>
    </div>
  );
}
