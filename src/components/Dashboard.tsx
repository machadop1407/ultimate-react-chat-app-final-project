import { Routes, Route } from "react-router";
import ChatRoom from "../pages/ChatRoom";
import RoomList from "../pages/RoomList";
import CreateRoom from "../pages/CreateRoom";
import Navbar from "./Navbar";

function Dashboard() {
  return (
    <section className="chat-app" style={{ color: "white" }}>
      <Navbar />
      <Routes>
        <Route index element={<ChatRoom />} />
        <Route path="/rooms" element={<RoomList />} />
        <Route path="/create-room" element={<CreateRoom />} />
      </Routes>
    </section>
  );
}

export default Dashboard;
