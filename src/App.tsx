import { Route, Routes } from "react-router";
import "./App.css";
import { Header } from "./components/layout/Header";
import { PostList } from "./features/PostList";
import { NotFoundPage } from "./components/layout/NotFoundPage";
import { PostDetailPage } from "./features/PostDetailPage";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollToTop />
          <Toaster position="top-center" />
          <Header />
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:postId" element={<PostDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
