import { DatatokenInfo, UnlockStreamResult } from "@dataverse/hooks";
import localforage from "localforage";

export class BrowserStorage {
  private _datatokenInfoKey: string;
  private _decryptedStreamContentKey?: string;

  constructor() {
    this._datatokenInfoKey = `datatoken-info-map`;
  }

  public async setDatatokenInfo({
    streamId,
    datatokenInfo,
  }: {
    streamId: string;
    datatokenInfo: DatatokenInfo;
  }) {
    let dataTokenInfoMap: Record<string, DatatokenInfo>;
    const datatokenInfoMapStr = await localforage.getItem<string>(
      this._datatokenInfoKey,
    );
    if (datatokenInfoMapStr) {
      dataTokenInfoMap = JSON.parse(datatokenInfoMapStr);
    } else {
      dataTokenInfoMap = {};
    }
    dataTokenInfoMap[streamId] = datatokenInfo;
    await localforage.setItem(
      this._datatokenInfoKey,
      JSON.stringify(dataTokenInfoMap),
    );
  }

  public async getDatatokenInfo(
    streamId: string,
  ): Promise<DatatokenInfo | undefined> {
    const datatokenInfoMapStr = await localforage.getItem<string>(
      this._datatokenInfoKey,
    );

    if (!datatokenInfoMapStr) {
      return;
    } else {
      const datatokenInfoMap: Record<string, DatatokenInfo> =
        JSON.parse(datatokenInfoMapStr);
      return datatokenInfoMap[streamId];
    }
  }

  public async setDecryptedStreamContent({
    pkh,
    streamId,
    streamContent,
  }: {
    pkh?: string;
    streamId: string;
    streamContent: UnlockStreamResult["streamContent"];
  }) {
    if (!pkh) {
      return;
    }

    if (!this._decryptedStreamContentKey) {
      this._decryptedStreamContentKey = `${pkh}-decrypted-stream-content-map`;
    }

    let decryptedStreamContentMap: Record<
      string,
      UnlockStreamResult["streamContent"]
    >;
    const decryptedStreamContentMapStr = await localforage.getItem<string>(
      this._decryptedStreamContentKey,
    );
    if (decryptedStreamContentMapStr) {
      decryptedStreamContentMap = JSON.parse(decryptedStreamContentMapStr);
    } else {
      decryptedStreamContentMap = {};
    }
    decryptedStreamContentMap[streamId] = streamContent;
    await localforage.setItem(
      this._decryptedStreamContentKey,
      JSON.stringify(decryptedStreamContentMap),
    );
  }

  public async getDecryptedStreamContent({
    pkh,
    streamId,
  }: {
    pkh?: string;
    streamId: string;
  }): Promise<UnlockStreamResult["streamContent"] | undefined> {
    if (!pkh) {
      return;
    }

    if (!this._decryptedStreamContentKey) {
      this._decryptedStreamContentKey = `${pkh}-decrypted-stream-content-map`;
    }

    const decryptedStreamContentMapStr = await localforage.getItem<string>(
      this._decryptedStreamContentKey,
    );

    if (!decryptedStreamContentMapStr) {
      return;
    } else {
      const decryptedStreamContentMap: Record<
        string,
        UnlockStreamResult["streamContent"]
      > = JSON.parse(decryptedStreamContentMapStr);
      return decryptedStreamContentMap[streamId];
    }
  }
}
