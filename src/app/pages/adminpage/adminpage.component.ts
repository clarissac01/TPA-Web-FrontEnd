import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-adminpage',
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.scss']
})
export class AdminpageComponent implements OnInit {

  constructor(private apollo:Apollo, private router:Router) { }

  ngOnInit(): void {
    this.login();
  }

  managegame(){
    this.router.navigateByUrl("/managegame");  
  }
  
  managepromo(){
    this.router.navigateByUrl("/managepromo");  
  }

  manageuser(){
    this.router.navigateByUrl("/manageuser");  
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
          // this.router.navigateByUrl("/adminpage"); 
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
