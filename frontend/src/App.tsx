import { Route, Routes } from "react-router-dom";
import { Demo } from "./pages/Demo";
import { Home } from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/demo" element={<Demo />} />
    </Routes>
  );
}

export default App;
