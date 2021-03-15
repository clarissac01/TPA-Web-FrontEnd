import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-communitypage',
  templateUrl: './communitypage.component.html',
  styleUrls: ['./communitypage.component.scss']
})
export class CommunitypageComponent implements OnInit {

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

  currpage = 1;
  totalpage = 0;

  user:any;
  userdetail:any;

  poster:any;
  posterdetail:any;

  commenter:any[]=[];
  commenterdetail:any[]=[];

  showmedia = true;
  showreviews = false;
  showdiscussions = false;
  showdetailmedia = false;

  media:any[]=[];
  gamemedia:any[]=[];
  mediacomment:any[]=[];
  mediaindex=0;

  reviews:any[]=[];
  reviewsgame:any[]=[];
  reviewscomment:any[]=[];
  reviewsindex=0;

  modalcomment:any[]=[];
  modalreviews:any[]=[];

  showreviewdetail = false;

  comments: any[] = [];

  ngOnInit(): void {
    this.login();
    this.initmedia();
    this.initreviews();
  }

  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  initreviews(){
    this.apollo.query<{getReviews:any}>({
      query:gql`query getReviews{
        getReviews{
          gameid
          userid
          review
          upvote
          downvote
          link
          ContentType
          positive
          helpful
          date
        }
      }`
    }).subscribe(res=>{
      this.reviews = res.data?.getReviews;
      for (let index = 0; index < this.reviews.length; index++) {
        console.log("REviews: "+this.reviews[index].gameid+" "+this.reviews[index].review);
      }
    })
    this.apollo.query<{getReviewsComments:any}>({
      query:gql`query getReviewsComments{
        getReviewsComments{
          gameid
          posterid
          commenterid
          review
          comment
        }
      }`
    }).subscribe(res=>{
      this.reviewscomment = res.data?.getReviewsComments;
    })
    this.apollo.query<{getReviewsGame:any}>({
      query:gql`query getReviewsGame{
        getReviewsGame{
          id
          name
          banner
        }
      }`
    }).subscribe(res=>{
      this.reviewsgame = res.data?.getReviewsGame;
      for (let index = 0; index < this.reviewsgame.length; index++) {
        console.log("REviews Game: "+this.reviewsgame[index].id+" "+this.reviewsgame[index].name);
      }
    })
  }

  initmedia(){
    this.apollo.query<{getMedia:any}>({
      query:gql`query getMedia{
        getMedia{
          gameid
          userid
          review
          upvote
          downvote
          link
          ContentType
          positive
          helpful
          date
        }
      }`
    }).subscribe(res=>{
      this.media=res.data?.getMedia;
    })
    this.apollo.query<{getMediaComments:any}>({
      query:gql`query getMediaComments{
        getMediaComments{
          gameid
          posterid
          commenterid
          review
          comment
        }
      }`
    }).subscribe(res=>{
      this.mediacomment=res.data?.getMediaComments;
    })
    this.apollo.query<{getMediaGame:any}>({
      query:gql`query getMediaGame{
        getMediaGame{
          id
          name
          banner
        }
      }`
    }).subscribe(res=>{
      this.gamemedia = res.data?.getMediaGame
    })
  }

