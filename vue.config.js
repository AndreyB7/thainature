// vue.config.js
module.exports = {
    filenameHashing: false,
    productionSourceMap: false,
    chainWebpack: config => {
        config.module.rules.delete('eslint');
    }
}