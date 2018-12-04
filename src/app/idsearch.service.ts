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

  url = "https://search.geneontology.cloud";
  // url = "http://localhost:9200";
  max_results = 100;

  constructor(private httpClient: HttpClient) {}

  /**
   * Performs a single search (autocomplete) with E.Search using provided keywords
   * @param keywords : keywords for the search. Spaces between terms are interpreted as AND operations
   * @param max_results : maximum number of results to return
   */
  search(keywords: string, max_results = this.max_results): Observable<ESearch> {
    let preparedKeys = keywords.trim();
    if(preparedKeys.indexOf(" ") != -1) {
      preparedKeys = keywords.split(" ").join(" AND ");
    }
    return this.httpClient.get<ESearch>(this.url + "/id/mapping/_search?q=" + preparedKeys + "&size=" + max_results);
  }

  /**
   * Performs a multiple IDs search using E.Search _msearch on template
   * @param params : must be an array with each element containing a JSON object with a query_string (the keyword) and a taxon_id field
   */
  multipleSearch(params) {
    let query = "";

    for(let param of params) {
      if(!param.query_string || param.query_string.length == 0 || !param.taxon_id)
        continue;

      query += "{\"index\" : \"id\"}\n" +
               "{ \"id\": \"t_search_key_taxon\", \"params\": { \"query_string\": \"" + param.query_string.toLowerCase() + "\", \"taxon_id\": " + param.taxon_id + "} }\n"
    }
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.httpClient.post<MESearch>(this.url + "/_msearch/template", query, httpOptions);
  }

  /**
   * FOR TESTS ONLY: testing the elasticsearch.js library
   * @param params 
   */
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
