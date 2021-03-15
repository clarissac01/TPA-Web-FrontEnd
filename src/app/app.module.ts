import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from '@angular/core';
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
import { NgxCaptchaModule } from 'ngx-captcha';
import { SearchpageGenreComponent } from './pages/searchpage-genre/searchpage-genre.component';
import { CartpageComponent } from './pages/cartpage/cartpage.component';
import { CheckoutpageComponent } from './pages/checkoutpage/checkoutpage.component';
import { CommunitypageComponent } from './pages/communitypage/communitypage.component';
import { ProfilepageComponent } from './pages/profilepage/profilepage.component';
import { EditprofilepageComponent } from './pages/editprofilepage/editprofilepage.component';
import { InventorypageComponent } from './pages/inventorypage/inventorypage.component';
import { FriendpageComponent } from './pages/friendpage/friendpage.component';
import { BadgespageComponent } from './pages/badgespage/badgespage.component';
import { WishlistpageComponent } from './pages/wishlistpage/wishlistpage.component';
import { MarketpageComponent } from './pages/marketpage/marketpage.component';
import { MarketdetailpageComponent } from './pages/marketdetailpage/marketdetailpage.component';
import { PointpageComponent } from './pages/pointpage/pointpage.component';
import { TopuppageComponent } from './pages/topuppage/topuppage.component';
import { AlluserComponent } from './pages/alluser/alluser.component';
import { ReportlistComponent } from './pages/reportlist/reportlist.component';
import { UnsuspensionrequestComponent } from './pages/unsuspensionrequest/unsuspensionrequest.component';
import { ChartsModule } from 'ng2-charts';
import { ChatpageComponent } from './pages/chatpage/chatpage.component';
import { ChatComponent } from './pages/chat/chat.component';
import { NewreleasesComponent } from './pages/newreleases/newreleases.component';
import { RecommendationsComponent } from './pages/recommendations/recommendations.component';
import {
  MAPBOX_API_KEY, // ngx-mapbox-gl uses this injection token to provide the accessToken
  NgxMapboxGLModule,
} from 'ngx-mapbox-gl';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';

export interface IMyLibMapModuleConfig {
  mapboxToken: string;
}

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
    SearchpageGenreComponent,
    CartpageComponent,
    CheckoutpageComponent,
    CommunitypageComponent,
    ProfilepageComponent,
    EditprofilepageComponent,
    InventorypageComponent,
    FriendpageComponent,
    BadgespageComponent,
    WishlistpageComponent,
    MarketpageComponent,
    MarketdetailpageComponent,
    PointpageComponent,
    TopuppageComponent,
    AlluserComponent,
    ReportlistComponent,
    UnsuspensionrequestComponent,
    ChatpageComponent,
    ChatComponent,
    NewreleasesComponent,
    RecommendationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    GraphQLModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    ChartsModule,
    CommonModule, 
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoiY2xhcmlzc2EwMSIsImEiOiJja21hNWc4MHMxb2JyMnVvNXF6emk1MWpoIn0.xsDMItTrXYBVu77tSQ3Qsg', // Optional, can also be set per map (accessToken input of mgl-map)
      geocoderAccessToken: 'pk.eyJ1IjoiY2xhcmlzc2EwMSIsImEiOiJja21hNWc4MHMxb2JyMnVvNXF6emk1MWpoIn0.xsDMItTrXYBVu77tSQ3Qsg' // Optional, specify if different from the map access token, can also be set per mgl-geocoder (accessToken input of mgl-geocoder)
    }), ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

export class MyLibMapModule {
  static forRoot(
    config: IMyLibMapModuleConfig
  ): ModuleWithProviders<MyLibMapModule> {
    return {
      ngModule: MyLibMapModule,
      providers: [
        {
          provide: MAPBOX_API_KEY,
          useValue: config.mapboxToken,
        },
      ],
    };
  }
}