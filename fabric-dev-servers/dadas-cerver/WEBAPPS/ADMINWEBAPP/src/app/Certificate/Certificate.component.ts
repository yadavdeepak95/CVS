/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CertificateService } from './Certificate.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-certificate',
  templateUrl: './Certificate.component.html',
  styleUrls: ['./Certificate.component.css'],
  providers: [CertificateService]
})
export class CertificateComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  certificateHash = new FormControl('', Validators.required);
  description = new FormControl('', Validators.required);
  url = new FormControl('', Validators.required);
  valid = new FormControl('', Validators.required);
  type = new FormControl('', Validators.required);
  issuer = new FormControl('', Validators.required);
  holder = new FormControl('', Validators.required);
  uploader = new FormControl('', Validators.required);
  endorsers = new FormControl('', Validators.required);

  constructor(public serviceCertificate: CertificateService, fb: FormBuilder) {
    this.myForm = fb.group({
      certificateHash: this.certificateHash,
      description: this.description,
      url: this.url,
      valid: this.valid,
      type: this.type,
      issuer: this.issuer,
      holder: this.holder,
      uploader: this.uploader,
      endorsers: this.endorsers
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceCertificate.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.dadas.cerver.Certificate',
      'certificateHash': this.certificateHash.value,
      'description': this.description.value,
      'url': this.url.value,
      'valid': this.valid.value,
      'type': this.type.value,
      'issuer': this.issuer.value,
      'holder': this.holder.value,
      'uploader': this.uploader.value,
      'endorsers': this.endorsers.value
    };

    this.myForm.setValue({
      'certificateHash': null,
      'description': null,
      'url': null,
      'valid': null,
      'type': null,
      'issuer': null,
      'holder': null,
      'uploader': null,
      'endorsers': null
    });

    return this.serviceCertificate.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'certificateHash': null,
        'description': null,
        'url': null,
        'valid': null,
        'type': null,
        'issuer': null,
        'holder': null,
        'uploader': null,
        'endorsers': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.dadas.cerver.Certificate',
      'description': this.description.value,
      'url': this.url.value,
      'valid': this.valid.value,
      'type': this.type.value,
      'issuer': this.issuer.value,
      'holder': this.holder.value,
      'uploader': this.uploader.value,
      'endorsers': this.endorsers.value
    };

    return this.serviceCertificate.updateAsset(form.get('certificateHash').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceCertificate.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceCertificate.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'certificateHash': null,
        'description': null,
        'url': null,
        'valid': null,
        'type': null,
        'issuer': null,
        'holder': null,
        'uploader': null,
        'endorsers': null
      };

      if (result.certificateHash) {
        formObject.certificateHash = result.certificateHash;
      } else {
        formObject.certificateHash = null;
      }

      if (result.description) {
        formObject.description = result.description;
      } else {
        formObject.description = null;
      }

      if (result.url) {
        formObject.url = result.url;
      } else {
        formObject.url = null;
      }

      if (result.valid) {
        formObject.valid = result.valid;
      } else {
        formObject.valid = null;
      }

      if (result.type) {
        formObject.type = result.type;
      } else {
        formObject.type = null;
      }

      if (result.issuer) {
        formObject.issuer = result.issuer;
      } else {
        formObject.issuer = null;
      }

      if (result.holder) {
        formObject.holder = result.holder;
      } else {
        formObject.holder = null;
      }

      if (result.uploader) {
        formObject.uploader = result.uploader;
      } else {
        formObject.uploader = null;
      }

      if (result.endorsers) {
        formObject.endorsers = result.endorsers;
      } else {
        formObject.endorsers = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'certificateHash': null,
      'description': null,
      'url': null,
      'valid': null,
      'type': null,
      'issuer': null,
      'holder': null,
      'uploader': null,
      'endorsers': null
      });
  }

}
