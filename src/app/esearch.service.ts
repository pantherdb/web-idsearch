import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {map, startWith} from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

import { Client } from 'elasticsearch-browser';
import { ESearch, MESearch } from './idsearch';

@Injectable({
  providedIn: 'root'
})
export class EsearchService {
  
  private client: Client;

  constructor() { 
    this.connect();
  }

  private connect() {
    this.client = new Client({
      host: 'http://localhost:9200',
      log: 'trace'
    });


    this.client.ping({
      requestTimeout: Infinity,
      body: 'hello JavaSampleApproach!'
    });

  }
  
  isAvailable(): any {
    return this.client.ping({
      requestTimeout: Infinity,
      body: 'hello grokonez!'
    });
  }

  simpleSearch(query) {
    return this.client.search({
      q: query
    });
  }

  dslSearch(index, type, body, size = 10) {
    return this.client.search({
      index: index,
      type: type,
      size: size,
      body: body
    });
  }

  multipleSearch(body) {
    return this.client.msearch({
      body: body
    })
  }

  fullTextSearch(_index, _type, _field, _queryText): any {
    return this.client.search({
      index: _index,
      type: _type,
      filterPath: ['hits.hits._source', 'hits.total', '_scroll_id'],
      body: {
        'query': {
          'match_phrase_prefix': {
            [_field]: _queryText,
          }
        }
      },
      // response for each document with only 'fullname' and 'address' fields
      '_source': ['fullname', 'address']
    });
  }  

}


