import { Route, Routes } from "react-router-dom";
import { Post } from "./Components/Post";
import { PostList } from "./Components/PostList";
import { PostProvider } from "./contexts/PostContext";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route
          path="/posts/:id"
          element={
            <PostProvider>
              <Post />
            </PostProvider>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
