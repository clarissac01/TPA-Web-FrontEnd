import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.scss']
})
export class LoginpageComponent implements OnInit {

  constructor(private apollo:Apollo, private router:Router, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.checklogin();
  }
  
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  checklogin(){
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
        console.log("success");
        var user:any;
        user = res.data?.auth;
        if(user.id==1){
          this.router.navigateByUrl('adminpage');
        }else{
          this.apollo.mutate<{}>({
            mutation:gql`mutation setUserStatus($id:Int!){
              setUserStatus(id:$id)
            }`, variables: {id: user.id}
          }).subscribe(res=>{
            console.log("success");
          });
          this.router.navigateByUrl('/');
        }
      })
    }
  }

  login(){
    if(this.loginForm.valid){
      this.apollo.mutate<{login:string}>({
        mutation:gql`mutation loginmutation($username:String!, $password:String!){
          login(username:$username, password:$password)
        }`, variables: this.loginForm.value
      }).subscribe(res=>{
        const jwt = res.data?.login;
        if(jwt){
          localStorage.setItem("jwt", jwt);
          this.router.navigateByUrl("/");        
        }
      })
    }
  }

  register(){
    this.router.navigateByUrl("/register");
  }

}
