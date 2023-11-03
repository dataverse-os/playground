import { DatatokenInfo, UnlockFileResult } from "@dataverse/hooks";
import localforage from "localforage";

export class BrowserStorage {
  private _datatokenInfoKey: string;
  private _decryptedStreamContentKey?: string;

  constructor() {
    this._datatokenInfoKey = `datatoken-info-map`;
  }

  public async setDatatokenInfo({
    fileId,
    datatokenInfo,
  }: {
    fileId: string;
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
    dataTokenInfoMap[fileId] = datatokenInfo;
    await localforage.setItem(
      this._datatokenInfoKey,
      JSON.stringify(dataTokenInfoMap),
    );
  }

  public async getDatatokenInfo(
    fileId: string,
  ): Promise<DatatokenInfo | undefined> {
    const datatokenInfoMapStr = await localforage.getItem<string>(
      this._datatokenInfoKey,
    );

    if (!datatokenInfoMapStr) {
      return;
    } else {
      const datatokenInfoMap: Record<string, DatatokenInfo> =
        JSON.parse(datatokenInfoMapStr);
      return datatokenInfoMap[fileId];
    }
  }

  public async setDecryptedFileContent({
    pkh,
    fileId,
    fileContent,
  }: {
    pkh?: string;
    fileId: string;
    fileContent: UnlockFileResult["fileContent"];
  }) {
    if (!pkh) {
      return;
    }

    if (!this._decryptedStreamContentKey) {
      this._decryptedStreamContentKey = `${pkh}-decrypted-stream-content-map`;
    }

    let decryptedStreamContentMap: Record<
      string,
      UnlockFileResult["fileContent"]
    >;
    const decryptedStreamContentMapStr = await localforage.getItem<string>(
      this._decryptedStreamContentKey,
    );
    if (decryptedStreamContentMapStr) {
      decryptedStreamContentMap = JSON.parse(decryptedStreamContentMapStr);
    } else {
      decryptedStreamContentMap = {};
    }
    decryptedStreamContentMap[fileId] = fileContent;
    await localforage.setItem(
      this._decryptedStreamContentKey,
      JSON.stringify(decryptedStreamContentMap),
    );
  }

  public async getDecryptedFileContent({
    pkh,
    fileId,
  }: {
    pkh?: string;
    fileId: string;
  }): Promise<UnlockFileResult["fileContent"] | undefined> {
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
        UnlockFileResult["fileContent"]
      > = JSON.parse(decryptedStreamContentMapStr);
      return decryptedStreamContentMap[fileId];
    }
  }
}
