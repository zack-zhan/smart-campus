// 封装cookie文件
import Cookies from 'js-cookie'

export function getCookie (name) {
  return Cookies.get(name)
}

export function setCookie (name, value) {
  const seconds = 1800000
  const time = new Date()
  time.setTime(time.getTime() + seconds * 1000)
  Cookies.set(name, value, {
    expires: time
  })
}

export function removeCookie (name) {
  return Cookies.remove(name)
}
