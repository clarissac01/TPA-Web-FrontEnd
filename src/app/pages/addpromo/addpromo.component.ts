import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-addpromo',
  templateUrl: './addpromo.component.html',
  styleUrls: ['./addpromo.component.scss']
})
export class AddpromoComponent implements OnInit {

  games:any[]=[];

  constructor(private apollo:Apollo, private router:Router, private fb: FormBuilder, private sanitizer:DomSanitizer) {
  }

  ngOnInit(): void {
    this.login();
    this.init();
  }

  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  init(){
    this.apollo.query<{GameNotPromo:any}>({
      query:gql`query getgamenotpromo{
        GameNotPromo{
          id
          name
          price
          banner
        }
      }`
    }).subscribe(res=>{
      this.games = res.data?.GameNotPromo;
      console.log(this.games.length);
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

  addgame(id:number){
    this.router.navigate(["/addpromo", id]);
  }
  
}
