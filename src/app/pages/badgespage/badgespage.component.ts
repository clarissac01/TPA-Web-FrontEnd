import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-badgespage',
  templateUrl: './badgespage.component.html',
  styleUrls: ['./badgespage.component.scss']
})
export class BadgespageComponent implements OnInit {

  user:any;
  gamenames:any[] = [];

  userbadges:any[] = []
  allbadges:any[] = []

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.login();
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
          this.apollo.query<{getUserBadges:any}>({
            query:gql`query getUserBadges($userid:Int!){
              getUserBadges(userid:$userid){
                gameid
                badgeid
                badge
              }
            }`, variables: {userid: this.user.id}
          }).subscribe(res=>{
            this.userbadges = res.data?.getUserBadges
            this.apollo.query<{getUserAllBadges:any}>({
              query:gql`query getUserAllBadges($userid:Int!){
                getUserAllBadges(userid:$userid){
                  gameid
                  badgeid
                  badge
                }
              }`, variables: {userid: this.user.id}
            }).subscribe(res=>{
              this.allbadges = res.data?.getUserAllBadges
              this.apollo.query<{getUserGamesHaveBadge:any}>({
                query:gql`query getUserGamesHaveBadge($userid:Int!){
                  getUserGamesHaveBadge(userid:$userid){
                    id
                    name
                    banner
                  }
                }`, variables: {userid: this.user.id}
              }).subscribe(res=>{
                this.gamenames = res.data?.getUserGamesHaveBadge
              })
            })
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


}
