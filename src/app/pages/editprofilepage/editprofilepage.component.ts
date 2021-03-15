import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-editprofilepage',
  templateUrl: './editprofilepage.component.html',
  styleUrls: ['./editprofilepage.component.scss']
})
export class EditprofilepageComponent implements OnInit {

  user:any;
  userprofile:any;
  useranimated:any;
  useravatar:any;
  userurl:any;
  userbackground:any;
  userminibackground:any;
  
  alluserminibackground:any[] = [];
  alluseravatar:any[] = [];
  alluserbackground:any[] = [];
  alluseranimated:any[] = [];

  username = "";
  fullname = "";
  summary = "";
  customurl = "";
  avatarno = 0;
  animatedno = 0;

  bio = "";
  level = 0;

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
          console.log(this.alluseranimated)
        })

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
            this.bio = this.userprofile.summary;
            this.level = this.userprofile.level;
          })
          this.apollo.query<{getUserUrl:any}>({
            query:gql`query getUserUrl($userid:Int!){
              getUserUrl(userid:$userid){
                userid
                url
              }
            }`, variables:{userid: this.user.id}
          }).subscribe(res=>{
            this.userurl = res.data?.getUserUrl
          })
          this.apollo.query<{getUserMiniBackground:any}>({
            query:gql`query getUserMiniBackground($userid:Int!){
              getUserMiniBackground(userid:$userid){
                userid
                backgroundid
                active
              }
            }`, variables: {userid: this.user.id}
          }).subscribe(res=>{
            this.userminibackground = res.data?.getUserMiniBackground;
          })
          this.apollo.query<{getUserBackground:any}>({
            query:gql`query getUserBackground($userid:Int!){
              getUserBackground(userid:$userid){
                userid
                backgroundid
                active
              }
            }`, variables: {userid: this.user.id}
          }).subscribe(res=>{
            this.userbackground = res.data?.getUserBackground;
          })
          this.apollo.query<{getUserAvatar:any}>({
            query:gql`query getUserAvatar($userid:Int!){
              getUserAvatar(userid:$userid){
                userid
                avatarid
                active
              }
            }`, variables: {userid: this.user.id}
          }).subscribe(res=>{
            this.useravatar = res.data?.getUserAvatar;
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
            this.apollo.query<{getUserAnimated:any}>({
              query:gql`query getUserAnimated($userid:Int!){
                getUserAnimated(userid:$userid){
                  userid
                  avatarid
                  avatar
                  active
                }
              }`, variables:{userid: this.user.id}
            }).subscribe(res=>{
              this.useranimated = res.data?.getUserAnimated;
            })
            
          })
        }
      })
    }
  }
  
  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  updateprofile(){
    this.apollo.mutate<{updateUserProfile:string}>({
      mutation:gql`mutation updateUserProfile($userid:Int!, $url:String!, $fullname:String!, $username:String!, $summary:String!){
        updateUserProfile(userid:$userid, url:$url, fullname:$fullname, username:$username, summary:$summary)
      }`, variables: {userid: this.user.id, url: this.customurl, fullname: this.fullname, username: this.username, summary: this.summary}
    }).subscribe(res=>{
      this.route.navigateByUrl('/editprofile').then(function(){
        window.location.reload()
      })
    })
  }

  updateavatar(){
    this.apollo.mutate<{updateUserAvatar:string}>({
      mutation:gql`mutation updateUserAvatar($userid:Int!, $avatarframeid: Int!){
        updateUserAvatar(userid:$userid, avatarframeid:$avatarframeid)
      }`, variables: {userid: this.user.id, avatarframeid: this.avatarno}
    }).subscribe(res=>{
      this.route.navigateByUrl('/editprofile').then(function(){
        window.location.reload()
      })
    })
  }

  backgroundno = 0;
  minibackgroundno = 0;

  updatebackground(){
    this.apollo.mutate<{updateUserBackground:string}>({
      mutation:gql`mutation updateUserBackground($userid:Int!, $backgroundid:Int!){
        updateUserBackground(userid:$userid, backgroundid:$backgroundid)
      }`, variables: {userid: this.user.id, backgroundid: this.backgroundno}
    }).subscribe(res=>{
      this.route.navigateByUrl('/editprofile').then(function(){
        window.location.reload()
      })
    })
  }

  updateminibackground(){
    this.apollo.mutate<{updateUserMiniBackground:string}>({
      mutation:gql`mutation updateUserMiniBackground($userid:Int!, $minibackgroundid:Int!){
        updateUserMiniBackground(userid:$userid, minibackgroundid:$minibackgroundid)
      }`, variables: {userid: this.user.id, minibackgroundid: this.minibackgroundno}
    }).subscribe(res=>{
      this.route.navigateByUrl('/editprofile').then(function(){
        window.location.reload()
      })
    })
  }

  updateanimated(){
    this.apollo.mutate<{updateUserMiniBackground:string}>({
      mutation:gql`mutation updateUserAnimated($userid:Int!, $avatarid:Int!){
        updateUserAnimated(userid:$userid, avatarid:$avatarid)
      }`, variables: {userid: this.user.id, avatarid: this.alluseranimated[this.animatedno-1].avatarid}
    }).subscribe(res=>{
      this.route.navigateByUrl('/editprofile').then(function(){
        window.location.reload()
      })
    })
  }


}
