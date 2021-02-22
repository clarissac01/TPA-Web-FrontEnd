import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-gamedetail',
  templateUrl: './gamedetail.component.html',
  styleUrls: ['./gamedetail.component.scss']
})
export class GamedetailComponent implements OnInit {

  ageForm = this.fb.group({
    age: ['', Validators.required]
  });

  input = "";

  currslide = 0;

  result:any[] = [];
  gameslideshow:any[]=[];
  promo:any;
  gameitem:any[]=[];
  gametag:any[]=[];
  detail:any;
  mature=false;

  keyword = "";

  game:any;

  gameid = 0;

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.router.params.subscribe(params => {
      this.gameid = params['id'];
      this.init(this.gameid);
      this.autoNext();
    });
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
          link
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
    setInterval(() => this.updateslide(this.currslide+1), 2000);
  }

  addtocart(){
    
  }

}
