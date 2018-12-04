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
  // url = "https://search-panther-test-bnobkola4aq5kwqv43zv7sc5ky.us-west-1.es.amazonaws.com";
  // url = "https://search-panther-eb636tdq5a6sm5oeu7pi5ldtpe.us-west-1.es.amazonaws.com";
  // url = "http://13.52.80.142:9200";
  // url = "http://localhost:9200";

  // url = "https://search-panther-test-bnobkola4aq5kwqv43zv7sc5ky.us-west-1.es.amazonaws.com";
  url = "https://search.geneontology.cloud";
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
    
  //  console.log("idsearch: ", query);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.httpClient.post<MESearch>(this.url + "/_msearch/template", query, httpOptions);
  }

  multipleSearchV2(params) {
    let query = `
    {
      "_source": { "excludes": ["all", "any"] },
      "query": {
        "terms": {    
          "any": [`;

    for(let param of params) {
      if(!param.query_string || param.query_string.length == 0 || !param.taxon_id)
        continue;

        query += "\"" + param.query_string.toLowerCase() + "\", "
    }

    query = query.substring(0, query.length - 2);

    query += ` ]
          }
        },
        "highlight": {
          "number_of_fragments": 3,
          "fragment_size": 150,
          "fields": {
            "any": { "pre_tags": ["<em>"], "post_tags": ["</em>"] }
          }
        }
      }
    }
    `
    console.log(query);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.httpClient.post<MESearch>(this.url + "/id/mapping/_search", query, httpOptions);
  }

 
}
