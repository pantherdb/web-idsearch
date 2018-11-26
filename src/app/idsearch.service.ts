import { Injectable, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {map, startWith} from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

import { ESearch, MESearch } from './idsearch';

@Injectable({
  providedIn: 'root'
})
export class IdsearchService {

  // url = "https://search-panther-eb636tdq5a6sm5oeu7pi5ldtpe.us-west-1.es.amazonaws.com";
  url = "http://localhost:9200";
  max_results = 30;

  constructor(private httpClient: HttpClient) {}

  search(value: string): Observable<ESearch> {
    return this.httpClient.get<ESearch>(this.url + "/id/mapping/_search?q=" + value + "&size=" + this.max_results);
  }

  multipleSearch(params) {
    let query = "";

    for(let param of params) {
      if(!param.query_string || param.query_string.length == 0 || !param.taxon_id)
        continue;

      query += "{\"index\" : \"id\"}\n" +
               "{ \"id\": \"t_search_key_taxon\", \"params\": { \"query_string\": \"" + param.query_string.toLowerCase() + "\", \"taxon_id\": " + param.taxon_id + "} }\n"
    }
    
//    console.log("idsearch: ", query);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.httpClient.post<MESearch>(this.url + "/_msearch/template", query, httpOptions);
  }

 
}
