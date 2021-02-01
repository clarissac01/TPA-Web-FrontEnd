import { variable } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-loginadmin',
  templateUrl: './loginadmin.component.html',
  styleUrls: ['./loginadmin.component.scss']
})
export class LoginadminComponent implements OnInit {

  constructor(private apollo:Apollo, private router:Router, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.logininit();
  }

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });


  logininit(){
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
          this.router.navigateByUrl("/adminpage"); 
        }
        else{
          this.router.navigateByUrl("/")
        }
      })
    }
  }


  login(){
    this.apollo.mutate<{login:string}>({
      mutation:gql`mutation loginmutation($username:String!, $password:String!){
        login(username:$username, password:$password)
      }`, variables: this.loginForm.value
    }).subscribe(res=>{
      const jwt = res.data?.login;
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
            this.router.navigateByUrl("/adminpage"); 
          }
          else{
            this.router.navigateByUrl("/")
          }
        })
      }
    })
  }

  

}
