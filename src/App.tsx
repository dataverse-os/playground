import { Frame, GlobalStyle } from "./styled";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "@arco-design/web-react/dist/css/arco.css";

const App: React.FC = () => {
  return (
    <Frame>
      <GlobalStyle />
      <RouterProvider router={router} />
    </Frame>
  );
};

export default App;
