import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-marketdetailpage',
  templateUrl: './marketdetailpage.component.html',
  styleUrls: ['./marketdetailpage.component.scss']
})
export class MarketdetailpageComponent implements OnInit {

  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Price'}
  ];

  lineChartLabels: Label[] = [];

  user:any;
  item:any;
  game:any;
  itemtransaction:any[] = []
  saleslisting:any[] = []
  bidlisting:any[] = []
  usersaleslisting:any[] = []
  userbidlisting:any[] = []
  salesinamonth:any[] = [];

  buyprice = 0;
  itemid = 0;
  sellprice = 0;

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.router.params.subscribe(params => {
      this.itemid = params['itemid'];
    });
    this.login();
  }

  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  login(){
    const jwt = localStorage.getItem('jwt');
    if(jwt){
      this.apollo.query<{auth:any}>({
        query:gql`query getUser($token:String!){
          auth(token:$token){
            id,
            fullname,
            username,
            isSuspended,
            country
            balance
          }
        }`, variables: {token: jwt}
      }).subscribe(res=>{
        this.user = res.data?.auth;
        if(this.user.id == 1){
          this.route.navigateByUrl("/steamadmin")
        }else{
          this.apollo.query<{getMarketDetailItem:any}>({
            query:gql`query getMarketDetailItem($itemid:Int!){
              getMarketDetailItem(itemid:$itemid){
                gameid
                itemid
                itemn
                summary
                name
              }
            }`, variables:{itemid: this.itemid}
          }).subscribe(res=>{
            this.item = res.data?.getMarketDetailItem;
            this.apollo.query<{getGame:any}>({
              query:gql`query getGame($id: Int!) {
                getGame(id: $id) {
                  name
                  price
                  banner
                  matureContent
                }
              }`, variables: {id: this.item.gameid}
            }).subscribe(res=>{
              this.game = res.data?.getGame;
            })
            this.apollo.query<{getItemSalesTransaction:any}>({
              query:gql`query getItemSalesTransaction($itemid:Int!){
                getItemSalesTransaction(itemid:$itemid){
                  sellerid
                  buyerid
                  price
                  itemid
                  createdAt
                }
              }`,variables:{itemid: this.item.itemid}
            }).subscribe(res=>{
              this.itemtransaction = res.data?.getItemSalesTransaction
              this.itemtransaction.forEach(tr=>{
                this.lineChartData[0].data?.push(tr.price);
                this.lineChartLabels.push(tr.createdAt);
              })
            })
            this.apollo.watchQuery<{salesListing:any}>({
              query:gql`query salesListing($itemid:Int!, $userid:Int!){
                salesListing(itemid:$itemid, userid:$userid){
                  sellerid
                  itemid
                  gameid
                  price
                  type
                }
              }`, variables:{itemid: this.item.itemid, userid: this.user.id}, pollInterval:5000
            }).valueChanges.subscribe(res=>{
              this.saleslisting = res.data?.salesListing;
              console.log(this.saleslisting);
            })
            this.apollo.watchQuery<{bidListing:any}>({
              query:gql`query bidListing($itemid:Int!, $userid:Int!){
                bidListing(itemid:$itemid, userid:$userid){
                  sellerid
                  itemid
                  gameid
                  price
                  type
                }
              }`, variables: {itemid: this.item.itemid, userid: this.user.id}, pollInterval:5000
            }).valueChanges.subscribe(res=>{
              this.bidlisting = res.data?.bidListing;
            })
            this.apollo.watchQuery<{usersalesListing:any}>({
              query:gql`query usersalesListing($itemid:Int!, $userid:Int!){
                usersalesListing(itemid:$itemid, userid:$userid){
                  sellerid
                  itemid
                  gameid
                  price
                  type
                }
              }`, variables:{itemid: this.item.itemid, userid: this.user.id}, pollInterval:5000
            }).valueChanges.subscribe(res=>{
              this.usersaleslisting = res.data?.usersalesListing;
              console.log("sales listing"+this.usersaleslisting);
            })
            this.apollo.watchQuery<{userbidListing:any}>({
              query:gql`query userbidListing($itemid:Int!, $userid:Int!){
                userbidListing(itemid:$itemid, userid:$userid){
                  sellerid
                  itemid
                  gameid
                  price
                  type
                }
              }`, variables: {itemid:this.item.itemid, userid: this.user.id}, pollInterval:5000
            }).valueChanges.subscribe(res=>{
              this.userbidlisting = res.data?.userbidListing
              console.log("User bid:"+this.userbidlisting)
            })
            this.apollo.query<{itemsalesinamonth:any}>({
              query:gql`query itemsalesinamonth($itemid:Int!){
                itemsalesinamonth(itemid:$itemid){
                  sellerid
                  buyerid
                  price
                  itemid
                  createdAt
                }
              }`, variables:{itemid: this.item.itemid}
            }).subscribe(res=>{
              this.salesinamonth = res.data?.itemsalesinamonth
            })
          })
        }
        
      })
    }else{
      this.route.navigateByUrl("/")
    }
  }

  buy(){
    this.apollo.mutate<{buyfromMarketDetail:string}>({
      mutation:gql`mutation buyfromMarketDetail($sellerid:Int!, $userid:Int!, $price:Int!, $itemid:Int!){
        buyfromMarketDetail(sellerid:$sellerid, userid:$userid, price:$price, itemid:$itemid)
      }`, variables:{userid: this.user.id, sellerid: 0, price: this.buyprice, itemid: this.itemid}
    }).subscribe(res=>{
      this.route.navigate(['/marketdetail', this.itemid]).then(function(){
        window.location.reload()
      })
    })
  }

  sell(){ 
    this.apollo.mutate<{sellfromMarketDetail:string}>({
      mutation:gql`mutation sellfromMarketDetail($sellerid:Int!, $userid:Int!, $price:Int!, $itemid:Int!){
        sellfromMarketDetail(sellerid:$sellerid, userid:$userid, price:$price, itemid:$itemid)
      }`, variables:{sellerid: this.user.id, userid: this.user.id, price: this.sellprice, itemid: this.itemid}
    }).subscribe(res=>{
      this.route.navigate(['/marketdetail', this.itemid]).then(function(){
        window.location.reload()
      })
    })
  }

}
