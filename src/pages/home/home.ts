import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Web3Provider } from '../../providers/web3/web3';
import { Storage } from '@ionic/storage';
import { TouchID } from '@ionic-native/touch-id';
import { UserProvider } from '../../providers/user/user';
import { WindowRef } from '../../app/window';
import { Platform } from 'ionic-angular';
import { AddProductPage } from '../add-product/add-product';
import { HttpClient } from '@angular/common/http';
import { ConfigProvider } from '../../providers/config/config';


import ipfsAPI from 'ipfs-api';
declare const Buffer;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  balance:string;
  user:any;
  tempuser:any;
  ipfs:any;

  product:any;
  files:any;
  hash:any;

  search:any;

  constructor(
    public userProvider:UserProvider,
    private storage: Storage,
    public navCtrl: NavController,
    public web3Provider:Web3Provider,
    public windowRef:WindowRef,
    public plt:Platform,
    public modalCtrl:ModalController,
    public configProvider:ConfigProvider,
    public http:HttpClient
  ) {
    this.balance = "";
    this.tempuser = "";
    this.ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'});

    this.product = {};
    this.files = [];
    this.hash = [];

    this.search = '';
  }

  ionViewWillLeave() {

  }

  add() {
    let addModal = this.modalCtrl.create(AddProductPage, { }, { enableBackdropDismiss: false });
    addModal.present();
  }

  saveToIpfs (reader) {
    let ipfsId
    const buffer = Buffer.from(reader.result)
    this.ipfs.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) })
      .then((response) => {
        console.log(response)
        ipfsId = response[0].hash
        this.hash.push(ipfsId);
        console.log(ipfsId)
      }).catch((err) => {
        console.error(err)
      })
    }

    searchAction() {
      console.log("Searching... ", this.search);
      this.http.get(this.configProvider.Indexer_Address + '/search/' + this.search).subscribe(data => {
        console.log("Results: ", data);
      })
    }

  uploadFile(event) {
    this.files = event.target.files;

    for (var i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      console.log(file);
      let reader = new this.windowRef.nativeWindow.FileReader();
      reader.onloadend = () => this.saveToIpfs(reader);
      reader.readAsArrayBuffer(file);
    }

  }

  list() {
    this.product['images'] = this.hash;
    console.log(this.product);
    var data = new Buffer(JSON.stringify(this.product));
    var path = "dMarketlist.json";
    const stream = this.ipfs.files.addReadableStream();
    stream.on('data', function (file) {
      console.log(file);
    });
    stream.write({ path: path, content: data });
    stream.end();
  }

  transHistory() {
    var allhashes = this.userProvider.user_data['transactions'];
    var transactions = this.web3Provider.getTransactions(allhashes);
    console.log("Transaction_History: ", transactions);
  }

  printUser() {
    console.log(this.user);
  }

  getdMarkContract() {
    console.log(this.web3Provider.getdMarkContract());
  }

  authtouch() {
    console.log("Auth Private Key");
  }

  checkBalance() {
    this.web3Provider.checkBalance();
  }
}
