
var html = function(ctx, next){
    ctx.render = function(test){
        return (
            `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>node</title>
                <link rel="stylesheet" type="text/css" ref="http://localhost:3003/src/client/test.css"/>
            </head>
            <body>
                <div id="container">hello related ${test ? test : ''}</div>
            </body>
            </html>`
        )
    }
    next()
}

module.exports = {
    html: html
}