  countcomment(gameid:number, userid:number, review:string):number{
    var comment = 0;
    for (let index = 0; index < this.mediacomment.length; index++) {
      if(this.mediacomment[index].gameid == gameid && this.mediacomment[index].posterid == userid && this.mediacomment[index].review == review){
        comment++;
      }
    }
    return comment;
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
            this.userdetail = res.data?.getUserProfile;
          })
        }
      })
    }
  }

  helpful(review:string, gameid:number){
    console.log('masuk')
    this.apollo.mutate<{helpful:string}>({
      mutation:gql`mutation helpful($gameid:Int!, $review:String!, $userid:Int!){
        helpful(gameid:$gameid, review:$review, userid:$userid)
      }`, variables:{userid: this.user.id, gameid: gameid, review: review}  
    }).subscribe(res=>{
      this.route.navigateByUrl('/community').then(function(){
        window.location.reload();
      });
    })
  }

  unhelpful(review:string, gameid:number){

    this.apollo.mutate<{unhelpful:string}>({
      mutation:gql`mutation unhelpful($gameid:Int!, $review:String!, $userid:Int!){
        unhelpful(gameid:$gameid, review:$review, userid:$userid)
      }`, variables:{userid: this.user.id, gameid: gameid, review: review}  
    }).subscribe(res=>{
      this.route.navigateByUrl('/community').then(function(){
        window.location.reload();
      });
    })
  }

  upvote(review:string, gameid:number){
    console.log('masuk')
    this.apollo.mutate<{upvotereview:string}>({
      mutation:gql`mutation upvotereview($gameid:Int!, $userid:Int!, $review:String!){
        upvotereview(gameid:$gameid, userid:$userid, review:$review)
      }`, variables:{userid: this.user.id, gameid: gameid, review: review}  
    }).subscribe(res=>{
      this.route.navigateByUrl('/community').then(function(){
        window.location.reload();
      });
    })
  }

  downvote(review:string, gameid:number){

    this.apollo.mutate<{downvotereview:string}>({
      mutation:gql`mutation downvotereview($gameid:Int!, $userid:Int!, $review:String!){
        downvotereview(gameid:$gameid, userid:$userid, review:$review)
      }`, variables:{userid: this.user.id, gameid: gameid, review: review}  
    }).subscribe(res=>{
      this.route.navigateByUrl('/community').then(function(){
        window.location.reload();
      });
    })
  }

  showmediadetail(index:number){
    this.mediaindex = index;
    this.showdetailmedia = true;
    this.apollo.query<{getPoster:any}>({
      query:gql`query getPoster($userid:Int!){
        getPoster(userid:$userid){
          id
          username
        }
      }`, variables:{userid: this.media[this.mediaindex].userid}
    }).subscribe(res=>{
      this.poster = res.data?.getPoster;
      this.apollo.query<{getUserProfile:any}>({
        query:gql`query getUserProfile($id:Int!){
          getUserProfile(id:$id){
            image,
            level,
            summary,
            status
          }
        }`, variables: {id: this.media[this.mediaindex].userid}
      }).subscribe(res=>{
        this.posterdetail = res.data?.getUserProfile;
      })
    })
    // this.apollo.query<{}>({
    //   query:gql``
    // })
    this.apollo.query<{paginateMediaCommenter:any}>({
      query:gql`query paginateMediaCommenter($gameid:Int!, $userid:Int!, $review:String!, $index:Int!){
        paginateMediaCommenter(gameid:$gameid, userid:$userid, review:$review, index:$index){
          id
          username
        }
      }`, variables:{gameid: this.media[this.mediaindex].gameid, userid: this.media[this.mediaindex].userid, review: this.media[this.mediaindex].review, index: this.currpage}
    }).subscribe(res=>{
      this.commenter = res.data?.paginateMediaCommenter;
      console.log("Commenter: "+this.commenter[0].username);
    })
    this.apollo.query<{paginateMediaCommenterDetail:any}>({
      query:gql`query paginateMediaCommenterDetail($gameid:Int!, $userid:Int!, $review:String!, $index:Int!){
        paginateMediaCommenterDetail(gameid:$gameid, userid:$userid, review:$review, index:$index){
          userid
          image
          
        }
      }`, variables:{gameid: this.media[this.mediaindex].gameid, userid: this.media[this.mediaindex].userid, review: this.media[this.mediaindex].review, index: this.currpage}
    }).subscribe(res=>{
      this.commenterdetail = res.data?.paginateMediaCommenterDetail;
    })

    var modalindex = 0;
    for (let index = 0; index < this.mediacomment.length; index++) {
      if(this.mediacomment[index].gameid==this.media[this.mediaindex].gameid && this.mediacomment[index].posterid==this.media[this.mediaindex].userid && this.mediacomment[index].review==this.media[this.mediaindex].review){
        this.modalcomment[modalindex] = this.mediacomment[index];
        modalindex++;
      }
    }
  }

  shownreviewcomment:any[]=[];
  showreviewmodal(index:number){
    this.reviewsindex = index;
    this.showreviewdetail = true;
    this.commenter = [];
    this.commenterdetail = [];
    this.apollo.query<{getPoster:any}>({
      query:gql`query getPoster($userid:Int!){
        getPoster(userid:$userid){
          id
          username
        }
      }`, variables:{userid: this.reviews[this.reviewsindex].userid}
    }).subscribe(res=>{
      this.poster = res.data?.getPoster;
      this.apollo.query<{getUserProfile:any}>({
        query:gql`query getUserProfile($id:Int!){
          getUserProfile(id:$id){
            image,
            level,
            summary,
            status
          }
        }`, variables: {id: this.reviews[this.reviewsindex].userid}
      }).subscribe(res=>{
        this.posterdetail = res.data?.getUserProfile;
      })
    })
    this.apollo.query<{getReviewsCommenter:any}>({
      query:gql`query getReviewsCommenter($gameid:Int!, $userid:Int!, $review:String!){
        getReviewsCommenter(gameid:$gameid, userid:$userid, review:$review){
          id
          username
        }
      }
      `, variables:{gameid: this.reviews[this.reviewsindex].gameid, userid: this.reviews[this.reviewsindex].userid, review: this.reviews[this.reviewsindex].review}
    }).subscribe(res=>{
      this.commenter = res.data?.getReviewsCommenter;
      // console.log("Commenter: "+this.commenter[0].username);
    })
    this.apollo.query<{getReviewsCommenterDetail:any}>({
      query:gql`query getReviewsCommenterDetail($gameid:Int!, $userid:Int!, $review:String!){
        getReviewsCommenterDetail(gameid:$gameid, userid:$userid, review:$review){
          userid
          image
        }
      }`, variables:{gameid: this.reviews[this.reviewsindex].gameid, userid: this.reviews[this.reviewsindex].userid, review: this.reviews[this.reviewsindex].review}
    }).subscribe(res=>{
      this.commenterdetail = res.data?.getReviewsCommenterDetail;
      console.log(this.commenterdetail);
    })
    this.shownreviewcomment=[];
    var modalindex = 0;
    for (let index = 0; index < this.reviewscomment.length; index++) {
      if(this.reviewscomment[index].gameid==this.reviews[this.reviewsindex].gameid && this.reviewscomment[index].posterid==this.reviews[this.reviewsindex].userid && this.reviewscomment[index].review==this.reviews[this.reviewsindex].review){
        
        this.shownreviewcomment[modalindex] = this.reviewscomment[index];
        modalindex++;
        console.log(this.shownreviewcomment)

      }
    }
  }

  hidereviewdetail(){
    this.showreviewdetail=false;
  }

  hidemediadetail(){
    this.showdetailmedia = false;
  }

  commenttext = "";

  addcomment(){
    if(this.commenttext!=null){
      if(this.showmedia== true){
        this.apollo.mutate<{}>({
          mutation:gql`mutation addReviewComment($commenterid:Int!, $posterid:Int!, $review:String!, $comment:String!, $gameid:Int!){
            addReviewComment(commenterid:$commenterid, posterid:$posterid, review:$review, comment:$comment, gameid:$gameid)
          }`, variables:{commenterid: this.user.id, posterid: this.poster.id, review: this.media[this.mediaindex].review, comment: this.commenttext, gameid: this.media[this.mediaindex].gameid} 
        }).subscribe(res=>{
          this.showmediadetail(this.mediaindex);
          this.route.navigateByUrl('/community').then(function(){
            window.location.reload();
          })
        })
      }else if(this.showreviews == true){
        this.apollo.mutate<{}>({
          mutation:gql`mutation addReviewComment($commenterid:Int!, $posterid:Int!, $review:String!, $comment:String!, $gameid:Int!){
            addReviewComment(commenterid:$commenterid, posterid:$posterid, review:$review, comment:$comment, gameid:$gameid)
          }`, variables:{commenterid: this.user.id, posterid: this.poster.id, review: this.reviews[this.reviewsindex].review, comment: this.commenttext, gameid: this.reviews[this.reviewsindex].gameid} 
        }).subscribe(res=>{
          this.showreviewmodal(this.mediaindex);
          this.route.navigateByUrl('/community').then(function(){
            window.location.reload();
          })
        })
      }
    }
    this.commenttext="";
  }

  mediaactive(){
    this.showmedia = true;
    this.showreviews = false;
    this.showdiscussions = false;
  }

  reviewsactive(){
    this.showmedia = false;
    this.showreviews = true;
    this.showdiscussions = false;
  }

  discussionsactive(){
    this.showmedia = false;
    this.showreviews = false;
    this.showdiscussions = true;
  }

}
