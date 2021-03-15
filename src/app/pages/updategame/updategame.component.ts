import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-updategame',
  templateUrl: './updategame.component.html',
  styleUrls: ['./updategame.component.scss']
})
export class UpdategameComponent implements OnInit {

  constructor(private router:ActivatedRoute, private apollo:Apollo, private fb: FormBuilder, private sanitizer:DomSanitizer, private route:Router) { }

  gameid = 0;
  game:any;
  gamedetail:any;
  gametag:any[]=[];
  slideshows:number[] = [];
  gametags="";
  countslide = "";
  banner:any;
  slides:any[]=[];

  ngOnInit(): void {
    this.login();
    this.router.params.subscribe(params => {
      this.gameid = params['id'];
      this.init(this.gameid);
    });
  }

  updategameForm = this.fb.group({
    title: ['', Validators.required],
    desc: ['', Validators.required],
    price: ['', Validators.required],
    tag: ['', Validators.required],
    developer: ['', Validators.required],
    publisher: ['', Validators.required],
    systemreq: ['', Validators.required],
  });

  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  init(gameid:number){
    this.apollo.query<{getGame:any}>({
      query:gql`query getgame($id:Int!){
        getGame(id:$id){
          name
          price
          banner
        }
      }`, variables: {id: this.gameid}
    }).subscribe(res=>{
      console.log(res);
      this.game = res.data?.getGame;
      console.log(this.game.name)
      this.updategameForm.controls.title.setValue(this.game.name);
      this.updategameForm.controls.price.setValue(this.game.price);
      // this.banner = this.getFile(this.game.banner);
      // this.updategameForm.controls.banner.setValue(this.banner);
    });
    this.apollo.query<{getGameDetail:any}>({
      query:gql`query getgamedetail($id: Int!){
        getGameDetail(id:$id){
          description
          developer
          publisher
          systemrequirements
        }
      }`, variables: {id: this.gameid}
    }).subscribe(res=>{
      this.gamedetail = res.data?.getGameDetail;
      this.updategameForm.controls.desc.setValue(this.gamedetail.description);
      this.updategameForm.controls.developer.setValue(this.gamedetail.developer);
      this.updategameForm.controls.publisher.setValue(this.gamedetail.publisher);
      this.updategameForm.controls.systemreq.setValue(this.gamedetail.systemrequirements);
    });
    this.apollo.query<{getGameTags:any}>({
      query:gql`query getgametag($id: Int!){
        getGameTags(id:$id){
          tagname
        }
      }`, variables: {id: this.gameid}
    }).subscribe(res=>{
      this.gametag = res.data?.getGameTags;
      console.log(this.gametag);
      this.gametags = this.gametag.map(gt=>gt.tagname).join(", ");
      this.updategameForm.controls.tag.setValue(this.gametags);
    });
    this.apollo.query<{getGameSlideshows:number[]}>({
      query:gql`query getgameslideshow($id: Int!){
        getGameSlideshows(id:$id){
          link
        }
      }`, variables: {id: this.gameid}
    }).subscribe(res => {
      this.slideshows = res.data?.getGameSlideshows;
      for (let index = 0; index < this.slideshows.length; index++) {
        // this.slides[index] = this.getFile(this.slideshows[index]);
      }
      // this.updategameForm.controls.slideshow.setValue(this.slides);
      this.countslide = this.slideshows.length.toString();
      this.countslide += " files";
    });
  }

  updategame(){
    var tags = this.updategameForm.value.tag;
    tags = tags.split(", ");

    var slideshow = this.updategameForm.value.slideshow;
    
    var banner = this.updategameForm.value.banner;
    if(this.updategameForm.valid){
      this.apollo.mutate<{updategamemutation:string}>({
        mutation:gql`mutation updategamemutation(
          $id: Int!
          $title: String!
          $desc: String!
          $price: Int!
          $banner: Upload 
          $slideshow: [Upload]
          $tag: [String!]!
          $developer: String!
          $publisher: String!
          $systemreq: String!
        ) {
          updategame(
            id: $id
            title: $title
            desc: $desc
            price: $price
            banner: $banner
            slideshow: $slideshow
            tag: $tag
            developer: $developer
            publisher: $publisher
            systemreq: $systemreq
          )
        }        
        `, variables: {id: this.gameid, title: this.updategameForm.value.title, desc: this.updategameForm.value.desc, price: this.updategameForm.value.price, 
        banner: this.updategameForm.value.banner, slideshow: this.updategameForm.value.slideshow, tag: tags, developer: this.updategameForm.value.developer, publisher: this.updategameForm.value.publisher, systemreq: this.updategameForm.value.systemreq}
      }).subscribe(res=>{
        this.route.navigateByUrl("/managegame").then(function(){
          window.location.reload();
        });
      })
      console.log(this.updategameForm.value.title);
    }
  }

  bannerChange(e: Event){
    const input = e.target as HTMLInputElement;
    const file = input.files?.item(0);
    this.updategameForm.controls.banner.setValue(file);
  }

  slideshowChange(e: Event){
    const files = [];
    const input = e.target as HTMLInputElement;
    for (let index = 0; index < (input.files?.length??0); index++) {
      files.push(input.files?.item(index));
    }
    this.updategameForm.controls.slideshow.setValue(files);
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
          }
        }`, variables: {token: jwt}
      }).subscribe(res=>{
        const user = res.data?.auth;
        if(user.id == 1){
          localStorage.setItem("jwt", jwt);
          // this.router.navigateByUrl("/adminpage"); 
        }
        else{
          this.route.navigateByUrl("/")
        }
      })
    }else{
      this.route.navigateByUrl("/")
    }
  }

  logout(){
    localStorage.removeItem('jwt');
    this.route.navigateByUrl('/steamadmin');
  }

}
