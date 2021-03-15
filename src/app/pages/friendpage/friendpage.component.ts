import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-friendpage',
  templateUrl: './friendpage.component.html',
  styleUrls: ['./friendpage.component.scss']
})
export class FriendpageComponent implements OnInit {
 
  user:any;
  userfriends:any[] = []
  userfriendsdetail:any[] = []
  usernotfriends:any[] = []
  userfriendsavatar:any[] = []
  userfriendscode:any[] = []
  sendinvites:any[] = []
  pendinginvites:any[] = []

  showreportmodal = false

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.login()
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
        }else{
          this.apollo.mutate<{getUserFriends:any}>({
            mutation:gql`query getUserFriends($userid: Int!) {
              getUserFriends(userid: $userid) {
                id
                username
              }
            }`, variables: {userid: this.user.id}
          }).subscribe(res=>{
            this.userfriends = res.data?.getUserFriends
          })
          this.apollo.mutate<{getUserFriendProfiles:any}>({
            mutation:gql`query getUserFriendProfiles($userId: Int!) {
              getUserFriendProfiles(userId: $userId) {
                userid
                image
                level
                status
                summary
              }
            }`, variables: {userId: this.user.id}
          }).subscribe(res=>{
            this.userfriendsdetail = res.data?.getUserFriendProfiles
          })
          this.apollo.mutate<{getUserFriendCode:any}>({
            mutation:gql`query getUserFriendCode($userid:Int!){
              getUserFriendCode(userid:$userid){
                userid
                code
              }
            }`, variables: {userid: this.user.id}
          }).subscribe(res=>{
            this.userfriendscode = res.data?.getUserFriendCode
          })
          this.apollo.mutate<{getUserNotFriend:any}>({
            mutation:gql`query getUserNotFriend($userid:Int!){
              getUserNotFriend(userid:$userid){
                id
                username
              }
            }
            `, variables: {userid: this.user.id}
          }).subscribe(res=>{
            this.usernotfriends = res.data?.getUserNotFriend
          })
          this.apollo.query<{getSentInvite:any}>({
            query:gql`query getSentInvite($userid:Int!){
              getSentInvite(userid:$userid){
                id
                username
              }
            }`, variables: {userid: this.user.id}
          }).subscribe(res=>{
            this.sendinvites = res.data?.getSentInvite
          })
          this.apollo.query<{getPendingInvite:any}>({
            query:gql`query getPendingInvite($userid:Int!){
              getPendingInvite(userid:$userid){
                id
                username
              }
            }`, variables: {userid: this.user.id}
          }).subscribe(res=>{
            this.pendinginvites = res.data?.getPendingInvite
          })
          
        }
      })
    }else{
      this.route.navigateByUrl("/")
    }
  }

  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  report(){
    this.showreportmodal = true
  }

  reportuser(id:number){
    this.apollo.mutate<{reportUser:any}>({
      mutation:gql`mutation reportUser($userid:Int!, $reporterid:Int!){
        reportUser(userid:$userid, reporterid:$reporterid)
      }
      `, variables: {userid: id, reporterid: this.user.id}
    }).subscribe(res=>{
      this.showreportmodal = false
    })
  }

  sendrequest(id:number){
    this.apollo.mutate<{sendRequest:string}>({
      mutation:gql`mutation sendRequest($userid:Int!, $receiverid:Int!){
        sendRequest(userid:$userid, receiverid:$receiverid)
      }`, variables:{userid: this.user.id, receiverid: id}
    }).subscribe(res=>{
      this.route.navigateByUrl('/friends').then(function(){
        window.location.reload()
      })
    })
  }

  acceptrequest(id:number){
    this.apollo.mutate<{}>({
      mutation:gql`mutation acceptRequest($userid:Int!, $senderid:Int!){
        acceptRequest(userid:$userid, senderid:$senderid)
      }`, variables:{userid: this.user.id, senderid: id}
    }).subscribe(res=>{
      this.route.navigateByUrl('/friends').then(function(){
        window.location.reload()
      })
    })
  }
  
  declinerequest(id:number){
    this.apollo.mutate<{declineRequest:string}>({
      mutation:gql`mutation declineRequest($userid:Int!, $senderid:Int!){
        declineRequest(userid:$userid, senderid:$senderid)
      }`, variables:{userid: this.user.id, senderid: id}
    }).subscribe(res=>{
      this.route.navigateByUrl('/friends').then(function(){
        window.location.reload()
      })
    })
  }

  cancelrequest(id:number){
    this.apollo.mutate<{declineRequest:string}>({
      mutation:gql`mutation declineRequest($userid:Int!, $senderid:Int!){
        declineRequest(userid:$userid, senderid:$senderid)
      }`, variables:{userid: id, senderid: this.user.id}
    }).subscribe(res=>{
      this.route.navigateByUrl('/friends').then(function(){
        window.location.reload()
      })
    })
  }

}
