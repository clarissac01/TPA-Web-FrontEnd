import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-cartpage',
  templateUrl: './cartpage.component.html',
  styleUrls: ['./cartpage.component.scss']
})
export class CartpageComponent implements OnInit {

  cartcount = 0;
  input = "";
  result:any[]= [];
  games:any[] = [];
  totalprice = 0;

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.apollo.query<{getCart:any}>({
      query:gql`query getCart{
        getCart{
          gameid
        }
      }`
    }).subscribe(res=>{
      this.cartcount = res.data?.getCart.length;
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
    })
  }
  
  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  detail(game:number){
    this.route.navigate(['/detail', game]);
  }

  removethis(gameid:number){
    this.apollo.mutate<{}>({
      mutation:gql`mutation removeCart($gameid:Int!){
        removeCart(gameid:$gameid)
      }`, variables: {gameid: gameid}
    }).subscribe(res=>{
      this.route.navigateByUrl("/cart").then(function(){
        window.location.reload();
      });
    })
  }

  continue(){
    this.route.navigateByUrl('/').then(function(){
      window.location.reload();
    });
  }

  purchase(){
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
          }
        }`, variables: {token: jwt}
      }).subscribe(res=>{
        const user = res.data?.auth;
        if(user.id > 1){
          this.route.navigate(['/checkout', "self"])
        }
        else if(user.id == 1){
          this.route.navigateByUrl("/steamadmin")
        }
      })
    }else{
      this.route.navigateByUrl("/login")
    }
  }

  gift(){
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
          }
        }`, variables: {token: jwt}
      }).subscribe(res=>{
        const user = res.data?.auth;
        if(user.id > 1){
          this.route.navigate(['/checkout', "gift"])
        }
        else if(user.id == 1){
          this.route.navigateByUrl("/steamadmin")
        }
      })
    }else{
      this.route.navigateByUrl("/login")
    }
  }

}
