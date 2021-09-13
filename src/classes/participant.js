export default class Participant {
  constructor(id, userId, mesaId, email, name) {
    this.id = id
    this.userId = userId
    this.mesaId = mesaId
    this.email = email
    this.name = name
    this.user = null
  }

  static fromJson(json) {
    const { id, userId, mesaId, email, name } = json
    return new Participant(id, userId, mesaId, email, name)
  }

  async fetchUser() {
    // TODO: fetch user from firebase
    return {}
  }

}