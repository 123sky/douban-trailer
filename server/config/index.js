export default {
  qiniu: {
    base:
      process.env.NODE_ENV === 'production'
        ? 'http://ppbdn99ie.bkt.clouddn.com'
        : 'http://ppopiaif8.bkt.clouddn.com',
    bucket:
      process.env.NODE_ENV === 'production'
        ? 'douban-trailer'
        : 'douban-trailer-test',
    AK: '3L04pbjnkwSCV5J5qD6Klf-ocdK4p__43Syet4QE',
    SK: 'JMlK_p-_CB4g7lxwV9OBQFjneOrvvPRtwxaojTiZ'
  }
}
