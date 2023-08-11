import { DatatokenInfo, UnlockStreamResult } from "@dataverse/hooks";

export class BrowserStorage {
  private _datatokenInfoKey: string;
  private _decryptedStreamContentKey: string;

  constructor(pkh: string) {
    this._datatokenInfoKey = `${pkh}-datatoken-info-map`;
    this._decryptedStreamContentKey = `${pkh}-decrypted-stream-content-map`;
  }

  public setDatatokenInfo({
    streamId,
    datatokenInfo,
  }: {
    streamId: string;
    datatokenInfo: DatatokenInfo;
  }) {
    let dataTokenInfoMap: Record<string, DatatokenInfo>;
    const datatokenInfoMapStr = window.localStorage.getItem(
      this._datatokenInfoKey,
    );
    if (datatokenInfoMapStr) {
      dataTokenInfoMap = JSON.parse(datatokenInfoMapStr);
    } else {
      dataTokenInfoMap = {};
    }
    dataTokenInfoMap[streamId] = datatokenInfo;
    window.localStorage.setItem(
      this._datatokenInfoKey,
      JSON.stringify(dataTokenInfoMap),
    );
  }

  public getDatatokenInfo(streamId: string): DatatokenInfo | undefined {
    const datatokenInfoMapStr = window.localStorage.getItem(
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

  public setDecryptedStreamContent({
    streamId,
    streamContent,
  }: {
    streamId: string;
    streamContent: UnlockStreamResult["streamContent"];
  }) {
    let decryptedStreamContentMap: Record<
      string,
      UnlockStreamResult["streamContent"]
    >;
    const decryptedStreamContentMapStr = window.localStorage.getItem(
      this._decryptedStreamContentKey,
    );
    if (decryptedStreamContentMapStr) {
      decryptedStreamContentMap = JSON.parse(decryptedStreamContentMapStr);
    } else {
      decryptedStreamContentMap = {};
    }
    decryptedStreamContentMap[streamId] = streamContent;
    window.localStorage.setItem(
      this._decryptedStreamContentKey,
      JSON.stringify(decryptedStreamContentMap),
    );
  }

  public getDecryptedStreamContent(
    streamId: string,
  ): UnlockStreamResult["streamContent"] | undefined {
    const decryptedStreamContentMapStr = window.localStorage.getItem(
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
