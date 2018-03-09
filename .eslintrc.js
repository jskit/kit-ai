// http://eslint.org/docs/user-guide/configuring

module.exports = {
  "root": true,
  // "parser": "babel-eslint",
  // 请不要修改 extends
  "extends": [
    "airbnb-base",
    // "appx"
  ],

  "globals": {
    "getCurrentPages": false,
    "URL": false,
    "FormData": false
  },

  // check if imports actually resolve
  // 需要安装 eslint-import-resolver-webpack
  "settings": {
    "import/resolver": {
      // "webpack": {
      //   "config": "build/webpack.base.conf.js"
      // }
    }
  },

  // 根据需要修改 rules，详见 http://eslint.org/docs/rules/
  // 推荐的编码风格 https://github.com/airbnb/javascript
  // add your custom rules here
  "rules": {
    // don"t require .vue extension when importing
    "import/extensions": ["error", "always", {
      "js": "never",
      "vue": "never"
    }],
    // allow optionalDependencies
    "import/no-extraneous-dependencies": ["error", {
      // "optionalDependencies": ["test/unit/index.js"]
    }],
    "arrow-body-style": [0],
    "class-methods-use-this": [0],
    "comma-dangle": ["error", "always-multiline"],
    "consistent-return": [0],
    "generator-star-spacing": [0],
    "global-require": [0],
    "import/extensions": [0],
    "import/first": [0],
    "import/no-absolute-path": [0],
    "import/no-duplicates": [0],
    "import/no-dynamic-require": [0],
    "import/no-extraneous-dependencies": [0],
    "import/no-named-as-default-member": [0],
    "import/no-named-as-default": [0],
    "import/no-unresolved": [0],
    "import/prefer-default-export": [0],
    "linebreak-style": [0],
    "no-bitwise": [0],
    "no-cond-assign": [0],
    "no-console": [0],
    "no-continue": 0,
    "no-else-return": [0],
    "no-mixed-operators": [0],
    "no-multi-spaces": ["error", {
      "ignoreEOLComments": true,
    }],
    "no-multiple-empty-lines": ["error", {
      "max": 2,
      "maxEOF": 1,
    }],
    "no-nested-ternary": [0],
    "no-param-reassign": ["error", {
      "props": false,
    }],
    "no-plusplus": ["error", {
      "allowForLoopAfterthoughts": true,
    }],
    "no-restricted-syntax": [0],
    "no-shadow": ["error", {
      "allow": [
        "res",
        "err",
        "cb",
        "state",
        "resolve",
        "reject",
        "done",
      ]
    }],
    "no-unused-vars": ["error", {
      "vars": "all",
      "args": "none",
      "caughtErrors": "none",
      "ignoreRestSiblings": false,
    }],
    "no-use-before-define": [0],
    "no-useless-escape": [0],
    "prefer-template": [0],
    "prefer-arrow-callback": [0],
    "quotes": ["error", "single", {
      "avoidEscape": true,
      "allowTemplateLiterals": true,
    }],
    "require-yield": [1],
    "semi": ["error", "never"],
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "ignore",
      "asyncArrow": "ignore",
    }],
  }
}
