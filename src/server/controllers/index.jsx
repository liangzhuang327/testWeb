import Router from 'koa-router'

import env from '../env'

const doFetch = function (url) {
  const options = genFetchOptions('get');
  return fetch(url, options)
    .then(toJSON, catchException)
    .then(json => {
      return {
        code: 200,
        data: json
      }
    })
}

const router = Router()

router.get('/', async function (ctx) {
  ctx.render({
    title: '测试'
  });
});


export default router
