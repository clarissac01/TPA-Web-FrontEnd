import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.component.html',
  styleUrls: ['./chatpage.component.scss']
})
export class ChatpageComponent implements OnInit {
  
  alluser:any[] = []
  alluserdetail:any[] = []

  user:any;

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
        this.user = res.data?.auth;
        if(this.user.id != 1){
          localStorage.setItem("jwt", jwt);
          this.apollo.query<{getUserFriends:any}>({
            query:gql`query getUserFriends($userid: Int!) {
              getUserFriends(userid: $userid) {
                id
                username
                fullname
              }
            }`, variables: {userid: this.user.id}
          }).subscribe(res=>{
            this.alluser = res.data?.getUserFriends;
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
    this.router.navigateByUrl('/');
  }

  chat(id:number){
    this.router.navigate(['chat', id])
  }

}
