import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-topuppage',
  templateUrl: './topuppage.component.html',
  styleUrls: ['./topuppage.component.scss']
})
export class TopuppageComponent implements OnInit {

  user:any;
  userprofile:any;

  walletcode = 0;

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

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
            balance
          }
        }`, variables: {token: jwt}
      }).subscribe(res=>{
        this.user = res.data?.auth;

        if(this.user.id == 1){
          this.route.navigateByUrl("/steamadmin")
        }
        else{
          this.apollo.query<{getUserProfile:any}>({
            query:gql`query getUserProfile($id:Int!){
              getUserProfile(id:$id){
                image,
                level,
                summary,
                status
              }
            }`, variables: {id: this.user.id}
          }).subscribe(res=>{
            this.userprofile = res.data?.getUserProfile;
          })
        }
      })
    }else{
      this.route.navigateByUrl('/');
    }
  }

  redeem(){
    console.log(this.walletcode)
    if(this.walletcode > 0){
      this.apollo.mutate<{updateWallet:string}>({
        mutation:gql`mutation updateWallet($userid:Int!, $code:Int!){
          updateWallet(userid:$userid, code:$code)
        }`, variables: {userid: this.user.id, code:this.walletcode}
      }).pipe(catchError(err=>{
        alert('Your code is invalid!')
        return err
      })).subscribe(res=>{
        this.route.navigateByUrl('/topupwallet').then(function(){
          window.location.reload()
        })
      })
      
    }
  }

}
