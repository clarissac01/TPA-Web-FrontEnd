import { getLocaleDateFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

export class DisplayMapComponent {}

@Component({
  selector: 'app-gamedetail',
  templateUrl: './gamedetail.component.html',
  styleUrls: ['./gamedetail.component.scss']
})
export class GamedetailComponent implements OnInit {

  uniquecountry:any[] = []
  userbycountry:any[] = []
  countuserbycountry:number[] = []
  countrydata:any[] = []

  ageForm = this.fb.group({
    age: ['', Validators.required]
  });

  input = "";
  userhavethis = false;

  currslide = 0;

  user:any;
  cartcount = 0; 

  result:any[] = [];
  gameslideshow:any[]=[];
  promo:any;
  gameitem:any[]=[];
  gametag:any[]=[];
  detail:any;
  mature=false;
  keyword = "";

  reviews1:any[]= []
  reviews2:any[]= []
  userreviews1:any[]=[];
  userreviews2:any[] = [];

  game:any;
  userid = 0;
  gameid = 0;

  usergames:any[]= []

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.router.params.subscribe(params => {
      this.gameid = params['id'];
      this.init(this.gameid);
      this.autoNext();
      this.login();
    this.loadreview();
    });
    this.apollo.query<{getCart:any}>({
      query:gql`query getCart{
        getCart{
          gameid
        }
      }`
    }).subscribe(res=>{
      this.cartcount = res.data?.getCart.length;
    })
  }

  loadreview(){
    this.apollo.query<{getGameReview1:any}>({
      query:gql`query getGameReview1($gameid:Int!){
        getGameReview1(gameid:$gameid){
          review,
          upvote
          downvote
          link
          ContentType
          positive
        }
      }`, variables:{gameid: this.gameid}
    }).subscribe(res=>{
      this.reviews1 = res.data?.getGameReview1;
    })
    this.apollo.query<{getGameReview2:any}>({
      query:gql`query getGameReview2($gameid:Int!){
        getGameReview2(gameid:$gameid){
          review,
          upvote
          downvote
          link
          ContentType
          positive
        }
      }`, variables:{gameid: this.gameid}
    }).subscribe(res=>{
      this.reviews2 = res.data?.getGameReview2;
    })
    this.apollo.query<{getUserReview1:any}>({
      query:gql`query getUserReview1($gameid:Int!){
        getUserReview1(gameid:$gameid){
          username
          id    
        }
      }`, variables:{gameid:this.gameid}
    }).subscribe(res=>{
      this.userreviews1 = res.data?.getUserReview1;
      console.log(this.userreviews1)
    })
    this.apollo.query<{getUserReview2:any}>({
      query:gql`query getUserReview2($gameid:Int!){
        getUserReview2(gameid:$gameid){
          username,
          id    
        }
      }`, variables:{gameid: this.gameid}
    }).subscribe(res=>{
      this.userreviews2 = res.data?.getUserReview2
    })
  }

  init(gameid:number){
    this.apollo.query<{getGame:any}>({
      query:gql`query getgame($id: Int!) {
        getGame(id: $id) {
          name
          price
          banner
          matureContent
        }
      }`, variables: {id: gameid}
    }).subscribe(res=>{
      this.game = res.data?.getGame;
      console.log("Game name:" + this.game.name);
      if(this.game.matureContent == true){
        this.mature = true;
        console.log(this.mature);
      }
    });
    this.apollo.query<{getGameSlideshows:any}>({
      query:gql`query getgameslideshow($id: Int!) {
        getGameSlideshows(id: $id) {
          link,
          contentType
        }
      }`, variables: {id: gameid}
    }).subscribe(res=>{
      this.gameslideshow = res.data?.getGameSlideshows
    });
    this.apollo.query<{getGameDetail:any}>({
      query:gql`query getgamedetail($id: Int!) {
        getGameDetail(id: $id) {
          description
          developer
          publisher
          systemrequirements
        }
      }`, variables: {id: gameid}
    }).subscribe(res=>{
      this.detail = res.data?.getGameDetail;
    });
    this.apollo.query<{getGameTags:any}>({
      query:gql`query getgametag($id: Int!) {
        getGameTags(id: $id) {
          tagname
        }
      }`, variables: {id: gameid}
    }).subscribe(res=>{
      this.gametag = res.data?.getGameTags;
      console.log("Tagname: "+this.gametag[0].tagname);
    })
    this.apollo.query<{getUniqueCountry:any}>({
      query:gql`query getUniqueCountry($gameid:Int!){
        getUniqueCountry(gameid:$gameid){
          country
        }
      }`, variables:{gameid: gameid}  
    }).subscribe(res=>{
      this.uniquecountry = res.data?.getUniqueCountry;
      console.log(this.uniquecountry);
      this.apollo.query<{getUserbyCountry:any}>({
        query:gql`query getUserbyCountry($gameid:Int!){
          getUserbyCountry(gameid: $gameid){
            id
            username
            country
          }
        }`, variables:{gameid: gameid}
      }).subscribe(res=>{
        this.userbycountry = res.data?.getUserbyCountry;
        for (let index = 0; index < this.uniquecountry.length; index++) {
          var counter = 0;
          for (let idx = 0; idx < this.userbycountry.length; idx++) {
            if(this.uniquecountry[index].country == this.userbycountry[idx].country){
              counter++;
            }
          }
          this.countuserbycountry[index] = counter;
        }
        console.log(this.userbycountry);
        console.log("Counter"+this.countuserbycountry);
      })
      this.apollo.query<{getAllCountry:any}>({
        query:gql`query getAllCountry{
          getAllCountry{
            countryname
            latitude
            longitude
          }
        }`
      }).subscribe(res=>{
        this.countrydata = res.data?.getAllCountry
        console.log(this.countrydata);
      })
    })
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
        this.userid = this.user.id;
        if(this.user.id == 1){
          this.route.navigateByUrl("/steamadmin")
        }
        else{
          this.apollo.query<{getUserGames:any}>({
            query:gql`query getUserGames($userid:Int!){
              getUserGames(userid:$userid){
                id
                banner
              }
            }`, variables:{userid: this.userid}
          }).subscribe(res=>{
            this.usergames = res.data?.getUserGames;
            for (let index = 0; index < this.usergames.length; index++) {
              if(this.usergames[index].id == this.gameid){
                this.userhavethis=true;
              }
            }
          })
          
        }
      })
    }
  }
  
  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  inputGiven(e: EventTarget | null){
    // const input = e as HTMLInputElement;
    if(this.input != ""){
      this.apollo.query<{searchGame:any}>({
        query:gql`query searchGame($keyword:String!){
          searchGame(keyword:$keyword){
            id
            name
            banner
            price
          }
        }`, variables: {keyword: this.input}
      }).subscribe(res=>{
        this.result = res.data?.searchGame
        // console.log(res.data?.searchGame.name);
        console.log(this.result.length);
      })
    }else{
      this.result = [];
      console.log(this.result.length);
    }
  }

  searchthis(){
    this.route.navigate(["/search", this.keyword]);
  }

  view(){
    console.log(this.ageForm.value.age);
    var diff = 0;
    var inputteddate = new Date(this.ageForm.value.age);
    var diff =(Date.now() - inputteddate.getTime()) / 1000;
    diff /= (60 * 60 * 24);
    diff = Math.abs(Math.round(diff/365.25));

    if(diff >= 18){
      this.mature = false;
    }
  }

  back(){
    this.route.navigateByUrl("/")
  }

  updateslide(idx:number){
    this.currslide = idx;
  }

  autoNext(){
    if(this.gameslideshow[this.currslide] != null && this.gameslideshow[this.currslide].contentType != "Video"){
      console.log("not video");
      setInterval(() => this.updateslide(this.currslide+1), 2000);
    }
  }

  addtocart(gameid:number){
    console.log(gameid);
    this.apollo.mutate<{addCart:string}>({
      mutation:gql`mutation addCart($gameid:Int!){
        addCart(gameid:$gameid)
      }`, variables: {gameid: gameid}
    }).subscribe(res=>{
      this.route.navigateByUrl("/cart").then(function(){
        window.location.reload();
      });
    })
  }

  review=""
  file:any;
  checkgood=false;

  addreview(){
    console.log("Good or Bad?: "+ this.checkgood);
    this.apollo.mutate<{}>({
      mutation:gql`mutation addreview($userid:Int!, $gameid:Int!, $review:String!, $files:Upload, $positive:Boolean!){
        addreview(userid:$userid, gameid:$gameid, review:$review, files:$files, positive:$positive)
      }`, variables:{userid: this.user.id, gameid: this.gameid, review: this.review, files: this.file, positive: this.checkgood}
    }).subscribe(res=>{
      this.route.navigateByUrl('/').then(function(){
        window.location.reload()
      })
    })
  }

  filein(e: Event){
    const input = e.target as HTMLInputElement 
    this.file=input.files?.item(0) 
  }

  upvote(userid: number, review:string){
    console.log('masuk')
    this.apollo.mutate<{upvotereview:string}>({
      mutation:gql`mutation upvotereview($gameid:Int!, $userid:Int!, $review:String!){
        upvotereview(gameid:$gameid, userid:$userid, review:$review)
      }`, variables:{userid: this.userid, gameid: this.gameid, review: review}  
    }).subscribe(res=>{
      this.route.navigate(['/gamedetail', this.gameid]).then(function(){
        window.location.reload();
      });
    })
  }

  downvote(userid: number, review:string){

    this.apollo.mutate<{downvotereview:string}>({
      mutation:gql`mutation downvotereview($gameid:Int!, $userid:Int!, $review:String!){
        downvotereview(gameid:$gameid, userid:$userid, review:$review)
      }`, variables:{userid: this.userid, gameid: this.gameid, review: review}  
    }).subscribe(res=>{
      this.route.navigate(['/gamedetail', this.gameid]).then(function(){
        window.location.reload();
      });
    })
  }

  addwishlist(gameid:number){
    this.apollo.mutate<{addWishlist:string}>({
      mutation:gql`mutation addWishlist($userid:Int!, $gameid:Int!){
        addWishlist(userid:$userid, gameid:$gameid)
      }`, variables: {gameid: gameid, userid: this.user.id}
    }).subscribe(res=>{
      this.route.navigateByUrl("/wishlist").then(function(){
        window.location.reload();
      });
    })
  }
 
  getLongLatByCountryName(countryName: any): any {
    const c = this.countrydata.find(c => c.countryname === countryName)
    const r = c ? [c?.longitude, c?.latitude] : [];
    return r
  }

  getCount(countryName: any): any {
    const idx = this.uniquecountry.indexOf((uc: any) => uc.country === countryName)
    const count = this.countuserbycountry[idx];
    console.log(this.countuserbycountry)
    console.log("countr" + count);
    return count;
  }

}
