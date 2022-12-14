import { Container } from "@material-ui/core";
import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./Components/Auth/Auth";

import Home from "./Components/Home/Home";
import Navbar from "./Components/NavBar/Navbar";
import PostDetails from "./Components/PostDetails/PostDetails";

function App() {
  const user = JSON.parse(localStorage.getItem("Profile"));
  const Redirect = () => {
    return <Navigate to="/posts" />;
  };

  return (
    <Container maxwidth="xl">
      <Navbar />
      <Routes>
        <Route path="/" element={<Redirect />} />
        <Route path="/posts" element={<Home />} />
        <Route path="/posts/search" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/auth" element={!user ? <Auth /> : <Redirect />} />
        <Route path="*" element={<Redirect />} />
      </Routes>
    </Container>
  );
}

export default App;
