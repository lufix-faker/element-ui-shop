module.exports = {
  configureWebpack: {
    resolve: {
      extensions: [],
      alias: {
        'assets': '@/assets',
        'views': '@/views',
        'components': '@/components',
        'network': '@/network'
      }
    }
  }
}