import React from "react";

import { createBrowserRouter } from "react-router-dom";

import Layout from "@/layout";
import NotFound from "@/pages/NotFound";
import PostDetail from "@/pages/PostDetail";

export const router = createBrowserRouter([
  { path: "/", element: <Layout />, errorElement: <NotFound /> },
  {
    path: "post/:streamId",
    element: <PostDetail />,
    errorElement: <NotFound />,
  },
  { path: "*", element: <NotFound /> },
]);
