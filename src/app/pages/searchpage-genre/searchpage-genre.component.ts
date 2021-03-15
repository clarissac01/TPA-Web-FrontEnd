import { stringify } from '@angular/compiler/src/util';
import { Component, EventEmitter, HostListener, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-searchpage-genre',
  templateUrl: './searchpage-genre.component.html',
  styleUrls: ['./searchpage-genre.component.scss']
})
export class SearchpageGenreComponent implements OnInit {

  kw = "";
  gameresult:any[] = [];
  result:any[] = [];
  genrelist:any[] = [];
  catlist:any[] = [];
  fandrlist:any[] = [];
  communitylist: any[] = [];
  sofferlist: any[] = [];

  input = "";
  keyword = "";
  slider = 1000000;
  max = 1;
  countgame = 10;
  filterprice = false;
  filtergenre = false;
  pricefilteramount = 0;
  fetchgames = new EventEmitter();
  genrechoosed = "";
  genreactive = false;
  catchoosed = "";

  pricefilter = "Any Price";

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

  getCategory(){
    this.apollo.query<{filtergamebyfandr:any}>({
      query:gql`query filtergamebyfandr($keyword:String!, $countGame:Int!){
        filtergamebyfandr(keyword:$keyword, countGame:$countGame){
          id
          name
          banner
          price
          createdAt
        }
      }`, variables: {keyword: this.kw, countGame: 10}
    }).subscribe(res=>{
      this.fandrlist = res.data?.filtergamebyfandr;
    });
    this.apollo.query<{filtergamebySpecialOffer:any}>({
      query:gql`query filtergamebySpecialOffer($keyword:String!, $countGame:Int!){
        filtergamebySpecialOffer(keyword:$keyword, countGame:$countGame){
          id
          name
          price
          banner
          createdAt
        }
      }`, variables: {keyword: this.kw, countGame: 10}
    }).subscribe(res=>{
      this.sofferlist = res.data?.filtergamebySpecialOffer;
      console.log(this.sofferlist.length);
    });
    this.apollo.query<{filtergamebyCommunityRec:any}>({
      query:gql`query filtergamebyCommunityRec($keyword:String!, $countGame:Int!){
        filtergamebyCommunityRec(keyword:$keyword, countGame:$countGame){
          id
          name
          price
          banner
          createdAt
        }
      }`, variables: {keyword: this.kw, countGame: 0}
    }).subscribe(res=>{
      this.communitylist = res.data?.filtergamebyCommunityRec;
    });
  
  }

  ngOnInit(): void {
    this.router.params.subscribe(params=>{
      this.genrechoosed = params['genre'];
      this.init(this.kw, this.countgame);
      this.apollo.query<{getGameGenre:any}>({
        query:gql`query getGameGenre($keyword:String!){
          getGameGenre(keyword:$keyword){
            tagname
          }
        }`, variables: {keyword: this.kw}
      }).subscribe(res=>{
        this.genrelist = res.data?.getGameGenre;
        for (let index = 0; index < this.genrelist.length; index++) {
          console.log("Ada kok "+this.genrelist[index].tagname);
        }
      })
    });
    this.getCategory();
    this.fetchgames.pipe(debounceTime(500)).subscribe(() => {
      console.log('a');
      if(this.filterprice == true){
        this.countgame+=10;
        this.filterbyPrice(this.pricefilteramount);
      }
      else{
        this.countgame += 10;
        this.init(this.kw, this.countgame);
      }
    })
  
    this.fetchgames.emit();
  }

  init(kw:string, countGame: number){
    this.filtergenre = false;
    this.apollo.query<{filtergamebyGenre:any}>({
      query:gql`query filtergamebyGenre($genre:String!, $keyword:String!, $countGame:Int!){
        filtergamebyGenre(genre:$genre, keyword:$keyword, countGame:$countGame){
          id
          name
          banner
          price
          createdAt
        }
      }`, variables: {genre: this.genrechoosed, keyword: kw, countGame: countGame}
    }).subscribe(res=>{
      this.gameresult = res.data?.filtergamebyGenre;
      for (let index = 0; index < this.gameresult.length; index++) {
        if(this.max < this.gameresult[index].price){
          this.max = this.gameresult[index].price;
          this.slider = this.max;
          console.log(this.gameresult[index].name);
        }
      }
    })
  }

  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  inputGiven(e: EventTarget | null){
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
        console.log(this.result.length);
      })
    }else{
      this.result = [];
      console.log(this.result.length);
    }
  }

  searchthis(){
    if(this.result.length > 0){
      this.route.navigate(["/search", this.input]);
    }
  }

  detail(id:number){
    this.route.navigate(["/gamedetail", id]);
  }

  filterbyPrice(price:number){
    this.filtergenre = false;
    this.pricefilteramount = price;
    if(this.filterprice == false){
      this.filterprice = true;
      this.countgame = 10;
    }
    else this.countgame += 10;
    console.log(this.kw);
    this.apollo.query<{filtergamebyGenre:any}>({
      query:gql`query filtergenrebyPrice($genre:String!, $price:Int!, $countGame:Int!){
        filtergenrebyPrice($genre:genre, $price:price, $countGame:countGame){
          id
          name
          price
          banner
          createdAt
        }
      }`, variables: {genre: this.genrechoosed, price: price, countGame: this.countgame}
    }).subscribe(res=>{
      this.gameresult = res.data?.filtergamebyGenre;
    })
  }

  sliderChanged(e:EventTarget | null){
    console.log(this.slider);
    if(this.slider == 0){
      this.pricefilter = 'Free';
      this.filterbyPrice(this.slider);
      return;
    }else if(this.slider == this.max){
      this.pricefilter = 'Any Price';
      this.filterbyPrice(this.slider);
      return;
    }
    this.filterbyPrice(this.slider);
    this.pricefilter = "Under Rp " + this.slider.toString();
  }

  @HostListener('window:scroll') 
  scrollHandler(e: Event | null) {

    if( Math.round(window.scrollY + window.innerHeight) >= document.body.clientHeight - 1){
      this.fetchgames.emit();
    }
  }

  filterbyGenre(genre: String){
    console.log(this.kw);
    this.apollo.query<{filtergamebyGenre:any}>({
      query:gql`query filtergamebyGenre($genre:String!, $keyword:String!, $countGame:Int!){
        filtergamebyGenre(genre:$genre, keyword:$keyword, countGame:$countGame){
          id
          name
          banner
          price
          createdAt
        }
      }`, variables: {genre: this.genrechoosed, keyword: this.kw, countGame: this.countgame}
    }).subscribe(res=>{
      this.gameresult = res.data?.filtergamebyGenre;
      for (let index = 0; index < this.gameresult.length; index++) {
        console.log(this.gameresult[index].name);
      }
    })
  }

  genreChanged(e: EventTarget | null){
   if(this.filterprice == true){
     this.filterprice = false;
     this.countgame = 10;
   }
   if(this.filtergenre == false){
     this.filtergenre = true;
   }
   this.filterbyGenre(this.genrechoosed);
  }

  categoryChanged(e:EventTarget | null){
    if(this.catchoosed == 'Featured and Recommended'){
      this.gameresult = this.fandrlist;
    }
    else if(this.catchoosed == 'Special Offer'){
      this.gameresult = this.sofferlist;
    }else{
      this.gameresult = this.communitylist;
    }
  }

}
