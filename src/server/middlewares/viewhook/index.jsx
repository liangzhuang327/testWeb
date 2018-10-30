import React from 'react'
import ReactDOMServer from 'react-dom/server'

import html from './html'
import TestCom from '../../../common/components'

const rebuildPaths = ['/'];

const directNext = function (ctx) {
  if (rebuildPaths.indexOf(ctx.path) > -1)
    return false;
  return true;
}

export default function viewhook(_options = { beautify: true, internals: true }) {
  const options = Object.assign({}, _options)

  return async function (ctx, next) {
    if (directNext(ctx)) {
      await next();
      return;
    }
    ctx.render = function (pageInfo, internals = options.internals || true) {
      const render = internals
        ? ReactDOMServer.renderToString
        : ReactDOMServer.renderToStaticMarkup

      // let markup = render(<TestCom end="server" />)
      let markup = ''

      ctx.type = 'html';
      ctx.body = html(pageInfo, markup)
    }

    await next()
  }
}
