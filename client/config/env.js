// ENV

// const apiEnv = 'beta';
const apiEnv = 'prod';

export const ENV = {
  prod: {
    host: 'm.haoshiqi.net',
    baseUrl: 'https://m.haoshiqi.net',
    apiBaseUrl: 'https://m.api.haoshiqi.net',
  },
  dev: {
    baseUrl: 'http://m.dev.haoshiqi.net',
    apiBaseUrl: 'http://m.devapi.haoshiqi.net',
  },
  beta: {
    baseUrl: 'http://m.beta.haoshiqi.net',
    apiBaseUrl: 'https://m.betaapi.haoshiqi.net',
  },
  test: {
    baseUrl: 'https://127.0.0.1',
    apiBaseUrl: 'https://m.betaapi.haoshiqi.net',
  },
};

const baseEnv = {
  port: 8001,
  debug: false,
  publicPath: '',
  baseUrl: '',
  apiBaseUrl: '',
};

function createEnv(opts = {}) {
  const { env = 'prod' } = opts;
  return Object.assign({}, baseEnv, ENV[env], opts);
}

// 默认会有个 api 配置，之后会读取 store
const mini = createEnv({
  env: apiEnv,
});

module.exports = mini;
