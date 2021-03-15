import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  useravatar:any;
  userid:any = null;
  user:any=null;
  profile:any;
  notif:any[] = [];

  constructor(private apollo:Apollo, private sanitizer:DomSanitizer, private router:Router) { }

  ngOnInit(): void {
    this.user = null;
    if(localStorage.getItem("jwt")){
      this.userid = localStorage.getItem("jwt");
      this.initdisplay();
      // console.log(this.user.id);
      this.login();
    }else{
      console.log("this user is null");
    }
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
          this.router.navigateByUrl("/steamadmin")
        }
        else{
          this.apollo.query<{getUserNotif:any}>({
            query:gql`query getUserNotif($id:Int!){
              getUserNotif(id:$id){
                news
                contentType
              }
            }`, variables: {id: this.user.id}
          }).subscribe(res=>{
            this.notif = res.data?.getUserNotif;
            console.log("Notif length: "+this.notif.length)
          })
          this.apollo.query<{getUserAnimated:any}>({
            query:gql`query getUserAnimated($userid:Int!){
              getUserAnimated(userid:$userid){
                userid
                avatarid
                avatar
              }
            }`, variables:{userid: this.user.id}
          }).subscribe(res=>{
            this.useravatar = res.data?.getUserAnimated;
          })
        }
      })
    }
  }
  
  initdisplay(){
    console.log(this.userid);
    this.apollo.query<{auth:any}>({
      query:gql`query getUser($token: String!) {
        auth(token: $token) {
          id
          fullname
          username
          isSuspended
          country
          balance
        }
      }`, variables: {token: this.userid}
    }).subscribe(res=>{
      this.user = res.data?.auth;
      console.log(this.user.id);
      this.apollo.query<{getUserProfile:any}>({
        query:gql`query getUserProfile($id:Int!){
          getUserProfile(id:$id){
            image,
            level,
            summary,
            status
          }
        }`, variables: {id: this.user.id}
      }).subscribe(res=>{
        this.profile = res.data?.getUserProfile;
        console.log(this.profile.image);
      })
      
    })
  }

  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  logout(){
    localStorage.removeItem('jwt');
    this.router.navigateByUrl('/').then(function(){
      window.location.reload();
    });
  }

  gotocommunity(){
    this.router.navigateByUrl('/community');
  }

}
