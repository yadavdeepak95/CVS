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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { CertificateComponent } from './Certificate/Certificate.component';
import { CertificateTypeComponent } from './CertificateType/CertificateType.component';

import { UserComponent } from './User/User.component';
import { OrganizationComponent } from './Organization/Organization.component';

import { PublishCertificateComponent } from './PublishCertificate/PublishCertificate.component';
import { EndorseComponent } from './Endorse/Endorse.component';
import { _demoSetupComponent } from './_demoSetup/_demoSetup.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Certificate', component: CertificateComponent },
  { path: 'CertificateType', component: CertificateTypeComponent },
  { path: 'User', component: UserComponent },
  { path: 'Organization', component: OrganizationComponent },
  { path: 'PublishCertificate', component: PublishCertificateComponent },
  { path: 'Endorse', component: EndorseComponent },
  { path: '_demoSetup', component: _demoSetupComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
