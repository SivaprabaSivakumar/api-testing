import { test, expect } from '@playwright/test';
import { wait } from 'wait-utils';
import { faker } from '@faker-js/faker';
import { Article } from '../../interface/articleInterface';

let authToken: string;

test.beforeAll('run before all', async ({ request }) => {
  const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user": {
        "email": "luckymeeku@gmail.com",
        "password": "lucky2709"
      }
    }
  })
  const tokenResponseJSON = await tokenResponse.json();
  authToken = tokenResponseJSON.user.token;
})


test('Get test tags', async ({ request }) => {
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags');
  const tagResponseJSON = await tagsResponse.json();

  expect(tagsResponse.status()).toEqual(200);
  expect(tagResponseJSON.tags[0]).toEqual('Test');
  expect(tagResponseJSON.tags.length).toBeLessThanOrEqual(10);
});

test('Get articles', async ({ request }) => {
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0');
  const articlesResponseJSON = await articlesResponse.json();

  expect(articlesResponse.status()).toEqual(200);
  expect(articlesResponseJSON.articles.length).toBeLessThanOrEqual(10);
  expect(articlesResponseJSON.articlesCount).toEqual(10);
})

// used faker and interface
test('Get token by login, create and delete article', async ({ request }) => {
  const articleData: Article = {
    title: faker.location.country(),
    description: faker.location.city(),
    body: faker.location.streetAddress(),
    tagList: [
      faker.music.genre()
    ]
  }
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
    data: {
      article: articleData
    }
    , headers: {
      "Authorization": `Token ${authToken}`
    }
  })
  const newArticleResponseJSON = await newArticleResponse.json();

  expect(newArticleResponse.status()).toEqual(201);

  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      "Authorization": `Token ${authToken}`
    }
  });
  const articlesResponseJSON = await articlesResponse.json();

  expect(articlesResponse.status()).toEqual(200);
  const uniqId = articlesResponseJSON.articles[0].slug;

  // await wait(10000)

  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${uniqId}`, {
    headers: {
      "Authorization": `Token ${authToken}`
    }
  })

  expect(deleteArticleResponse.status()).toEqual(204);

})

test('Get token by login, create, update and delete article', async ({ request }) => {
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
    data: {
      "article": {
        "title": "yayyy",
        "description": "yayyy description 2",
        "body": "yayyy body 2",
        "tagList": [
          "yayyyy"
        ]
      }
    }, headers: {
      "Authorization": `Token ${authToken}`
    }
  })

  const newArticleResponseJSON = await newArticleResponse.json();
  // console.log(newArticleResponseJSON)

  expect(newArticleResponse.status()).toEqual(201);

  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      "Authorization": `Token ${authToken}`
    }
  });
  const articlesResponseJSON = await articlesResponse.json();

  expect(articlesResponse.status()).toEqual(200);
  const uniqId = articlesResponseJSON.articles[0].slug;

  // await wait(10000);

  const putArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${uniqId}`, {
    headers: {
      "Authorization": `Token ${authToken}`
    },
    data: {
      "article": {
        "title": "Praba yayyyy",
        "description": "Praba yayyyy description",
        "body": "Praba yayyyy body",
        "tagList": [
          "Praba yayyyy"
        ]
      }
    }
  })
  const putArticleResponseJSON = await putArticleResponse.json();

  expect(putArticleResponse.status()).toEqual(200);

  const updatedUniqId = putArticleResponseJSON.article.slug;

  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${updatedUniqId}`, {
    headers: {
      "Authorization": `Token ${authToken}`
    }
  })
  expect(deleteArticleResponse.status()).toEqual(204);

})
