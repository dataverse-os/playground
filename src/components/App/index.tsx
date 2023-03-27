import AppLayout from "@/components/AppLayout";
import rootStore from "@/state/store";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Frame, GlobalStyle } from "./styled";
import "@arco-design/web-react/dist/css/arco.css";

const App: React.FC = () => {
  return (
    <Provider store={rootStore.store}>
      <PersistGate persistor={rootStore.persistor}>
        <Frame>
          <GlobalStyle />
          <AppLayout />
        </Frame>
      </PersistGate>
    </Provider>
  );
};

export default App;
