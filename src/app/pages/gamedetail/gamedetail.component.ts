import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-gamedetail',
  templateUrl: './gamedetail.component.html',
  styleUrls: ['./gamedetail.component.scss']
})
export class GamedetailComponent implements OnInit {

  
  input = "";

  result:any[] = [];
  gameslideshow:any[]=[];
  promo:any;
  gameitem:any[]=[];
  gametag:any[]=[];
  detail:any;

  keyword = "";

  game:any;

  gameid = 0;

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute) { }

  ngOnInit(): void {
    this.router.params.subscribe(params => {
      this.gameid = params['id'];
      this.init(this.gameid);
      console.log(this.gameid);
    });
  }

  init(gameid:number){
    this.apollo.query<{getGame:any}>({
      query:gql`query getgame($id: Int!) {
        getGame(id: $id) {
          name
          price
          banner
        }
      }`, variables: {id: gameid}
    }).subscribe(res=>{
      this.game = res.data?.getGame;
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
      console.log(this.gametag[0]);
    })
  }
  
  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  inputGiven(e: EventTarget | null){
    // const input = e as HTMLInputElement;
    console.log(this.input);
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

}
