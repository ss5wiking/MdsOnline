import api from '@/api'
import _fetch from '@/service/fetch.js'

//全局变量
Object.defineProperties(global, {
    api: { value: api },
    wx: { value: window.wx },
    _fetch:{value:_fetch},
    neplayer:{value:window.neplayer}
  });