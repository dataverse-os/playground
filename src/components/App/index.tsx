import AppLayout from "@/components/AppLayout";
import rootStore from "@/state/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Frame, GlobalStyle } from "./styled";

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
