import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-alluser',
  templateUrl: './alluser.component.html',
  styleUrls: ['./alluser.component.scss']
})
export class AlluserComponent implements OnInit {

  currpage = 1;
  totalpage = 0;

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
          this.apollo.query<{getAllUser:any}>({
            query:gql`query getAllUser{
              getAllUser{
                id
                username
                fullname
                email
              }
            }`
          }).subscribe(res=>{
            this.alluser = res.data?.getAllUser;
          })
          for (let index = 0; index < this.alluser.length; index++) {
            if (this.alluser.length%10==0){
              this.totalpage = this.alluser.length/10;
            }else{
              this.totalpage = Math.floor((this.alluser.length/10));
            }
          }
          this.apollo.query<{getAllUserProfile:any}>({
            query:gql`query getAllUserProfile{
              getAllUserProfile{
                userid
                summary
                status
              }
            }`
          }).subscribe(res=>{
            this.alluserdetail = res.data?.getAllUserProfile
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

  prevpage(){
    this.currpage --;
    this.initpage();
  }

  nextpage(){
    this.currpage++;
    this.initpage();
  }

  initpage(){
    this.alluser = [];
    this.alluserdetail = [];
    this.apollo.query<{paginateAllPromo:any}>({
      query:gql`query paginateAllUser($index:Int!)($index:Int!){
        paginateAllUser(index:$index){
          id
          fullname
          username
          email
          country
          isSuspended
          balance
          point
        }
      }`, variables:{index: this.currpage}
    }).subscribe(res=>{
      this.alluser = res.data?.paginateAllPromo
    })
    this.apollo.query<{paginateAllUserDetail:any}>({
      query:gql`query paginateAllUserDetail($index:Int!){
        paginateAllUserDetail(index:$index){
          userid
          image
          level
          summary
          status
        }
      }`, variables:{index: this.currpage}
    }).subscribe(res=>{
      this.alluser = res.data?.paginateAllUserDetail
    })
  }

}
