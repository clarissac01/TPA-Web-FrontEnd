import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-newreleases',
  templateUrl: './newreleases.component.html',
  styleUrls: ['./newreleases.component.scss']
})
export class NewreleasesComponent implements OnInit {

  game:any[] = []

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.apollo.query<{newreleasesGames:any}>({
      query:gql`query newreleasesGames{
        newreleasesGames{
          id
          banner
          name
          createdAt
          price
        }
      }`
    }).subscribe(res=>{
      this.game = res.data?.newreleasesGames
    })
  }

  time(a:string):string{
    return new Date(a).toLocaleString().toString()
  }

  getFile(id:number){
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:8080/assets/"+id);
  }

  gotodetail(id:number){
    this.route.navigate(['/gamedetail', id]).then(function(){
      window.location.reload()
    })
  }

}
