import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginpageComponent } from './pages/loginpage/loginpage.component';
import { MainpageComponent } from './pages/mainpage/mainpage.component';
import { RegisterpageComponent } from './pages/registerpage/registerpage.component';
import { AdminpageComponent } from './pages/adminpage/adminpage.component';
import { LoginadminComponent } from './pages/loginadmin/loginadmin.component';
import { ManagegameComponent } from './pages/managegame/managegame.component';
import { ManagepromoComponent } from './pages/managepromo/managepromo.component';
import { ManageuserComponent } from './pages/manageuser/manageuser.component';
import { AddgameComponent } from './pages/addgame/addgame.component';
import { UpdategameComponent } from './pages/updategame/updategame.component';
import { DeletegameComponent } from './pages/deletegame/deletegame.component';
import { AddpromoComponent } from './pages/addpromo/addpromo.component';
import { AddpromorealComponent } from './pages/addpromoreal/addpromoreal.component';
import { UpdatepromoComponent } from './pages/updatepromo/updatepromo.component';
import { DeletepromoComponent } from './pages/deletepromo/deletepromo.component';
import { SearchpageComponent } from './pages/searchpage/searchpage.component';
import { GamedetailComponent } from './pages/gamedetail/gamedetail.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginpageComponent,
  },
  {
    path: 'register',
    component: RegisterpageComponent,
  },
  {
    path: '',
    component: MainpageComponent,
  },
  {
    path: 'steamadmin',
    component: LoginadminComponent,
  },
  {
    path: 'adminpage',
    component: AdminpageComponent,
  },
  {
    path: 'managegame',
    component: ManagegameComponent,
  },
  {
    path: 'managepromo',
    component: ManagepromoComponent,
  },
  {
    path: 'addpromopage',
    component: AddpromoComponent,
  },
  {
    path: 'addpromo/:id',
    component: AddpromorealComponent,
  },
  {
    path: 'updatepromo/:id',
    component: UpdatepromoComponent,
  },
  {
    path: 'deletepromo/:id',
    component: DeletepromoComponent,
  },
  {
    path: 'manageuser',
    component: ManageuserComponent,
  },
  {
    path: 'addgame',
    component: AddgameComponent,
  },
  {
    path: 'updategame/:id',
    component: UpdategameComponent,
  }, 
  {
    path: 'deletegame/:id',
    component: DeletegameComponent,
  },
  {
    path: 'search/:keyword',
    component: SearchpageComponent,
  },
  {
    path: 'gamedetail/:id',
    component: GamedetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
