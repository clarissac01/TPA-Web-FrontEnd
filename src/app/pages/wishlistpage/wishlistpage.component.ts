import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-wishlistpage',
  templateUrl: './wishlistpage.component.html',
  styleUrls: ['./wishlistpage.component.scss']
})
export class WishlistpageComponent implements OnInit {

  user:any;
  cartcount = 0;
  input = "";
  result:any[]= [];
  games:any[] = [];
  totalprice = 0;

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.login()
    
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
          this.apollo.query<{getAllUserWishlist:any}>({
            query:gql`query getAllUserWishlist($userid:Int!){
              getAllUserWishlist(userid:$userid){
                id
                name
                banner
                price
                createdAt
              }
            }`, variables:{userid: this.user.id}
          }).subscribe(res=>{
            this.games = res.data?.getAllUserWishlist;
            for (let index = 0; index < this.games.length; index++) {
              this.totalprice += this.games[index].price;
            }
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

  detail(game:number){
    this.route.navigate(['/detail', game]);
  }

  removethis(gameid:number){
    this.apollo.mutate<{}>({
      mutation:gql`mutation removeWishlist($userid:Int!, $gameid:Int!){
        removeWishlist(userid:$userid, gameid:$gameid)
      }`, variables: {gameid: gameid, userid: this.user.id}
    }).subscribe(res=>{
      this.route.navigateByUrl("/wishlist").then(function(){
        window.location.reload();
      });
    })
  }

  continue(){
    this.route.navigateByUrl('/').then(function(){
      window.location.reload();
    });
  }

}
