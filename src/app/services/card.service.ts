import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { CHttp } from './chttp.service'

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: CHttp) { }

  getAllUserCards() {
    return this.http.get(environment.api_url + 'cards')
  }

  createCard(text) {
    return this.http.post(environment.api_url + 'card', { text })
  }

  deleteCard(id) {
    return this.http.delete(environment.api_url + `card/${id}`)
  }

}
