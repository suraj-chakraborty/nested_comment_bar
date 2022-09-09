import { Route, Routes } from "react-router-dom";
import { PostList } from "./Components/PostList";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:id" element="POSTS" />
      </Routes>
    </div>
  );
}

export default App;
