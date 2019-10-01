import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

const PACKAGE = 'org.dadas.cerver';
const USER_PACKAGE = PACKAGE + '.User';
const CERTIFICATE_PACKAGE = PACKAGE + '.Certificate';
const URL_S = 'http://localhost:3001/api';
const URL_M = 'http://localhost:3000/api';

@Injectable()
export class RestService {

  constructor(private httpClient: HttpClient) {
  }

  checkWallet() {
    return this.httpClient.get('http://localhost:3000/api/wallet', {withCredentials: true}).toPromise();
  }

  signUp(data) {
    const user = {
      $class: PACKAGE + '.User',
      userId: data.id,
      name: data.firstName,
    };

    return this.httpClient.post('http://localhost:3001/api/' + USER_PACKAGE, user).toPromise()
      .then(() => {
        const identity = {
          participant: USER_PACKAGE + '#' + data.id,
          userID: data.id,
          options: {}
        };

        return this.httpClient.post('http://localhost:3001/api/system/identities/issue', identity, {responseType: 'blob'}).toPromise();
      })  
      .then((cardData) => {
      console.log('CARD-DATA', cardData);
        const file = new File([cardData], 'myCard.card', {type: 'application/octet-stream', lastModified: Date.now()});

        const formData = new FormData();
        formData.append('card', file);

        const headers = new HttpHeaders();
        headers.set('Content-Type', 'multipart/form-data');
        return this.httpClient.post('http://localhost:3000/api/wallet/import', formData, {
          withCredentials: true,
          headers
        }).toPromise();
      });
  }

  getCurrentUser() {
    return this.httpClient.get('http://localhost:3000/api/system/ping', {withCredentials: true}).toPromise()
      .then((data) => {
        return data['participant'].split("#")[1];
      })
      .then(userId => {
        return this.httpClient.get('http://localhost:3000/api/org.dadas.cerver.User/'+ userId, {withCredentials: true}).toPromise()
      });
  }

  getUserCertificates(userId) {
    const filter = '?filter={"where":{"holder":"resource:' + USER_PACKAGE +'#' + userId + '"}, "include":"resolve"}';
    let url = URL_M + '/' + CERTIFICATE_PACKAGE + filter;
    url = url.replace("#", "%23");
    console.log("getUserCertificates url: " + url);
    return this.httpClient.get(url, {withCredentials: true}).toPromise();
  }

  getEndorsableCertificates(types) {
    if(!types) return null;
    let promises = [];
    types.forEach(type => {
      const filter = '?filter={"where":{"type":"'+ type +'"}, "include":"resolve"}';
      let url = URL_M + '/' + CERTIFICATE_PACKAGE + filter;
      url = url.replace("#", "%23");
      console.log("getEndorsableCertificates url: " + url);
      promises.push(this.httpClient.get(url, {withCredentials: true}).toPromise());
    });

    return Promise.all(promises)
      .then(res => {
        let certificates = [];
        res.forEach(data => {
          console.log(data);
          certificates = certificates.concat(data);
        });
        return certificates;
      });
  }
  endorseCertificate(certi,currentUser){
    let endorser = "resource:org.dadas.cerver.User#"+currentUser.userId;
    let certificate = "resource:org.dadas.cerver.Certificate#"+certi.certificateHash;
    let data = {
      "$class": "org.dadas.cerver.Endorse",
      "certificate": certificate,
      "endorser": endorser
    }
    console.log(data);
    let url = 'http://localhost:3000/api/org.dadas.cerver.Endorse';
    return this.httpClient.post(url, data,{withCredentials: true}).toPromise();

  }
  certificateTypeList(){
    let url = 'http://localhost:3000/api/org.dadas.cerver.CertificateType';
    return this.httpClient.get(url,{withCredentials:true}).toPromise();
  }

  issueCertificate(newCerti) {
    newCerti["$class"] = "org.dadas.cerver.Certificate";
    let url = 'http://localhost:3000/api/org.dadas.cerver.Certificate';
    return this.httpClient.post(url, newCerti, {withCredentials: true}).toPromise();
  }

  getCertificate(certiHash) {
    return this.httpClient.get('http://localhost:3001/api/org.dadas.cerver.Certificate/'+ certiHash).toPromise();
  }
}
