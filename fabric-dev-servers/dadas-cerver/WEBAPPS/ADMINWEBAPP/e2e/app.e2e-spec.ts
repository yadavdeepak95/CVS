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

import { AngularTestPage } from './app.po';
import { ExpectedConditions, browser, element, by } from 'protractor';
import {} from 'jasmine';


describe('Starting tests for dadas-cerver', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be dadas-cerver', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('dadas-cerver');
    })
  });

  it('network-name should be dadas-cerver@0.0.13',() => {
    element(by.css('.network-name')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('dadas-cerver@0.0.13.bna');
    });
  });

  it('navbar-brand should be dadas-cerver',() => {
    element(by.css('.navbar-brand')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('dadas-cerver');
    });
  });

  
    it('Certificate component should be loadable',() => {
      page.navigateTo('/Certificate');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Certificate');
      });
    });

    it('Certificate table should have 10 columns',() => {
      page.navigateTo('/Certificate');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(10); // Addition of 1 for 'Action' column
      });
    });
  
    it('CertificateType component should be loadable',() => {
      page.navigateTo('/CertificateType');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('CertificateType');
      });
    });

    it('CertificateType table should have 5 columns',() => {
      page.navigateTo('/CertificateType');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('User component should be loadable',() => {
      page.navigateTo('/User');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('User');
      });
    });

    it('User table should have 5 columns',() => {
      page.navigateTo('/User');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });
  
    it('Organization component should be loadable',() => {
      page.navigateTo('/Organization');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Organization');
      });
    });

    it('Organization table should have 3 columns',() => {
      page.navigateTo('/Organization');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(3); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('PublishCertificate component should be loadable',() => {
      page.navigateTo('/PublishCertificate');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('PublishCertificate');
      });
    });
  
    it('Endorse component should be loadable',() => {
      page.navigateTo('/Endorse');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Endorse');
      });
    });
  
    it('_demoSetup component should be loadable',() => {
      page.navigateTo('/_demoSetup');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('_demoSetup');
      });
    });
  

});