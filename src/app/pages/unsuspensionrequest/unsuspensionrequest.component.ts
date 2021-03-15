import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-unsuspensionrequest',
  templateUrl: './unsuspensionrequest.component.html',
  styleUrls: ['./unsuspensionrequest.component.scss']
})
export class UnsuspensionrequestComponent implements OnInit {

  alluser:any[] = []
  alluserdetail:any[] = []

  constructor(private apollo:Apollo, private router:Router) { }

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
          }
        }`, variables: {token: jwt}
      }).subscribe(res=>{
        const user = res.data?.auth;
        if(user.id == 1){
          localStorage.setItem("jwt", jwt);
          this.apollo.query<{getUnsuspensionUser:any}>({
            query:gql`query getUnsuspensionUser{
              getUnsuspensionUser{
                id
                username
                fullname
              }
            }`
          }).subscribe(res=>{
            this.alluser = res.data?.getUnsuspensionUser;
          })
          this.apollo.query<{getUnsuspensionRequest:any}>({
            query:gql`query getUnsuspensionRequest{
              getUnsuspensionRequest{
                userid
                status
              }
            }`
          }).subscribe(res=>{
            this.alluserdetail = res.data?.getUnsuspensionRequest
          })
        }
        else{
          this.router.navigateByUrl("/")
        }
      })
    }else{
      this.router.navigateByUrl("/")
    }
  }

  logout(){
    localStorage.removeItem('jwt');
    this.router.navigateByUrl('/steamadmin');
  }

  unsuspend(id:number){
    this.apollo.mutate<{acceptUnsuspension:string}>({
      mutation:gql`mutation acceptUnsuspension($userid:Int!){
        acceptUnsuspension(userid:$userid)
      }`, variables: {userid: id}
    }).subscribe(res=>{
      this.router.navigateByUrl('unsuspensionrequest').then(function(){
        window.location.reload()
      })
    })
  }

  suspend(id:number){
    this.apollo.mutate<{declineUnsuspension:string}>({
      mutation:gql`mutation declineUnsuspension($userid:Int!){
        declineUnsuspension(userid:$userid)
      }`, variables: {userid: id}
    }).subscribe(res=>{
      this.router.navigateByUrl('unsuspensionrequest').then(function(){
        window.location.reload()
      })
    })
  }

}
