import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-checkoutpage',
  templateUrl: './checkoutpage.component.html',
  styleUrls: ['./checkoutpage.component.scss']
})
export class CheckoutpageComponent implements OnInit {

  show = true;
  paymentform = false;
  games:any[] = [];
  totalprice = 0;
  user:any;
  method = "";
  friendlist:any[]= [];
  frienddetail:any[]= [];
  friendid = 0;
  friendform = false;
  showfriend = false;
  friendidx = 0;

  notenoughwallet = false;
  message = "";

  paymentForm = this.fb.group({
    method: ['', Validators.required],
    cardnumber: ['', Validators.required],
    expdate: ['', Validators.required],
    fullname : ['', Validators.required],
    city: ['', Validators.required],
    bill: ['', Validators.required],
    postcode: ['', Validators.required],
    bill2: ['', Validators.required],
    country: ['', Validators.required],
    phone: ['', Validators.required]
  });

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.login();
    this.router.params.subscribe(params=>{
      this.method = params['purchase'];
    })
    
    this.apollo.query<{getallgamefromcart:any}>({
      query:gql`query getallgamefromcart{
        getallgamefromcart{
          id
          name
          banner
          price
          createdAt
        }
      }`
    }).subscribe(res=>{
      this.games = res.data?.getallgamefromcart;
      for (let index = 0; index < this.games.length; index++) {
        this.totalprice += this.games[index].price;
      }
      if(this.user.balance < this.totalprice){
        this.notenoughwallet = true;
      }
    })
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
        }
        if(this.method=="gift"){
          this.apollo.query<{getUserFriends:any}>({
            query:gql`query getUserFriends($userid:Int!){
              getUserFriends(userid:$userid){
                id
                username
                fullname
              }
            }`, variables:{userid: this.user.id}
          }).subscribe(res=>{
            this.friendlist = res.data?.getUserFriends;
            this.showfriend = true;
            console.log("User Friend: "+this.friendlist.length)
            console.log("Username : "+ this.friendlist[0].username)
          })
          this.apollo.query<{getUserFriendProfiles:any}>({
            query:gql`query getUserFriendProfiles($userId:Int!){
              getUserFriendProfiles(userId:$userId){
                userid
                image
              }
            }`, variables:{userId: this.user.id}
          }).subscribe(res=>{
            this.frienddetail = res.data?.getUserFriendProfiles;
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

  buy(){
    if(this.method=="self"){
      for (let index = 0; index < this.games.length; index++) {
        this.apollo.mutate<{buyGameWallet:string}>({
          mutation:gql`mutation buyGameWallet($gameid: Int!, $userId:Int!, $price:Int!){
            buyGameWallet(gameid: $gameid, userId:$userId, price:$price)
          }`, variables:{gameid: this.games[index].id,userid: this.user.id, price: this.games[index].price}
        }).subscribe(res=>{
          if(index == this.games.length -1){
            this.route.navigateByUrl('/').then(function(){
              window.location.reload();
            })
          }    
        })
      }
    }else{
      for (let index = 0; index < this.games.length; index++) {
        this.apollo.mutate<{giftfriendWallet:any}>({
          mutation:gql`mutation giftfriendWallet($gameid:Int!, $senderid:Int!, $receiverid:Int!, $price:Int!, $message:String){
            giftfriendWallet(gameid:$gameid, senderid:$senderid, receiverid:$receiverid, price:$price, message:$message)
          }`, variables: {gameid: this.games[index].id, senderid: this.user.id, receiverid: this.friendid, message: this.message, price: this.games[index].price}
        }).subscribe(res=>{
          if(index == this.games.length -1){
            this.route.navigateByUrl('/').then(function(){
              window.location.reload();
            })
          }    
        })
      }
    }
  }

  changepayment(){
    if(this.method=="self"){
      this.show = false;
      this.paymentform = true;
    }else{
      this.paymentform = true;
      this.show = false;
      this.friendform = false;
      this.showfriend = false;
    }
  }

  notWallet(){
    console.log("masuk")
    if(this.method == "self"){
      console.log("masuk2")
      for (let index = 0; index < this.games.length; index++) {
        this.apollo.mutate<{buyGameNotWallet:string}>({
          mutation:gql`mutation buyGameNotWallet($gameid: Int!, $userid:Int!){
            buyGameNotWallet(gameid: $gameid, userid:$userid)
          }`, variables:{gameid: this.games[index].id,userid: this.user.id}
        }).subscribe(res=>{
          if(index == this.games.length -1){
            this.route.navigateByUrl('/').then(function(){
              window.location.reload();
            })
          }    
        })
      }
    }
    if(this.method == "gift"){
      for (let index = 0; index < this.games.length; index++) {
        this.apollo.mutate<{}>({
          mutation:gql`mutation giftfriendNotWallet($gameid:Int!, $senderid:Int!, $receiverid:Int!, $message:String){
            giftfriendNotWallet(gameid:$gameid, senderid:$senderid, receiverid:$receiverid, message:$message)
          }`, variables: {gameid: this.games[index].id, senderid: this.user.id, receiverid: this.friendid, message: this.message}
        }).subscribe(res=>{
          if(index == this.games.length -1){
            this.route.navigateByUrl('/').then(function(){
              window.location.reload();
            })
          }    
        })
      }
    }
      
  }

  giftfriend(friendid: number, idx:number){
    this.friendid = friendid;
    this.friendform = true;
    this.friendidx = idx;
  }

  topup(){
    this.route.navigateByUrl('/topupwallet')
  }

}
