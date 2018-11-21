export interface ESearch {
    took: number,
    timed_out: boolean,
    hits: {
        max_score: number,
        total: number,
        hits: [
            {
                _id: string,
                _index: string,
                _score: number,
                _type: string,
                _source: object
            }
        ]
    }
    _shards: {
        failed: number,
        skipped: number,
        successful: number,
        total: number
    }
}

export interface MESearch {
    responses: [ESearch]
}