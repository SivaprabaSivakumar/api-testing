import { test } from '../utils/fixtures';
import { expect } from '../utils/custom-expect';

let authToken: string;

test.beforeAll('run before all', async ({ api }) => {
    const tokenResponse = await api
        .path('/users/login')
        .body({
            "user": {
                "email": "luckymeeku@gmail.com",
                "password": "lucky2709"
            }
        })
        .postRequest(200)
    authToken = 'Token ' + tokenResponse.user.token;
})

// default url passed in fixture
test('first test', async ({ api }) => {
    api
        // .url('https://conduit-api.bondaracademy.com/api')
        .path('/articles')
        .param({ limit: 10, offset: 0 })
        .headers({ Authorization: 'authToken ' })
        .body({
            "user": {
                "email": "luckymeeku@gmail.com",
                "password": "lucky2709"
            }
        })



})

// test('logger', () => {
//     const logger = new APILogger();
//     logger.logRequest('GET', 'https://conduit-api.bondaracademy.com/api/articlesxx', { Authorization: 'token' });
//     logger.logResponse(200, { articles: [] });
//     const logs = logger.getRecentLogs();
//     console.log(logs)
// })

test('Get articles', async ({ api }) => {
    const response = await api
        .path('/articles')
        .param({ limit: 10, offset: 0 })
        .getRequest(200)
    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).shouldEqual(10);
})

test('Get test tags', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200)
    expect(response.tags[0]).shouldEqual('Test');
    expect(response.tags.length).shouldBeLessThanOrEqual(10);
})
test('Get token by login, create and delete article', async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles')
        .body({
            "article": {
                "title": "yayyy", "description": "yayyy description 2", "body": "yayyy body 2", "tagList": ["yayyyy"]
            }
        })
        .headers({ Authorization: authToken })
        .postRequest(201)

    expect(createArticleResponse.article.title).shouldEqual('yayyy')
    const uniqId = createArticleResponse.article.slug;

    const getArticle = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .param({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(getArticle.articles[0].title).shouldEqual('yayyy')

    await api
        .path(`/articles/${uniqId}`)
        .headers({ Authorization: authToken })
        .deleteRequest(204)

    const getArticleTwo = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .param({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(getArticleTwo.articles[0].title).not.shouldEqual('yayyy')


})

test('Get token by login, create, update and delete article', async ({ api }) => {

    const createArticleResponse = await api
        .path('/articles')
        .body({
            "article": {
                "title": "yayyy", "description": "yayyy description 2", "body": "yayyy body 2", "tagList": ["yayyyy"]
            }
        })
        .headers({ Authorization: authToken })
        .postRequest(201)

    expect(createArticleResponse.article.title).shouldEqual('yayyy')
    const uniqId = createArticleResponse.article.slug;

    const updateArticleResponse = await api
        .path(`/articles/${uniqId}`)
        .headers({ Authorization: authToken })
        .body({
            "article": {
                "title": "Praba yayyyy", "description": "Praba yayyyy description", "body": "Praba yayyyy body", "tagList": ["Praba yayyyy"]
            }
        })
        .putRequest(200)

    expect(updateArticleResponse.article.title).shouldEqual('Praba yayyyy')
    const uniqId2 = updateArticleResponse.article.slug;

    const getArticle = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .param({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(getArticle.articles[0].title).shouldEqual('Praba yayyyy')


    await api
        .path(`/articles/${uniqId2}`)
        .headers({ Authorization: authToken })
        .deleteRequest(204)

    const getArticleTwo = await api
        .path('/articles')
        .headers({ Authorization: authToken })
        .param({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(getArticleTwo.articles[0].title).not.shouldEqual('Praba yayyyy')


})
