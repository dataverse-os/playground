import { WALLET, SignMethod, Methods } from "@dataverse/core-connector";
import { useContext, useState } from "react";
import { Context } from "../context";

export function useWallet() {
  const { coreConnector } = useContext(Context);
  const [wallet, setWallet] = useState<WALLET>();

  const connectWallet = async () => {
    const { address, wallet } = await coreConnector.connectWallet();
    console.log("Connect res:", { address, wallet });
    setWallet(wallet);
    return {
      address,
      wallet,
    };
  };

  const switchNetwork = async (chainId: number) => {
    const res = await coreConnector.runOS({
      method: Methods.switchNetwork,
      params: chainId,
    });
    return res;
  };

  const sign = async (params: { method: SignMethod; params: any[] }) => {
    const res = await coreConnector.runOS({
      method: Methods.sign,
      params,
    });
    return res;
  };

  const contractCall = async (params: {
    contractAddress: string;
    abi: any[];
    method: string;
    params: any[];
  }) => {
    const res = await coreConnector.runOS({
      method: Methods.contractCall,
      params,
    });
    return res;
  };

  const ethereumRequest = async (params: { method: string; params?: any }) => {
    const res = await coreConnector.runOS({
      method: Methods.ethereumRequest,
      params,
    });
    return res;
  };

  const getCurrentPkh = async () => {
    const res = await coreConnector.runOS({
      method: Methods.getCurrentPkh,
    });
    return res;
  };

  const getPKP = async () => {
    const { address } = await coreConnector.runOS({
      method: Methods.getPKP,
    });
    return address;
  };

  const executeLitAction = async (params: {
    code: string;
    jsParams: object;
  }) => {
    const res = await coreConnector.runOS({
      method: Methods.executeLitAction,
      params,
    });
    return res;
  };

  return {
    wallet,
    connectWallet,
    switchNetwork,
    sign,
    contractCall,
    ethereumRequest,
    getCurrentPkh,
    getPKP,
    executeLitAction,
  };
}
