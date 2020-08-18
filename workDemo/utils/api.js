import {http} from "./http.js"
const products = (data={}) => {
  return http({
    url:"/products",
    data
  })
}

const login = (data={}) => {
  return http({
    url:"/login",
    method:"post",
    data
  })
}

export{
  products,
  login
}