
export default class MesaFile {
  constructor(file) {
    this.file = file
  }

  get id() {
    return this.file.id
  }

  get name() {
    return this.file.file
  }

  get size() {
    return this.file.size
  }

  get type() {
    return this.file.contentType
  }

  get data() {
    return this.file.data
  }

  set url(url) {
    this._url = url
    return this
  }

  get url() {
    return this._url
  }
  
  get contentType() {
    return this.file.contentType
  }

  async fetchUrl(promise) {
    const url = await promise
    this._url = url
    return this
  }
}