import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WorldleService {

    constructor(private _http: HttpClient) {}

    public getAllWords() {
        return this._http.get<any>('http://localhost:3000/words');
    }

    public getRandomWord(randomId: number) {
        return this._http.get<any>('http://localhost:3000/words/' + randomId);
    }
}