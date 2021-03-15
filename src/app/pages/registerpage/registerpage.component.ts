import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { BrowserModule} from "@angular/platform-browser";

@Component({
  selector: 'app-registerpage',
  templateUrl: './registerpage.component.html',
  styleUrls: ['./registerpage.component.scss']
})
export class RegisterpageComponent implements OnInit{

  // aFormGroup: FormGroup;
  otpcode = "";

  constructor(private apollo:Apollo, private router:Router, private fb: FormBuilder) {
    this.siteKey = "6Lf3r3YaAAAAAOOHus_Ni6_TxPxrbSSyNoriobdL";
  }

  siteKey:string = "6Lf3r3YaAAAAAOOHus_Ni6_TxPxrbSSyNoriobdL";
  
  aFormGroup = this.fb.group({
    recaptcha: ['', Validators.required]
  });
  
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
      this.otpcode = '';
      this.sendOTP();
    }
  }

  otpCode = 0;
  success = "";

  

  sendOTP(): void {
    this.apollo.query<{getOTP:string}>({
      query:gql`
        query getOTP{
          getOTP
        }
      `,
    }).subscribe(res=>{
      this.otpcode = res.data?.getOTP; 
      let temp = prompt('Insert OTP Code from Email : ');
      if (temp !== this.otpcode) {
        alert('failed');
        return;
      } else {
        alert('success');
      }
      this.apollo.mutate<{register:string}>({
        mutation:gql`mutation registermutation($fullname:String!, $username:String!, $password:String!, $email:String!, $country:String!){
          register(fullname:$fullname, username:$username, password:$password, email:$email, country:$country)
        }`, variables: this.registerForm.value
      }).subscribe(res=>{
        this.router.navigateByUrl("/login");  
      })
    });
  }

  randomIntFromInterval(min: any, max: any): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  resolved($event: string): void {
    this.success = $event;
  }

}
