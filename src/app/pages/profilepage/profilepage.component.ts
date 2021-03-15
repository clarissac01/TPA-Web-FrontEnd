import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.scss']
})
export class ProfilepageComponent implements OnInit {

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

  currpage = 1;
  totalpage = 0;

  user:any;
  userprofile:any;
  userfriend:any[] = [];
  userfrienddetail:any[] = [];
  usergames:any[] = []
  usercomments:any[] = [];
  usercommenters:any[] = [];
  usercommenterdetails:any[] = [];
  useractivities:any[] = [];

  bio="";
  level = 0;

  showreportmodal = false
  reportfriendid = 0;

  ngOnInit(): void {
    this.login();
  }

  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
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
          this.apollo.query<{getUserFriends:any}>({
            query:gql`query getUserFriends($userid:Int!){
              getUserFriends(userid:$userid){
                id
                username
              }
            }`, variables:{userid: this.user.id}
          }).subscribe(res=>{
            this.userfriend = res.data?.getUserFriends;
            console.log(this.userfriend);
          })
          this.apollo.query<{getUserFriendProfiles:any}>({
            query:gql`query getUserFriendProfiles($userId:Int!){
              getUserFriendProfiles(userId:$userId){
                userid
                image
                level
                status
                summary
              }
            }`, variables:{userId: this.user.id}
          }).subscribe(res=>{
            this.userfrienddetail = res.data?.getUserFriendProfiles;
          })
          this.apollo.query<{getUserGames:any}>({
            query:gql`query getUserGames($userid:Int!){
              getUserGames(userid:$userid){
                id
                name
                banner
              }
            }`, variables: {userid: this.user.id}
          }).subscribe(res=>{
            this.usergames = res.data?.getUserGames;
          })
          this.apollo.query<{getCommentUserProfile:any}>({
            query:gql`query getCommentUserProfile($userid:Int!){
              getCommentUserProfile(userid:$userid){
                userid
                image
              }
            }`, variables:{userid: this.user.id}
          }).subscribe(res=>{
            this.usercommenterdetails = res.data?.getCommentUserProfile;
            console.log(this.usercommenterdetails[0].image);
            this.apollo.query<{getUserComment:any}>({
              query:gql`query getUserComment($userid:Int!){
                getUserComment(userid:$userid){
                  commenterid
                  comment
                  createdAt
                }
              }`, variables:{userid: this.user.id}
            }).subscribe(res=>{
               this.usercomments = res.data?.getUserComment;
              })
              
            })
            this.apollo.query<{getUserCommenter:any}>({
            query:gql`query getUserCommenter($userid:Int!){
              getUserCommenter(userid:$userid){
                id
                username
              }
            }`, variables: {userid:this.user.id}
          }).subscribe(res=>{
            this.usercommenters = res.data?.getUserCommenter;
          })
          this.apollo.query<{getAllUserActivities:any}>({
            query:gql`query getAllUserActivities($userid:Int){
              getAllUserActivities(userid:$userid){
                userid
                activity
              }
            }`, variables: {userid:this.user.id}
          }).subscribe(res=>{
            this.useractivities = res.data?.getAllUserActivities
            if (this.useractivities.length%10==0){
              this.totalpage = this.useractivities.length/10;
            }else{
              this.totalpage = Math.floor((this.useractivities.length/10));
            }
          })
          this.apollo.query<{paginateUserActivities:any}>({
            query:gql`query paginateUserActivities($userid:Int!, $index:Int!){
              paginateUserActivities(userid:$userid, index:$index){
                userid
                activity
              }
            }`, variables: {userid: this.user.id, index: this.currpage}
          }).subscribe(res=>{
            this.useractivities = res.data?.paginateUserActivities
          })
        }
      })
    }
  }

  editprofile(){
    this.route.navigateByUrl('/editprofile');
  }

  prevpage(){
    this.currpage --;
    this.initpage();
  }

  nextpage(){
    this.currpage++;
    this.initpage();
  }

  initpage(){
    this.useractivities = [];
    this.apollo.query<{paginateUserActivities:any}>({
      query:gql`query paginateUserActivities($userid:Int!, $index:Int!){
        paginateUserActivities(userid:$userid, index:$index){
          userid
          activity
        }
      }`, variables: {userid: this.user.id, index: this.currpage}
    }).subscribe(res=>{
      this.useractivities = res.data?.paginateUserActivities
    })
  }

  showreport(userid:number){
    this.showreportmodal = true
    this.reportfriendid = userid
  }

  reportuser(){
    this.apollo.mutate<{reportUser:string}>({
      mutation:gql`mutation reportUser($userid:Int!, $reporterid:Int!){
        reportUser(userid:$userid, reporterid:$reporterid)
      }`, variables:{userid: this.reportfriendid, reporterid: this.user.id}
    }).subscribe(res=>{
      this.showreportmodal = false;
    })
  }

  gotochat(){
    this.route.navigateByUrl('/chatpage')
  }

}
