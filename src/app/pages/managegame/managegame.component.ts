import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-managegame',
  templateUrl: './managegame.component.html',
  styleUrls: ['./managegame.component.scss']
})
export class ManagegameComponent implements OnInit {

  currpage = 1;
  totalpage = 0;
  games:any[] = [];
  showngames:any[] = [];

  constructor(private apollo:Apollo, private router:Router, private sanitizer:DomSanitizer) {

  }

  ngOnInit(): void {
    this.login();
    this.apollo.query<{games:any}>({
      query:gql`query getallgames{
        games{
          id
          name
          banner
        }
      }`
    }).subscribe(res=>{
      this.games = res.data?.games;
      if (this.games.length%6==0){
        this.totalpage = this.games.length/6;
      }else{
        this.totalpage = Math.floor((this.games.length/6))+1;
      }
      this.initpage();
      console.log(this.totalpage);
      console.log(this.currpage);
      console.log(this.games.length);
    });
  }

  initpage(){
    this.showngames = [];
    for (let index = (this.currpage-1)*6; index < ((this.currpage-1)*6) + 6 ; index++) {
      if(this.games[index]!=null){
        this.showngames.push(this.games[index]);
      }
    }
  }

  addgame(){
    this.router.navigateByUrl("/addgame");  
  }

  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  update(id:number){
    this.router.navigate(["/updategame", id]);
  }
  
  deletegame(id:number){
    this.router.navigate(["/deletegame", id]);
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

  prevpage(){
    this.currpage --;
    this.initpage();
  }

  nextpage(){
    this.currpage++;
    this.initpage();
  }

  logout(){
    localStorage.removeItem('jwt');
    this.router.navigateByUrl('/steamadmin');
  }

}
