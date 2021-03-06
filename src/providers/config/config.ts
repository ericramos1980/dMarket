import { Injectable } from '@angular/core';

declare var process: any;

@Injectable()
export class ConfigProvider {
  public ETH_URL: string;
  public dMARK_Address: string;
  public dUSER_Address: string;
  public dORDER_Address: string;
  public IPFS_Address: string;
  public Indexer_Address: string;
  public debug: boolean = true;

  //TODO Need to add dot env plugin for dev/prod env variables
  constructor() {
    this.ETH_URL = this._readString('ETH_URL', 'https://rinkeby.infura.io/');

    this.dMARK_Address = this._readString('dMARK_Address', '0x748134c5CE12b12c4048bb4d2A4E3Cd6163D0618');
    this.dUSER_Address = this._readString('dUSER_Address', '0x972942f5a240de0341ccd529c87e271402edce2c');
    this.dORDER_Address = this._readString('dORDER_Address', '0xf12b5dd4ead5f743c6baa640b0216200e89b60da');

    this.IPFS_Address = this._readString('IPFS_Address', 'http://127.0.0.1:8080');
    this.Indexer_Address = this._readString('Indexer_Address', 'http://localhost:3000/api');
  }

  log(title,log_data) {
    if (this.debug) {
      console.log(title, log_data);
    }
  }

  private _readString(key: string, defaultValue?: string): string {
    const v = process.env[key];
    return v === undefined ? defaultValue : String(v);
  }
}
