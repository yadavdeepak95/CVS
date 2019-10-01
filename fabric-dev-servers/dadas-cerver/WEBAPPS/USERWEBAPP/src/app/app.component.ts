import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RestService } from '../services/rest.service';
import * as CryptoJS from 'crypto-js';
import * as ipfsAPI from 'ipfs-api';

import * as toBuffer from 'blob-to-buffer';

//const ipfs = require('ipfs-api')('localhost', '5001');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private authenticated = false;
  private loggedIn = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private restService: RestService) {
  }

  private currentUser;
  private certificates;
  private endorsableCertificates;
  private userCertificatesCheck = false;
  private userEndorsableCertificatesCheck = false;
  private selectedCertificate;
  private uploadedCertificateHash;
  private certificateTypelistData;
  private ipfsSuccess = false;

  private signUpInProgress = false;

  @ViewChild('signupForm') signupForm;

  private signUp = {
    id: '',
    firstName: '',
  };

  private newCerti = {
    'certificateHash': '',
    'description': '',
    'url':'',
    'type': '',
    'holder': '',
    'issuer': 'resource:org.dadas.cerver.Organization#1',
    'uploader': '',
  };

  newCertiInit() {
    this.newCerti = {
      'certificateHash': '',
      'description': '',
      'url':'',
      'type': '',
      'holder': '',
      'issuer': 'resource:org.dadas.cerver.Organization#1',
      'uploader': '',
    };
  }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe((queryParams) => {
        const loggedIn = queryParams['loggedIn'];
        if (loggedIn) {
          this.authenticated = true;
          return this.router.navigate(['/'])
            .then(() => {
              return this.checkWallet();
            });
        }
      });
  }

  logout() {
    this.loggedIn = false;
    this.authenticated = false;
  }

  checkWallet() {
    return this.restService.checkWallet()
      .then((results) => {
        console.log(results);
        if (results['length'] > 0) {
          this.loggedIn = true;
          return this.getCurrentUser()
          .then(() => {
            return this.certificateTypeList();
          });
        }
      });
  }

  onSignUp() {
    this.signUpInProgress = true;
    return this.restService.signUp(this.signUp)
      .then(() => {
        return this.getCurrentUser();
      })
      .then(() => {
        this.loggedIn = true;
        this.signUpInProgress = false;
      });
  }

  getCurrentUser() {
    return this.restService.getCurrentUser()
      .then((currentUser) => {
        console.log(currentUser);
        this.currentUser = currentUser;
       
      });
  }

  getUserCertificates() {
    return this.restService.getUserCertificates(this.currentUser.userId)
      .then(certificates => {
        this.certificates = certificates;
        console.log("getUserCertificates");
        console.log(this.certificates);
        this.userCertificatesCheck = true;
        this.userEndorsableCertificatesCheck = false;
      });
  }

  getEndorsableCertificates() {
    return this.restService.getEndorsableCertificates(this.currentUser.allowedEndorsableTypes || [])
    .then(certificates => {
      this.endorsableCertificates = certificates;
      console.log("getEndorsableCertificates");
        console.log(this.endorsableCertificates);
        this.userCertificatesCheck = false;
        this.userEndorsableCertificatesCheck = true;
    })
  }

  calcHash(fileBlob) {
    let sha = CryptoJS.SHA256(fileBlob);
    console.log(sha.toString());
    return sha.toString();
  }

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      console.log(file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        //console.log(reader.result);
        this.uploadedCertificateHash = this.calcHash(reader.result);
        this.newCerti.certificateHash = this.uploadedCertificateHash;
      };
    } else {
      this.uploadedCertificateHash = "";
    }
  }

  verifyUploadedFile() {
    console.log(this.selectedCertificate, this.uploadedCertificateHash);
    return this.selectedCertificate && 
      this.uploadedCertificateHash &&
      this.uploadedCertificateHash == this.selectedCertificate.certificateHash;
  }

  endorse(certi) {
    document.getElementById('id01').style.display='block';
    this.selectedCertificate = certi;
  }

  showCertificate(certi) {
    document.getElementById('id02').style.display='block';
    this.selectedCertificate = certi;
  }

  checkCanEndorse(certi){
    if(!certi.endorsers) return true;
    for(let i=0; i<certi.endorsers.length; i++){
         if(certi.endorsers[i].userId==this.currentUser.userId){
           return false;
         }
    }
    return true;
  }

  closeModal(modalId) {
    let that = this;
    document.getElementById(modalId).style.display='none';
    if((<HTMLInputElement>document.getElementById("certificateFile")) != null) {
      (<HTMLInputElement>document.getElementById("certificateFile")).value = null;
    }
    if((<HTMLInputElement>document.getElementById("uploadFile")) != null) {
      (<HTMLInputElement>document.getElementById("uploadFile")).value = null;
    }
    if((<HTMLInputElement>document.getElementById("verifyFile")) != null) {
      (<HTMLInputElement>document.getElementById("verifyFile")).value = null;
    }
    this.selectedCertificate = null;
    this.uploadedCertificateHash = "";
    this.ipfsSuccess = false;
    this.newCertiInit();
    if(this.currentUser) {
      this.getCurrentUser()
        .then(function() {
          that.getUserCertificates();
          that.getEndorsableCertificates();
          that.certificateTypeList();
        });
    }
  }

  uploadFileChange(event) {
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      console.log(file);
      this.onFileChange(event);
      this.uploadFileToIPFS(file);
    }
  }

  uploadFileToIPFS(fileBlob) {
    let that = this;
    toBuffer(fileBlob, function (err, buffer) {
      if (err) throw err;
      ipfs.files.add(buffer, function (err, file) {
        if (err) {
          console.log(err);
        }
        console.log(file);
        that.newCerti.url = file[0].path;
        that.ipfsSuccess = true;
      });
    });
  }
  
  uploadCerti() {
    //this.signUpInProgress = true;
    let that = this;
    let copy = {
      ...this.newCerti
    }
    copy.holder = 'resource:org.dadas.cerver.User#'+copy.holder;
    copy.type = 'resource:org.dadas.cerver.CertificateType#'+copy.type;
    copy.uploader = 'resource:'+ this.currentUser['$class'] +'#' + this.currentUser.userId;
    console.log(copy);
    this.restService.issueCertificate(copy)
      .then(function() {
        that.closeModal('id03');
        alert("Certificate Uploaded Successfully!");
      }).catch(function() {
        alert("OOPS, Error Occured!");
      });
  }

  openUploadModal() {
    document.getElementById('id03').style.display='block';
  }

  endorseCertificate() {
    let that = this;
  return this.restService.endorseCertificate(this.selectedCertificate,this.currentUser)
    .then(function(){
      alert("Successfully Endorsed");
      that.closeModal('id01');
    }).catch(function(err){
      console.log(err);
      alert("Unable to Endorse try again");
    });
  }

  certificateTypeList(){
    let that = this;
    return this.restService.certificateTypeList()
      .then(function(data){
        if(data==null){
          alert("Ask admin to add certificate type to be able to upload");
        }
        that.certificateTypelistData = data;
        console.log(that.certificateTypelistData);
      });
  }

  openFile() {
    window.open('https://ipfs.io/ipfs/' + this.selectedCertificate.url);
  }

  openVerifyModal() {
    document.getElementById('id04').style.display='block';
  }

  verifyCerti() {
    let that = this;
    return this.restService.getCertificate(this.uploadedCertificateHash)
      .then(function(certi:any) {
        if(certi && certi.valid) {
          that.closeModal('id04');
          alert("Uploaded Certificate is valid!");          
        } else {
          alert("Uploaded Certificate is not valid!");
        }
      })
      .catch(function(err) {
        alert("Uploaded Certificate is not valid!");
      });
  }
}
