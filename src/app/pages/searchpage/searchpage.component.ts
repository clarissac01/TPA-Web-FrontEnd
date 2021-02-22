import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-searchpage',
  templateUrl: './searchpage.component.html',
  styleUrls: ['./searchpage.component.scss']
})
export class SearchpageComponent implements OnInit {

  kw = "";
  gameresult:any[] = [];
  result:any[] = [];
  input = "";
  keyword = "";

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.router.params.subscribe(params=>{
      this.kw = params['search'];
    })
  }

  init(query:string){
    this.apollo.query<{searchGame:any}>({
      query:gql`query searchGame($keyword:String!){
        searchGame(keyword:$keyword){
          id
          name
          banner
          price
        }
      }`, variables: {keyword: this.kw}
    }).subscribe(res=>{
      this.gameresult = res.data?.searchGame;
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


}

