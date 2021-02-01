import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-managepromo',
  templateUrl: './managepromo.component.html',
  styleUrls: ['./managepromo.component.scss']
})
export class ManagepromoComponent implements OnInit {

  currpage = 1;
  totalpage = 0;
  games:any[] = [];
  showngames:any[] = [];
  promos:any[] = [];
  promoids:number[]=[];

  constructor(private apollo:Apollo, private router:Router, private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.login();
    this.init();
  }

  init(){
    this.apollo.query<{getPromo:any}>({
      query:gql`query getallpromo{
        getPromo{
          gameid,
          discount,
          validTo
        }
      }`
    }).subscribe(res=>{
      this.promos = res.data?.getPromo;
      console.log(this.promos.length);
      for (let index = 0; index < this.promos.length; index++) {
        this.promoids.push(this.promos[index].gameid);
        if (this.promoids.length%6==0){
          this.totalpage = this.promoids.length/6;
        }else{
          this.totalpage = Math.floor((this.promoids.length/6));
        }
      }
      for (let index = 0; index < this.promoids.length; index++) {
        this.apollo.query<{getGame:any}>({
          query:gql`query getgame($id: Int!) {
            getGame(id: $id) {
              id
              name
              price
              banner
            }
          }`, variables: {id: this.promoids[index]}
        }).subscribe(res=>{
          this.games.push(res.data?.getGame);
          this.initpage();
        });
      }
    });
    console.log(this.games.length);
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

  prevpage(){
    this.currpage --;
    this.initpage();
  }

  nextpage(){
    this.currpage++;
    this.initpage();
  }

  addpromo(){
    this.router.navigateByUrl("/addpromopage");  
  }

  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  update(id:number){
    this.router.navigate(["/updatepromo", id]);
  }
  
  deletepromo(id:number){
    this.router.navigate(["/deletepromo", id]);
  }

  initpage(){
    this.showngames = [];
    for (let index = (this.currpage-1)*6; index < ((this.currpage-1)*6) + 6 ; index++) {
      if(this.games[index]!=null){
        this.showngames.push(this.games[index]);
        // console.log("hello");
      }
    }
  }

}
