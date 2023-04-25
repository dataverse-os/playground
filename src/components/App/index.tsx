import AppLayout from "@/components/AppLayout";
import NotFound from "@/pages/NotFound";
import PostDetail from "@/pages/PostDetail";
import rootStore from "@/state/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Frame, GlobalStyle } from "./styled";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@arco-design/web-react/dist/css/arco.css";

const router = createBrowserRouter([
  { path: "/", element: <AppLayout />, errorElement: <NotFound /> },
  { path: "post/:streamId", element: <PostDetail />, errorElement: <NotFound /> },
  { path: "*", element: <NotFound /> },
]);

const App: React.FC = () => {
  return (
    <Provider store={rootStore.store}>
      <PersistGate persistor={rootStore.persistor}>
        <Frame>
          <GlobalStyle />
          <RouterProvider router={router} />
        </Frame>
      </PersistGate>
    </Provider>
  );
};

export default App;
