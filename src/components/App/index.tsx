import AppLayout from "@/components/AppLayout";
import { Frame, GlobalStyle } from "./styled";

const App: React.FC = () => {
  return (
    <Frame>
      <GlobalStyle />
      <AppLayout />
    </Frame>
  );
};

export default App;
