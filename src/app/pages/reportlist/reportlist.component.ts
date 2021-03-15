import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-reportlist',
  templateUrl: './reportlist.component.html',
  styleUrls: ['./reportlist.component.scss']
})
export class ReportlistComponent implements OnInit {

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
          this.apollo.query<{getReportedUser:any}>({
            query:gql`query getReportedUser{
              getReportedUser{
                id
                username
                fullname
              }
            }
            `
          }).subscribe(res=>{
            this.alluser = res.data?.getReportedUser;
          })
          this.apollo.query<{getReportsUser:any}>({
            query:gql`query getReportsUser{
              getReportsUser{
                id
                username
                fullname
              }
            }`
          }).subscribe(res=>{
            this.alluserdetail = res.data?.getReportsUser
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

}
