import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { AdminRoom } from './pages/AdminRoom';
import { AuthContextProvider } from './contexts/AuthContext';
import { Room } from "./pages/Room";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/new" element={<NewRoom />} />
          <Route path="/room/:id" element={<Room />} />
          <Route path="admin/rooms/:id" element={<AdminRoom />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
