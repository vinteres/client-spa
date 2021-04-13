import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { CHttp } from './chttp.service'

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(
    private http: CHttp
  ) { }

  getNextCard() {
    return this.http.get(environment.api_url + 'card')
  }

  getFriends() {
    return this.http.get(environment.api_url + 'friends')
  }

  sendFriendRequest(targetUserId) {
    return this.http.post(environment.api_url + 'friend_request', { targetUserId })
  }

  cancelFriendRequest(targetUserId) {
    return this.http.post(environment.api_url + 'cancel_friend_request', { targetUserId })
  }

  acceptFriendRequest(targetUserId) {
    return this.http.post(environment.api_url + 'accept_friend_request', { targetUserId })
  }

  declineFriendRequest(targetUserId) {
    return this.http.post(environment.api_url + 'decline_friend_request', { targetUserId })
  }

  unfriend(targetUserId) {
    return this.http.post(environment.api_url + 'unfriend', { targetUserId })
  }
}
