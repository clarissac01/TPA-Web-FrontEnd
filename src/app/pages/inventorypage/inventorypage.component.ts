import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-inventorypage',
  templateUrl: './inventorypage.component.html',
  styleUrls: ['./inventorypage.component.scss']
})
export class InventorypageComponent implements OnInit {

  user:any;
  game:any[] = [];
  useritems:any[] = [];

  currpage = 1;
  totalpage = 0;

  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Price'}
  ];

  lineChartLabels: Label[] = [];

  itemtransaction:any[] = []
  showfocus = false;
  showmodal = false;
  focusid = 0;
  modalitemid = 0;
  price = 0;

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.login();
    this.initpage();
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
          this.apollo.query<{getUserItem:any}>({
            query:gql`query getUserItem($userid:Int!){
              getUserItem(userid:$userid){
                gameid
                itemid
                itemn
                summary
                name
              }
            }`, variables: {userid: this.user.id}
          }).subscribe(res=>{
            this.useritems = res.data?.getUserItem;
            for (let index = 0; index < this.useritems.length; index++) {
              if (this.useritems.length%10==0){
                this.totalpage = this.useritems.length/10;
              }else{
                this.totalpage = Math.floor((this.useritems.length/10));
              }
            }
          })
          this.apollo.query<{getItemGameName:any}>({
            query:gql`query getItemGameName($userid:Int!){
              getItemGameName(userid:$userid){
                id
                name
                banner
              }
            }`, variables: {userid: this.user.id}
          }).subscribe(res=>{
            this.game = res.data?.getItemGameName;
          })
        }
        
      })
    }else{
      this.route.navigateByUrl("/")
    }
  }

  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  focus(itemid:number){
    if(this.showfocus==true){
      this.showfocus = false;
      this.focusid = 0;
    }else{
      this.showfocus = true
      this.focusid = itemid
    }
  }

  showsellmodal(itemid:number){
    this.showmodal = true;
    this.modalitemid = itemid;
    this.apollo.query<{getItemSalesTransaction:any}>({
      query:gql`query getItemSalesTransaction($itemid:Int!){
        getItemSalesTransaction(itemid:$itemid){
          sellerid
          buyerid
          price
          itemid
          createdAt
        }
      }`, variables: {itemid: this.useritems[this.modalitemid].itemid}
    }).subscribe(res=>{
      this.itemtransaction = res.data?.getItemSalesTransaction
      this.itemtransaction.forEach(tr=>{
        this.lineChartData[0].data?.push(tr.price);
        this.lineChartLabels.push(tr.createdAt);
      })
    })
  }

  cancel(){
    this.showmodal = false;
    this.modalitemid = 0;
  }

  sell(){
    this.apollo.mutate<{sellItem:string}>({
      mutation:gql`mutation sellItem($userid:Int!, $itemid:Int!, $price:Int!){
        sellItem(userid:$userid, itemid:$itemid, price:$price)
      }`, variables: {userid: this.user.id, itemid: this.useritems[this.modalitemid].itemid, price: this.price}
    }).subscribe(res=>{
      this.route.navigateByUrl('/inventory').then(res=>{
        window.location.reload()
      })
    })
  }

  initpage(){
    this.useritems = [];
    this.apollo.query<{paginateUserInventory:any}>({
      query:gql`query paginateUserInventory($userid:Int!, $itemid:Int!){
        paginateUserInventory(userid:$userid, itemid:$itemid){
          gameid
          itemid
          itemn
          summary
          name
        }
      }`, variables:{index: this.currpage}
    }).subscribe(res=>{
      this.useritems = res.data?.paginateUserInventory
    })
  }

  prevpage(){
    this.currpage --;
    this.initpage();
  }

  nextpage(){
    this.currpage++;
    this.initpage();
  }


}
