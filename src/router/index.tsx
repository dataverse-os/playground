import Layout from "@/layout";
import NotFound from "@/pages/NotFound";
import PostDetail from "@/pages/PostDetail";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  { path: "/", element: <Layout />, errorElement: <NotFound /> },
  {
    path: "post/:streamId",
    element: <PostDetail />,
    errorElement: <NotFound />,
  },
  { path: "*", element: <NotFound /> },
]);
