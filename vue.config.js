// vue.config.js
module.exports = {
    filenameHashing: false,
    productionSourceMap: false,
    lintOnSave: false,
    chainWebpack: config => {
        config.module.rules.delete('eslint');
    }
}