const processENV = process.env.ENV
const env = processENV || 'prod'
console.log('Test env is : ', env)

const config = {
    baseURL: 'https://conduit-api.bondaracademy.com/api',
    userEmail: 'pwtest@test.com',
    userPassword: 'Welcome2'
}

if (env === 'qa') {
    config.userEmail = 'luckymeeku@gmail.com';
    config.userPassword = 'lucky2709';
}

if (env === 'prod') {
    config.userEmail = 'pwapiuser@test.com';
    config.userPassword = 'Welcome';
}

export { config }