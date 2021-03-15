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
import { CartpageComponent } from './pages/cartpage/cartpage.component';
import { CheckoutpageComponent } from './pages/checkoutpage/checkoutpage.component';
import { CommunitypageComponent } from './pages/communitypage/communitypage.component';
import { ProfilepageComponent } from './pages/profilepage/profilepage.component';
import { EditprofilepageComponent } from './pages/editprofilepage/editprofilepage.component';
import { TopuppageComponent } from './pages/topuppage/topuppage.component';
import { PointpageComponent } from './pages/pointpage/pointpage.component';
import { WishlistpageComponent } from './pages/wishlistpage/wishlistpage.component';
import { FriendpageComponent } from './pages/friendpage/friendpage.component';
import { BadgespageComponent } from './pages/badgespage/badgespage.component';
import { AlluserComponent } from './pages/alluser/alluser.component';
import { ReportlistComponent } from './pages/reportlist/reportlist.component';
import { UnsuspensionrequestComponent } from './pages/unsuspensionrequest/unsuspensionrequest.component';
import { InventorypageComponent } from './pages/inventorypage/inventorypage.component';
import { MarketpageComponent } from './pages/marketpage/marketpage.component';
import { MarketdetailpageComponent } from './pages/marketdetailpage/marketdetailpage.component';
import { ChatpageComponent } from './pages/chatpage/chatpage.component';
import { ChatComponent } from './pages/chat/chat.component';
import { NewreleasesComponent } from './pages/newreleases/newreleases.component';
import { RecommendationsComponent } from './pages/recommendations/recommendations.component';

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
    path: 'manageuser',
    component: ManageuserComponent,
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
  },
  {
    path: 'genre/:genre',
    component: GamedetailComponent,
  },
  {
    path: 'cart',
    component: CartpageComponent,
  },
  {
    path: 'checkout/:purchase',
    component: CheckoutpageComponent,
  },
  {
    path: 'community',
    component: CommunitypageComponent,
  },
  {
    path: 'myprofile',
    component: ProfilepageComponent,
  },
  {
    path: 'editprofile',
    component: EditprofilepageComponent,
  },
  {
    path: 'topupwallet',
    component: TopuppageComponent,
  },
  {
    path: 'pointshop',
    component: PointpageComponent,
  },
  {
    path: 'wishlist',
    component: WishlistpageComponent,
  },
  {
    path: 'friends',
    component: FriendpageComponent,
  },
  {
    path: 'badges',
    component: BadgespageComponent,
  },
  {
    path: 'alluser',
    component: AlluserComponent,
  },
  {
    path: 'reportlist',
    component: ReportlistComponent,
  },
  {
    path: 'unsuspensionrequest',
    component: UnsuspensionrequestComponent,
  },
  {
    path: 'inventory',
    component: InventorypageComponent,
  },
  {
    path: 'market',
    component: MarketpageComponent,
  },
  {
    path: 'marketdetail/:itemid',
    component: MarketdetailpageComponent,
  },
  {
    path: 'chatpage',
    component: ChatpageComponent,
  },
  {
    path: 'chat/:friendid',
    component: ChatComponent,
  },
  {
    path: 'newreleases',
    component: NewreleasesComponent
  },
  {
    path: 'recommendations',
    component: RecommendationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
