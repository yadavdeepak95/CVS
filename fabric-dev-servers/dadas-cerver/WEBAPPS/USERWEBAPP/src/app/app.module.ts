import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RestService} from '../services/rest.service';
import { FormModalComponent } from './form-modal/form-modal.component';


const appRoutes: Routes = [
  { path: '**', component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    FormModalComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [RestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
