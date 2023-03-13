import React, {  ReactElement, ReactNode, useEffect } from "react";
import { RadioGroupWrap } from "./RadioGroupWrap";

export interface SubmitButtonProps {
  children: ReactElement[];
}

interface Context {

}

const RadioGroupContext = React.createContext<Context>({} as Context);

const RadioGroup: React.FC<SubmitButtonProps> = ({ children }) => {
  return (
    <RadioGroupContext.Provider value={{cone}}>
      <RadioGroupWrap>{children}</RadioGroupWrap>
    </RadioGroupContext.Provider>
  );
};

export default RadioGroup;
