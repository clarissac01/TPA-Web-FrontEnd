import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

const ADDGAME = gql`
mutation addGame($newGame: NewGame!) {
  addGame(game: $newGame){
    id,
    name,
    price,
    banner,
    createdAt
  }
}
`;

@Component({
  selector: 'app-addgame',
  templateUrl: './addgame.component.html',
  styleUrls: ['./addgame.component.scss']
})
export class AddgameComponent implements OnInit {

  constructor(private apollo:Apollo, private router:Router, private fb: FormBuilder) {

  }

  bannerImage: any | undefined;

  ngOnInit(): void {
    this.login();
  }
  
  addgameForm = this.fb.group({
    title: ['', Validators.required],
    desc: ['', Validators.required],
    price: ['', Validators.required],
    tag: ['', Validators.required],
    banner: ['', Validators.required],
    slideshow: ['', Validators.required],
    developer: ['', Validators.required],
    publisher: ['', Validators.required],
    systemreq: ['', Validators.required],
  });

  addgame(){
    var tags = this.addgameForm.value.tag;
    tags = tags.split(", ");

    var slideshow = this.addgameForm.value.slideshow;
    
    var banner = this.addgameForm.value.banner;
    if(this.addgameForm.valid){
      this.apollo.mutate<{addgame:string}>({
        mutation:gql`mutation gamemutation(
          $title: String!
          $desc: String!
          $price: Int!
          $banner: Upload!
          $slideshow: [Upload!]!
          $tag: [String!]!
          $developer: String!
          $publisher: String!
          $systemreq: String!
        ) {
          addgame(
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
        `, variables: {title: this.addgameForm.value.title, desc: this.addgameForm.value.desc, price: this.addgameForm.value.price, 
        banner: this.addgameForm.value.banner, slideshow: this.addgameForm.value.slideshow, tag: tags, developer: this.addgameForm.value.developer, publisher: this.addgameForm.value.publisher, systemreq: this.addgameForm.value.systemreq}
      }).subscribe(res=>{
        this.router.navigateByUrl("/adminpage").then(function(){
          window.location.reload();
        });
      })
    }
  }

  bannerChange(e: Event){
    const input = e.target as HTMLInputElement;
    const file = input.files?.item(0);
    this.addgameForm.controls.banner.setValue(file);
  }

  slideshowChange(e: Event){
    const files = [];
    const input = e.target as HTMLInputElement;
    for (let index = 0; index < (input.files?.length??0); index++) {
      files.push(input.files?.item(index));
    }
    this.addgameForm.controls.slideshow.setValue(files);
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
          this.router.navigateByUrl("/")
        }
      })
    }else{
      this.router.navigateByUrl("/")
    }
  }
  
  logout(){
    localStorage.removeItem('jwt');
    this.router.navigateByUrl('/steamadmin');
  }

}
