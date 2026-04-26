import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });


const processENV = process.env.ENV
const env = processENV || 'qa' //for prod change to prod
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
    // if (!process.env.PROD_USERNAME || !process.env.PROD_PASSWORD) {
    //     throw new Error('PROD_USERNAME or PROD_PASSWORD is not defined');
    // }
    config.userEmail = process.env.PROD_USERNAME as string
    config.userPassword = process.env.PROD_PASSWORD || '';
}

export { config }