import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-pointpage',
  templateUrl: './pointpage.component.html',
  styleUrls: ['./pointpage.component.scss']
})
export class PointpageComponent implements OnInit {

  user:any;
  userprofile:any;

  alluserminibackground:any[] = [];
  alluseravatar:any[] = [];
  alluserbackground:any[] = []
  alluserchatsticker:any[] = []
  alluseranimated:any[] = []

  allanimated:any[] = []
  allminibackground:any[] = []
  allavatar:any[] = []
  allbackground:any[] = []
  allchatsticker:any[] = []

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.login();
  }

  buttonprofiles:string[]=[]
  buttonanimated:string[]=[]
  buttonborder:string[]=[]
  buttonchatsticker:string[]=[]
  buttonminiprofiles:string[]=[]

  login(){
    for (let index = 0; index < 3; index++) {
      this.buttonprofiles[index] = "no"
      this.buttonanimated[index] = "no"
      this.buttonborder[index] = "no"
      this.buttonchatsticker[index] = "no"
      this.buttonminiprofiles[index] = "no"
    }
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
          // this.route.navigateByUrl("/steamadmin")
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
          this.apollo.query<{getAllUserAvatar:any}>({
            query:gql`query getAllUserAvatar($userid:Int!){
              getAllUserAvatar(userid:$userid){
                userid
                avatarid
                active
              }
            }`, variables: {userid: this.user.id}
          }).subscribe(res=>{
            this.alluseravatar = res.data?.getAllUserAvatar;
            console.log(this.alluseravatar)
            for (let index = 0; index < this.alluseravatar.length; index++) {
              this.buttonborder[this.alluseravatar[index].avatarid - 1] = "yes"
            }
          })
          this.apollo.query<{getAllUserBackground:any}>({
            query:gql`query getAllUserBackground($userid:Int!){
              getAllUserBackground(userid:$userid){
                userid
                backgroundid
                active
              }
            }`, variables: {userid: this.user.id}
          }).subscribe(res=>{
            this.alluserbackground = res.data?.getAllUserBackground;
            console.log(this.alluserbackground)
            for (let index = 0; index < this.alluserbackground.length; index++) {
              this.buttonprofiles[this.alluserbackground[index].backgroundid - 1] = "yes"
            }
          })
          this.apollo.query<{getAllUserMiniBackground:any}>({
            query:gql`query getAllUserMiniBackground($userid:Int!){
              getAllUserMiniBackground(userid:$userid){
                userid
                backgroundid
                active
              }
            }`, variables: {userid: this.user.id}
          }).subscribe(res=>{
            this.alluserminibackground = res.data?.getAllUserMiniBackground;
            console.log(this.alluserminibackground)
            for (let index = 0; index < this.alluserminibackground.length; index++) {
              this.buttonminiprofiles[this.alluserminibackground[index].backgroundid - 1] = "yes"
            }
          })
          this.apollo.query<{getAllUserChatStickers:any}>({
            query:gql`query getAllUserChatStickers($userid:Int!){
              getAllUserChatStickers(userid:$userid){
                userid
                stickerid
                chatsticker
              }
            }`, variables: {userid: this.user.id}
          }).subscribe(res=>{
            this.alluserchatsticker = res.data?.getAllUserChatStickers;
            for (let index = 0; index < this.alluserchatsticker.length; index++) {
              this.buttonchatsticker[this.alluserchatsticker[index].stickerid - 1] = "yes"
            }
          })
          this.apollo.query<{getAllChatStickers:any}>({
            query:gql`query getAllChatStickers{
              getAllChatStickers{
                userid
                stickerid
                chatsticker
              }
            }`
          }).subscribe(res=>{
            this.allchatsticker = res.data?.getAllChatStickers;
          })
          this.apollo.query<{getAllBackground:any}>({
            query:gql`query getAllBackground{
              getAllBackground{
                userid
                backgroundid
              }
            }`
          }).subscribe(res=>{
            this.allbackground = res.data?.getAllBackground;
          })
          this.apollo.query<{getAllMiniBackground:any}>({
            query:gql`query getAllMiniBackground{
              getAllMiniBackground{
                userid
                backgroundid
              }
            }`
          }).subscribe(res=>{
            this.allminibackground = res.data?.getAllMiniBackground;
          })
          this.apollo.query<{getAllAvatar:any}>({
            query:gql`query getAllAvatar{
              getAllAvatar{
                userid
                avatarid
              }
            }`
          }).subscribe(res=>{
            this.allavatar = res.data?.getAllAvatar;
          })
          this.apollo.query<{getAllAnimated:any}>({
            query:gql`query getAllAnimated{
              getAllAnimated{
                userid
                avatarid
                avatar
                active
              }
            }`
          }).subscribe(res=>{
            this.allanimated = res.data?.getAllAnimated;
            console.log(this.allanimated)
          })
          this.apollo.query<{getAllUserAnimated:any}>({
            query:gql`query getAllUserAnimated($userid:Int!){
              getAllUserAnimated(userid:$userid){
                userid
                avatarid
                avatar
                active
              }
            }`, variables:{userid: this.user.id}
          }).subscribe(res=>{
            this.alluseranimated = res.data?.getAllUserAnimated;
            for (let index = 0; index < this.alluseranimated.length; index++) {
              this.buttonanimated[this.alluseranimated[index].avatarid - 1] = "yes"
            }
          })
        }
      })
    }
  }

  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  buyprofilebackground(id:number){
    this.apollo.mutate<{buyProfileBackground:string}>({
      mutation:gql`mutation buyProfileBackground($userid:Int!, $backgroundid:Int!){
        buyProfileBackground(userid:$userid, backgroundid:$backgroundid)
      }`, variables:{userid: this.user.id, backgroundid: id+1}
    }).subscribe(res=>{
      this.route.navigateByUrl('pointshop').then(function(){
        window.location.reload()
      })
    })
  }

  buyminibackground(id:number){
    this.apollo.mutate<{buyMiniBackground:string}>({
      mutation:gql`mutation buyMiniBackground($userid:Int!, $backgroundid:Int!){
        buyMiniBackground(userid:$userid, backgroundid:$backgroundid)
      }`, variables:{userid: this.user.id, backgroundid: id+1}
    }).subscribe(res=>{
      this.route.navigateByUrl('pointshop').then(function(){
        window.location.reload()
      })
    })
  }

  buyavatar(id:number){
    this.apollo.mutate<{buyAvatarFrame:string}>({
      mutation:gql`mutation buyAvatarFrame($userid:Int!, $avatarid:Int!){
        buyAvatarFrame(userid:$userid, avatarid:$avatarid)
      }`, variables:{userid: this.user.id, avatarid: id+1}
    }).subscribe(res=>{
      this.route.navigateByUrl('pointshop').then(function(){
        window.location.reload()
      })
    })
  }

  buychatsticker(id:number){
    this.apollo.mutate<{buyChatStickers:string}>({
      mutation:gql`mutation buyChatStickers($userid:Int!, $stickerid:Int!){
        buyChatStickers(userid:$userid, stickerid:$stickerid)
      }`, variables:{userid: this.user.id, stickerid: id+1}
    }).subscribe(res=>{
      this.route.navigateByUrl('pointshop').then(function(){
        window.location.reload()
      })
    })
  }

  buyanimated(id:number){
    this.apollo.mutate<{buyAnimated:string}>({
      mutation:gql`mutation buyAnimated($userid:Int!, $animatedid:Int!){
        buyAnimated(userid:$userid, animatedid:$animatedid)
      }`, variables:{userid: this.user.id, animatedid: id+1}
    }).subscribe(res=>{
      this.route.navigateByUrl('pointshop').then(function(){
        window.location.reload()
      })
    })
  }

}
