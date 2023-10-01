import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AgregarLibrosPage } from './pageAdmin/libros-admin/libros-admin.page';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/compat/auth-guard';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['tabs/home']);

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pageUser/home/home.module').then( m => m.HomePageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'session',
    loadChildren: () => import('./pageUser/session/session.module').then( m => m.SessionPageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: 'profile/:id',
    loadChildren: () => import('./pageUser/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pageUser/settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pageUser/tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin},
  },
  {
    path: 'libros',
    loadChildren: () => import('./pageAdmin/libros-admin/libros-admin.module').then(m => m.LibrosAdminPageModule),
  },
  {
    path: 'peticiones',
    loadChildren: () => import('./pageAdmin/peticiones-admin/peticiones-admin.module').then( m => m.PeticionesAdminPageModule),
  },
  {
    path: 'settings-admin',
    loadChildren: () => import('./pageAdmin/settings-admin/settings-admin.module').then( m => m.SettingsAdminPageModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./pageAdmin/tabs-admin/tabs-admin.module').then( m => m.TabsAdminPageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToHome},
  },
  {
    path: 'data-book/:id',
    loadChildren: () => import('./components/data-book/data-book.module').then( m => m.DataBookPageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin},
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
