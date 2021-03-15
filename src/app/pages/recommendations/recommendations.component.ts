import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {


  game:any[] = []

  constructor(private apollo:Apollo, private route:Router, private sanitizer:DomSanitizer, private router:ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.apollo.query<{recommendedgames:any}>({
      query:gql`query recommendedgames{
        recommendedgames{
          id
          banner
          name
          createdAt
          price
        }
      }`
    }).subscribe(res=>{
      this.game = res.data?.recommendedgames
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
