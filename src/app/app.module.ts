import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterpageComponent } from './pages/registerpage/registerpage.component';
import { LoginpageComponent } from './pages/loginpage/loginpage.component';
import { MainpageComponent } from './pages/mainpage/mainpage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { AdminpageComponent } from './pages/adminpage/adminpage.component';
import { LoginadminComponent } from './pages/loginadmin/loginadmin.component';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { ManagegameComponent } from './pages/managegame/managegame.component';
import { ManagepromoComponent } from './pages/managepromo/managepromo.component';
import { ManageuserComponent } from './pages/manageuser/manageuser.component';
import { AddgameComponent } from './pages/addgame/addgame.component';
import { UpdategameComponent } from './pages/updategame/updategame.component';
import { DeletegameComponent } from './pages/deletegame/deletegame.component';
import { AddpromoComponent } from './pages/addpromo/addpromo.component';
import { UpdatepromoComponent } from './pages/updatepromo/updatepromo.component';
import { DeletepromoComponent } from './pages/deletepromo/deletepromo.component';
import { AddpromorealComponent } from './pages/addpromoreal/addpromoreal.component';
import { SearchpageComponent } from './pages/searchpage/searchpage.component';
import { GamedetailComponent } from './pages/gamedetail/gamedetail.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterpageComponent,
    LoginpageComponent,
    MainpageComponent,
    AdminpageComponent,
    LoginadminComponent,
    HeaderComponent,
    FooterComponent,
    ManagegameComponent,
    ManagepromoComponent,
    ManageuserComponent,
    AddgameComponent,
    UpdategameComponent,
    DeletegameComponent,
    AddpromoComponent,
    UpdatepromoComponent,
    DeletepromoComponent,
    AddpromorealComponent,
    SearchpageComponent,
    GamedetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    GraphQLModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
