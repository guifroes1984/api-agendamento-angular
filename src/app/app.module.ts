import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { routes } from 'src/app.routes';
import { authInterceptorProviders } from './interceptors/auth.interceptor';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { NotificationComponent } from './components/notification/notification.component';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    TransactionFormComponent,
    ConfirmationModalComponent,
    NotificationComponent,
    BottomNavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
