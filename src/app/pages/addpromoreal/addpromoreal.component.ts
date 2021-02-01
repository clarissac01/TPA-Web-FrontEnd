import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-addpromoreal',
  templateUrl: './addpromoreal.component.html',
  styleUrls: ['./addpromoreal.component.scss']
})
export class AddpromorealComponent implements OnInit {

  constructor(private router:ActivatedRoute, private apollo:Apollo, private fb: FormBuilder, private sanitizer:DomSanitizer, private route:Router) { }

  gameid = 0;
  game:any;
  banner:any;
  games:any;
  title = "";
  price = 0;
  desc = "";
  gamedetail:any;

  addpromoForm = this.fb.group({
    discount: ['', Validators.required],
    validto: ['', Validators.required]
  });

  ngOnInit(): void {
    this.login();
    this.router.params.subscribe(params => {
      this.gameid = params['id'];
      this.init(this.gameid);
      console.log(this.gameid);
    });
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
      this.games = res.data?.getGame;
      this.title = this.games.name;
      this.price = this.games.price;
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
      this.desc = this.gamedetail.description;
    });
  }

  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  addpromo(){
    if(this.addpromoForm.valid){
      this.apollo.mutate<{addpromo:any}>({
        mutation:gql`mutation addpromo($id:Int!, $discount:Int!, $validTo:Time!){
          addpromo(id:$id, discount:$discount, validTo:$validTo)
        }`, variables: {id: this.gameid, discount: this.addpromoForm.value.discount, validTo: new Date(this.addpromoForm.value.validto)}
      }).subscribe(res=>{
        this.route.navigateByUrl("/managepromo").then(function(){
          window.location.reload();
        });
      })
    }
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
