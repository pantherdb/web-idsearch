import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { IdsearchService } from './idsearch.service';
import { ESearch, MESearch } from './idsearch';
import { EsearchService } from './esearch.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  $options: Observable<ESearch>;

  search_query: string;

  constructor(public idsearch : IdsearchService,
              private esearch : EsearchService,
              private cd: ChangeDetectorRef) {}

  status: string = "N/A";
  isConnected: boolean = false;

  ngOnInit() {
    this.esearch.isAvailable().then(() => {
      this.status = 'OK';
      this.isConnected = true;
    }, error => {
      this.status = 'ERROR';
      this.isConnected = false;
      console.error('Server is down', error);
    }).then(() => {
      this.cd.detectChanges();
    });
  }

  onSearchChange(search_query: string) {
    this.$options = this.idsearch.search(search_query);
    // this.$options.subscribe(data => {
    //   for(let hit of data.hits.hits) {
    //   console.log(hit._source);
    //   }
    // })

    // this.esearch.search(search_query)
    // .then(body => {
    //   var hits = body.hits.hits;
    //   for(let hit of hits) {
    //     console.log(hit);
    //   }
    // })
  }


  taxons = [
    {value: '9606', viewValue: 'Human'},
    {value: '10090', viewValue: 'Mouse'},
    {value: '10116', viewValue: 'Rat'}
  ];

  selected_taxon = this.taxons[0];

  changeTaxon(value) {
    this.selected_taxon = value;
  }

  mappedIds;
  map(mapids) {
    // console.log(mapids);

    let ids = mapids.split("\n");
    let params = [];
    for(let id of ids) {
      params.push({ query_string: id, taxon_id: this.selected_taxon.value });
    }

    this.idsearch.multipleSearch(params)
    .subscribe(data => {
      console.log(data);
      this.mappedIds = [];
      for(let i = 0; i < data.responses.length; i++) {
//        console.log({ original: ids[i], mapped: data.responses[i].hits.hits[0] });
        // we know that we'll have only 1 hit / query
        this.mappedIds.push({ original: ids[i], mapped: data.responses[i].hits.hits[0] });
      }
    })

//     let body = "[";
//     for(let id of ids) {
//       body += `{ \"index\": \"id\", \"type\": \"mapping\" },
//                { \"query\": \"` + id + `\" },
//                ` 
//     }
//     body = body.substring(0, body.length - 2);
//     body += "]";

//     this.esearch.multipleSearch(body)
//     .then(body => {
//       console.log(body);
//     })

// // this.idsearch.multipleSearchV2(params)
// // .subscribe(data => {
// //   console.log(data);
// //   this.mappedIds = [];
// //   for(let i = 0; i < data.responses.length; i++) {
// // //        console.log({ original: ids[i], mapped: data.responses[i].hits.hits[0] });
// //     // we know that we'll have only 1 hit / query
// //     this.mappedIds.push({ original: ids[i], mapped: data.responses[i].hits.hits[0] });
// //   }
// // })

}

  nbMapped() {
    let count = 0;
    for(let result of this.mappedIds) {
      if(result.mapped) count++;
    }
    return count;
  }
}
