function Navbar() {
  return (
    <nav
      className="navbar navbar-dark mb-4"
      style={{
        background:
          "linear-gradient(90deg,#0c055c 0%,#2d6eb3 50%,#f28c28 100%)",
      }}
    >
      <div className="container-fluid d-flex justify-content-center">
        <h5
          className="m-0 text-white fw-bold text-center"
          style={{
            width: "100%",
            letterSpacing: "0.5px",
          }}
        >
          Letras y Acordes CEHCJ
        </h5>
      </div>
    </nav>
  );
}

export default Navbar;