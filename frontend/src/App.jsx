import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <Container>
        <Outlet />
      </Container>
    </div>
  );
}

export default App;
