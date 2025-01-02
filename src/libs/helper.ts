import { API_IMAGE_URL } from '@core/constants'
import { AnyEntity } from '@core/types/base'

class Helper {
  constructor() {}

  public formatFullName(firstName: string, lastName: string): string {
    firstName = firstName.trim().charAt(0).toUpperCase() + firstName.trim().toLowerCase().slice(1)
    lastName = lastName.trim().charAt(0).toUpperCase() + lastName.trim().toLowerCase().slice(1)
    return `${firstName} ${lastName}`
  }

  public convertToSlug(text: string): string {
    const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
    const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')
    return text
      .toString()
      .toLowerCase()
      .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
      .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
      .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
      .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
      .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
      .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
      .replace(/đ/gi, 'd')
      .replace(/\s+/g, '-')
      .replace(p, (c) => b.charAt(a.indexOf(c)))
      .replace(/&/g, '-and-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  }

  public wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  public removeKeyHaveNull(
    obj: { [x: string]: AnyEntity },
    keys: string[],
  ): { [x: string]: AnyEntity } {
    return keys.reduce((newObj: Record<string, AnyEntity>, key) => {
      let el: { [x: string]: AnyEntity } = {}
      if (obj[key]) {
        el = { [key]: obj[key] }
      }
      return { ...newObj, ...el }
    }, {})
  }

  public searchString = (str: string, search: string): boolean => {
    const isMatch = str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .includes(search.toLowerCase())
    return isMatch
  }

  public deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.lunas.vn`
  }

  public getCookie = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
  }

  public getImageUrl = (key: string) => `${API_IMAGE_URL}/${key}`
}

const helper = new Helper()

export { helper }
