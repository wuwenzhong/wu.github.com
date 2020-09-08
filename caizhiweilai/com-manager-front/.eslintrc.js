module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'generator-star-spacing': 0,
    'space-before-function-paren': 0,
    'eol-last': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent' : "off",
    'template-curly-spacing' : "off",
    "no-callback-literal": 0, // callback回调
    "no-unused-vars": 0, // 定义了变量后面赋值 仍抛错
    "no-tabs": "off", // tab空格
    "eqeqeq": ["off"], // == and ===
  }
}
