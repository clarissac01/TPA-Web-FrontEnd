import { ThisReceiver } from '@angular/compiler';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit{

  constructor(private apollo:Apollo, private router:Router, private sanitizer:DomSanitizer) { }
  
  fandr:any[] = [];
  fandrindex = 0;
  fandrid = 0;

  offer:any[] = [];
  offerindex = 0;
  offerid = 0;

  input = "";

  result:any[] = [];

  keyword = "";

  ngOnInit(): void {
    var userid = null;
    if(localStorage.getItem("jwt")){
      userid = localStorage.getItem("jwt");
    }
    this.initfandr();
    this.autoNext();
    // this.initoffer();
    // this.autoNext2();
  } 
 
  fandrprev(){
    if(this.fandrindex==0){
      this.fandrindex = this.fandr.length - 1;
    }
    else{
      this.fandrindex--;
    }
    this.fandrid = this.fandr[this.fandrindex].banner;
    this.getFile(this.fandrid);
  }

  fandrnext(){
    if(this.fandrindex==(this.fandr.length -1)){
      this.fandrindex = 0;
    }
    else{
      this.fandrindex++;
    }
    this.fandrid = this.fandr[this.fandrindex].banner;
    this.getFile(this.fandrid);
  }

  fandrcurr(idx:number){
    this.fandrindex = idx;
    this.fandrid = this.fandr[this.fandrindex].banner;
    this.getFile(this.fandrid);
  }

  autoNext(){
    setInterval(() => this.fandrnext(), 2000);
  }

  initfandr(){
    console.log("masuk");
    this.apollo.query<{fandr:any}>({
      query:gql`query fandr{
        fandr{
          id
          banner
        }
      }`
    }).subscribe(res=>{
      this.fandr = res.data?.fandr;
      console.log(this.fandr.length)
      this.fandrid = this.fandr[this.fandrindex].banner;
    })
  }
  
  offerprev(){
    if(this.offerindex==0){
      this.offerindex = this.offer.length - 1;
    }
    else{
      this.offerindex--;
    }
    this.offerid = this.offer[this.offerindex].banner;
    this.getFile(this.offerid);
  }

  offernext(){
    if(this.offerindex==(this.offer.length -1)){
      this.offerindex = 0;
    }
    else{
      this.offerindex++;
    }
    this.offerid = this.offer[this.offerindex].banner;
    this.getFile(this.offerid);
  }

  offercurr(idx:number){
    this.offerindex = idx;
    this.offerid = this.offer[this.offerindex].banner;
    this.getFile(this.offerid);
  }

  // autoNext2(){
  //   setInterval(() => this.offernext(), 2000);
  // }

  initoffer(){
    console.log("masuk");
    this.apollo.query<{specialOffer:any}>({
      query:gql`query specialOffer{
        specialOffer{
          id
          name
          price
          banner
        }
      }`
    }).subscribe(res=>{
      this.offer = res.data?.specialOffer;
      console.log(this.offer.length)
      this.offerid = this.offer[this.offerindex].banner;
    })
  }

  parseTokenToUserId(token: string): number {
    const encodedPayload = token.split('.')[1];
    const decodedPayload = atob(encodedPayload);
    const payload = JSON.parse(decodedPayload);

    return payload.userId;
  }

  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  inputGiven(e: EventTarget | null){
    // const input = e as HTMLInputElement;
    console.log(this.input);
    if(this.input != ""){
      this.apollo.query<{searchGame:any}>({
        query:gql`query searchGame($keyword:String!){
          searchGame(keyword:$keyword){
            id
            name
            banner
            price
          }
        }`, variables: {keyword: this.input}
      }).subscribe(res=>{
        this.result = res.data?.searchGame
        // console.log(res.data?.searchGame.name);
        console.log(this.result.length);
      })
    }else{
      this.result = [];
      console.log(this.result.length);
    }
  }

  searchthis(){
    this.router.navigate(["/search", this.keyword]);
  }

  detail(id:number){
    this.router.navigate(["/gamedetail", id]);
  }

}