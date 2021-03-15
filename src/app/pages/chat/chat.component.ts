import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  chatin:string[] = []
  chatuser:string[] = []

  chat = "";
  user:any;

  friendid = 0;
  
  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.router.params.subscribe(params => {
      this.friendid = params['friendid'];
    });
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
        console.log("User: "+this.user.id);
        this.apollo.subscribe({
          query:gql`subscription MessageReceived($userid:Int!){
            MessageReceived(userid: $userid)
          }`, variables: {userid: this.user.id}
        }).subscribe((res:any)=>{
          this.chatin.push(res.data?.MessageReceived)
          this.chatuser.push('0')
        })
        if(this.user.id == 1){
          this.route.navigateByUrl("/steamadmin")
        }
       
      })
    }else{
      this.route.navigateByUrl("/")
    }
  }

  sendchat(){
    if(!this.chat){
      return
    }
    console.log("Friend " + this.friendid);
    this.apollo.mutate<{sendMessage:string}>({
      mutation:gql`mutation sendMessage($userid:Int!, $message:String!){
        sendMessage(userid:$userid, message:$message)
      }`, variables: {userid: this.friendid, message: this.chat}
    }).subscribe((res:any)=>{
      this.chatin.push(res.data?.sendMessage);
      this.chatuser.push('1')
    })
    this.chat = "";
  }

}
