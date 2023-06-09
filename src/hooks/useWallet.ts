import { WALLET, Mode, SignMethod } from "@dataverse/runtime-connector";
import { useContext, useState } from "react";
import { Context } from "../context";

export function useWallet() {
  const { runtimeConnector } = useContext(Context);
  const [wallet, setWallet] = useState<WALLET>();

  const connectWallet = async () => {
    const { address, wallet } = await runtimeConnector.connectWallet();
    console.log("Connect res:", { address, wallet });
    setWallet(wallet);
    return {
      address,
      wallet,
    };
  };

  const switchNetwork = async (chainId: number) => {
    const res = await runtimeConnector.switchNetwork(chainId);
    return res;
  };

  const sign = async (params: { method: SignMethod; params: any[] }) => {
    const res = await runtimeConnector.sign(params);
    return res;
  };

  const contractCall = async (params: {
    contractAddress: string;
    abi: any[];
    method: string;
    params: any[];
    mode?: Mode | undefined;
  }) => {
    const res = await runtimeConnector.contractCall(params);
    return res;
  };

  const ethereumRequest = async (params: { method: string; params?: any }) => {
    const res = await runtimeConnector.ethereumRequest(params);
    return res;
  };

  const getCurrentPkh = async () => {
    const res = await runtimeConnector.wallet.getCurrentPkh();
    return res;
  };

  const connectPkpWallet = async () => {
    const { address } = await runtimeConnector.connectPKPWallet();
    return address;
  };

  const executeLitAction = async (params: {
    code: string;
    jsParams: object;
  }) => {
    const res = await runtimeConnector.executeLitAction(params);
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
    connectPkpWallet,
    executeLitAction,
  };
}
