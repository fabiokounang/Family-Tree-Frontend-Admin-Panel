import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/home/admin/admin.component';
import { UserComponent } from './components/home/user/user.component';
import { CalendarComponent } from './components/home/calendar/calendar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth-interceptor';
import { ProgressBarComponent } from './helper/progress-bar/progress-bar.component';
import { SpinnerComponent } from './helper/spinner/spinner.component';
import { NoDataDisplayComponent } from './helper/no-data-display/no-data-display.component';
import { CalendarDetailComponent } from './components/home/calendar/calendar-detail/calendar-detail.component';
import { FormEventCalendarComponent } from './dialog/form-event-calendar/form-event-calendar.component';
import { WeekendDirective } from './directives/weekend.directive';
import { FormAddAdminComponent } from './dialog/form-add-admin/form-add-admin.component';
import { FormEditAdminComponent } from './dialog/form-edit-admin/form-edit-admin.component';
import { FormChangePasswordAdminComponent } from './dialog/form-change-password-admin/form-change-password-admin.component';
import { FormConfirmationComponent } from './dialog/form-confirmation/form-confirmation.component';
import { BroadcastComponent } from './components/home/broadcast/broadcast.component';
import { ProvinceComponent } from './components/home/province/province.component';
import { CityComponent } from './components/home/province/city/city.component';
import { DetailUserComponent } from './dialog/detail-user/detail-user.component';
import { ThemeComponent } from './components/home/theme/theme.component';
import { FormEditThemeComponent } from './dialog/form-edit-theme/form-edit-theme.component';
import { FormAddThemeComponent } from './dialog/form-add-theme/form-add-theme.component';
import { LogComponent } from './components/home/log/log.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AdminComponent,
    UserComponent,
    CalendarComponent,
    NoDataDisplayComponent,
    ProgressBarComponent,
    SpinnerComponent,
    CalendarDetailComponent,
    FormEventCalendarComponent,
    WeekendDirective,
    FormAddAdminComponent,
    FormEditAdminComponent,
    FormChangePasswordAdminComponent,
    FormConfirmationComponent,
    BroadcastComponent,
    ProvinceComponent,
    CityComponent,
    DetailUserComponent,
    ThemeComponent,
    FormEditThemeComponent,
    FormAddThemeComponent,
    LogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
