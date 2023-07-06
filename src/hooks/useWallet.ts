import { WALLET, Mode, SignMethod } from "@dataverse/dataverse-connector";
import { useContext, useState } from "react";
import { Context } from "../context";

export function useWallet() {
  const { dataverseConnector } = useContext(Context);
  const [wallet, setWallet] = useState<WALLET>();

  const connectWallet = async () => {
    const { address, wallet } = await dataverseConnector.connectWallet();
    console.log("Connect res:", { address, wallet });
    setWallet(wallet);
    return {
      address,
      wallet,
    };
  };

  const switchNetwork = async (chainId: number) => {
    const res = await dataverseConnector.switchNetwork(chainId);
    return res;
  };

  const sign = async (params: { method: SignMethod; params: any[] }) => {
    const res = await dataverseConnector.sign(params);
    return res;
  };

  const contractCall = async (params: {
    contractAddress: string;
    abi: any[];
    method: string;
    params: any[];
    mode?: Mode | undefined;
  }) => {
    const res = await dataverseConnector.contractCall(params);
    return res;
  };

  const ethereumRequest = async (params: { method: string; params?: any }) => {
    const res = await dataverseConnector.ethereumRequest(params);
    return res;
  };

  const getCurrentPkh = async () => {
    const res = await dataverseConnector.getCurrentPkh();
    return res;
  };

  const getPKP = async () => {
    const { address } = await dataverseConnector.getPKP();
    return address;
  };

  const executeLitAction = async (params: {
    code: string;
    jsParams: object;
  }) => {
    const res = await dataverseConnector.executeLitAction(params);
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
