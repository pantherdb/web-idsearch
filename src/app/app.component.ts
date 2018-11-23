import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { IdsearchService } from './idsearch.service';
import { ESearch, MESearch } from './idsearch';


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

  constructor(public idsearch : IdsearchService) {}

  ngOnInit() {
  }

  onSearchChange(search_query: string) {
    this.$options = this.idsearch.search(search_query);
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
      this.mappedIds = [];
      for(let i = 0; i < data.responses.length; i++) {
//        console.log({ original: ids[i], mapped: data.responses[i].hits.hits[0] });
        // we know that we'll have only 1 hit / query
        this.mappedIds.push({ original: ids[i], mapped: data.responses[i].hits.hits[0] });
      }
    })
  }

  nbMapped() {
    let count = 0;
    for(let result of this.mappedIds) {
      if(result.mapped) count++;
    }
    return count;
  }
}
