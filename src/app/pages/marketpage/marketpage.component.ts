import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-marketpage',
  templateUrl: './marketpage.component.html',
  styleUrls: ['./marketpage.component.scss']
})
export class MarketpageComponent implements OnInit {

  currpage = 1;
  totalpage = 0;
  user:any;
  marketitems:any[] = []

  allitems:any[]=[]

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
          this.apollo.query<{getMarketItem:any}>({
            query:gql`query getMarketItem{
              getMarketItem{
                gameid
                itemid
                itemn
                summary
                name
              }
            }`
          }).subscribe(res=>{
            this.allitems = res.data?.getMarketItem;
            for (let index = 0; index < this.allitems.length; index++) {
              if (this.allitems.length%10==0){
                this.totalpage = this.allitems.length/10;
              }else{
                this.totalpage = Math.floor((this.allitems.length/10));
              }
            }
          })
        }
        
      })
    }else{
      this.route.navigateByUrl("/")
    }
  }

  gotomarketdetail(itemid:number){
    this.route.navigate(['/marketdetail', itemid]);
  }

  prevpage(){
    this.currpage --;
    this.initpage();
  }

  nextpage(){
    this.currpage++;
    this.initpage();
  }

  initpage(){
    this.marketitems = [];
    this.apollo.query<{paginateAllMarketItems:any}>({
      query:gql`query paginateAllMarketItems($index:Int!){
        paginateAllMarketItems(index:$index){
          gameid
          itemid
          itemn
          summary
          name
        }
      }`, variables:{index: this.currpage}
    }).subscribe(res=>{
      this.marketitems = res.data?.paginateAllMarketItems
    })
  }


}
