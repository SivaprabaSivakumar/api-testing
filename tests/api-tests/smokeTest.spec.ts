import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom-expect';
import articleRequestPayload from '../../request-objects/POST-article.json';
import { ar, faker } from '@faker-js/faker';
import { getRandomArticle } from '../../utils/data-generator';
import { wait } from 'wait-utils';

// let authToken: string;

// test.beforeAll('run before all', async ({ api, config }) => {
//     //commented this because using helper function to create token
//     // const tokenResponse = await api
//     //     .path('/users/login')
//     //     .body({
//     //         "user": {
//     //             "email": config.userEmail,
//     //             "password": config.userPassword
//     //         }
//     //     })
//     //     .postRequest(200)
//     //authToken = 'Token ' + tokenResponse.user.token;
//     //used this validate env passed or not
//     //console.log(tokenResponse.user)

//     //simple way to pass the 1st function from helper
//     //authToken = await createToken(api, config.userEmail, config.userPassword);

//     // 2nd function from helper
//     authToken = await createToken(config.userEmail, config.userPassword);


// })

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

test('Get articles', async ({ api }) => {
    const response = await api
        .path('/articles')
        .param({ limit: 10, offset: 0 })
        .getRequest(200)
    await expect(response).shouldMatchSchema('articles', 'GET_articles')
    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).shouldEqual(10);
})

test('Get test tags', async ({ api }) => {
    const response = await api
        .path('/tags')
        .getRequest(200)
    await expect(response).shouldMatchSchema('tags', 'GET_tags')//, true) // true to create new schema, remove it after schema is created
    expect(response.tags[0]).shouldEqual('Test');
    expect(response.tags.length).shouldBeLessThanOrEqual(10);
})

test('Create, get and delete article', async ({ api }) => {
    const articleRequest = getRandomArticle()
    const createArticleResponse = await api
        .path('/articles')
        .body(articleRequest)
        .postRequest(201)
    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles')
    expect(createArticleResponse.article.title).shouldEqual(articleRequest.article.title)
    const uniqId = createArticleResponse.article.slug;

    const getArticle = await api
        .path('/articles')
        .param({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(getArticle.articles[0].title).shouldEqual(articleRequest.article.title)

    await api
        .path(`/articles/${uniqId}`)
        .deleteRequest(204)

    const getArticleTwo = await api
        .path('/articles')
        .param({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(getArticleTwo.articles[0].title).not.shouldEqual(articleRequest.article.title)


})

test('Get token by login, create, update and delete article', async ({ api }) => {
    const articleRequest = getRandomArticle()
    const createArticleResponse = await api
        .path('/articles')
        .body(articleRequest)
        .postRequest(201)
    expect(createArticleResponse.article.title).shouldEqual(articleRequest.article.title)
    const uniqId = createArticleResponse.article.slug;

    articleRequest.article.title = `${articleRequest.article.title} updated`;

    const updateArticleResponse = await api
        .path(`/articles/${uniqId}`)
        .body(articleRequest)
        .putRequest(200)

    expect(updateArticleResponse.article.title).shouldEqual(articleRequest.article.title)
    const uniqId2 = updateArticleResponse.article.slug;

    const getArticle = await api
        .path('/articles')
        .param({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(getArticle.articles[0].title).shouldEqual(articleRequest.article.title)

    await api
        .path(`/articles/${uniqId2}`)
        .deleteRequest(204)

    const getArticleTwo = await api
        .path('/articles')
        .param({ limit: 10, offset: 0 })
        .getRequest(200)

    expect(getArticleTwo.articles[0].title).not.shouldEqual(articleRequest.article.title)
})