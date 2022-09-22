import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/home/admin/admin.component';
import { BroadcastComponent } from './components/home/broadcast/broadcast.component';
import { CalendarDetailComponent } from './components/home/calendar/calendar-detail/calendar-detail.component';
import { CalendarComponent } from './components/home/calendar/calendar.component';
import { HomeComponent } from './components/home/home.component';
import { LogComponent } from './components/home/log/log.component';
import { ThemeComponent } from './components/home/theme/theme.component';
import { UserComponent } from './components/home/user/user.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { 
    path: 'login', 
    component: LoginComponent
  },
  { 
    path: 'home', 
    component: HomeComponent,
    // canActivateChild: [GuardService],
    children: [
      {
        path: 'admin',
        component: AdminComponent
      },
      {
        path: 'user',
        component: UserComponent
      },
      {
        path: 'theme',
        component: ThemeComponent
      },
      {
        path: 'broadcast',
        component: BroadcastComponent
      },
      {
        path: 'calendar',
        component: CalendarComponent
      },
      {
        path: 'calendar/:id',
        component: CalendarDetailComponent
      },
      {
        path: 'log',
        component: LogComponent
      },
    ]
  },
  // {
  //   path: '**',
  //   component: PageNotFoundComponent
  // }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
