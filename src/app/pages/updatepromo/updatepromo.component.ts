import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-updatepromo',
  templateUrl: './updatepromo.component.html',
  styleUrls: ['./updatepromo.component.scss']
})
export class UpdatepromoComponent implements OnInit {

  constructor(private router:ActivatedRoute, private apollo:Apollo, private fb: FormBuilder, private sanitizer:DomSanitizer, private route:Router) { }

  gameid = 0;
  game:any;
  banner:any;
  games:any;
  title = "";
  price = 0;
  promo:any;

  updatepromoForm = this.fb.group({
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
    this.apollo.query<{getPromobyId:any}>({
      query:gql`query getpromobyid($id:Int!){
        getPromobyId(id:$id){
          discount
          validTo
        }
      }`, variables: {id: this.gameid}
    }).subscribe(res=>{
      this.promo = res.data?.getPromobyId;
      this.updatepromoForm.controls.discount.setValue(this.promo.discount);
      this.updatepromoForm.controls.validto.setValue(this.promo.validTo);
    })
  }

  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  updatepromo(){
    if(this.updatepromoForm.valid){
      this.apollo.mutate<{updatepromo:any}>({
        mutation:gql`mutation updatepromo($id:Int!, $discount:Int!, $validTo:Time!){
          updatepromo(id:$id, discount:$discount, validTo:$validTo)
        }`, variables: {id: this.gameid, discount: this.updatepromoForm.value.discount, validTo: this.updatepromoForm.value.validto}
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
