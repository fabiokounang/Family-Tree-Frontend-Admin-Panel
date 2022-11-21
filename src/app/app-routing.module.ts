import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BannerComponent } from './components/home/banner/banner.component';
import { BulletinComponent } from './components/home/bulletin/bulletin.component';
import { AdminComponent } from './components/home/admin/admin.component';
import { BroadcastComponent } from './components/home/broadcast/broadcast.component';
import { CalendarDetailComponent } from './components/home/calendar/calendar-detail/calendar-detail.component';
import { CalendarComponent } from './components/home/calendar/calendar.component';
import { EventComponent } from './components/home/event/event.component';
import { HomeComponent } from './components/home/home.component';
import { LogComponent } from './components/home/log/log.component';
import { PointComponent } from './components/home/point/point.component';
import { CityComponent } from './components/home/province/city/city.component';
import { ProvinceComponent } from './components/home/province/province.component';
import { TestComponent } from './components/home/test/test.component';
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
        path: 'banner',
        component: BannerComponent
      },
      {
        path: 'bulletin',
        component: BulletinComponent
      },
      {
        path: 'event',
        component: EventComponent
      },
      {
        path: 'point',
        component: PointComponent
      },
      {
        path: 'event/:id',
        component: TestComponent
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
      {
        path: 'province',
        component: ProvinceComponent
      },
      {
        path: 'province/:id/:name/:code',
        component: CityComponent
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
