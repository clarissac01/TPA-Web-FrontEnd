import { Component, OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { RecaptchaModule } from "ng-recaptcha";
import { BrowserModule} from "@angular/platform-browser";

@Component({
  selector: 'app-registerpage',
  templateUrl: './registerpage.component.html',
  styleUrls: ['./registerpage.component.scss']
})
export class RegisterpageComponent implements OnInit{

  resolved(captchaResponse: string){
    console.log('Resolved captcha with response: ${captchaResponse}');
  }

  constructor(private apollo:Apollo, private router:Router, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.checklogin();
  }

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
          this.router.navigateByUrl('/');
        }
      })
    }
  }

  registerForm = this.fb.group({
    fullname: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    country: ['', Validators.required],
    check: ['', Validators.required]
  });

  register(){
    console.log("in");
    if(this.registerForm.valid){
      this.apollo.mutate<{register:string}>({
        mutation:gql`mutation registermutation($fullname:String!, $username:String!, $password:String!, $email:String!, $country:String!){
          register(fullname:$fullname, username:$username, password:$password, email:$email, country:$country)
        }`, variables: this.registerForm.value
      }).subscribe(res=>{
        this.router.navigateByUrl("/login");  
      })
    }
  }

}
