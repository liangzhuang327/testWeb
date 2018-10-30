import path from 'path'
import chalk from 'chalk'

let localPath = 'localhost';

const env = {
  HTTP_SCRIPT_BASEURL: `http://${localPath}:${process.env.SCRIPT_PORT || 3006}/static`,
  HTTP_SCRIPT_SUFFIX: '',
  HTTP_SERVER_PORT: process.env.SERVER_PORT || 3005,
  HTTP_CONTENT_TYPE: {
    JSON: 'application/json',
    PDF: 'application/pdf',
    XLS: 'application/vnd.ms-excel',
    FORM: 'multipart/form-data'
  },
}

if (process.env.NODE_ENV === 'production') {
  Object.assign(env, {
    HTTP_SCRIPT_BASEURL: '',
    HTTP_SCRIPT_SUFFIX: '.min'
  })
}
console.log(chalk.red.bold('局域网可访问地址 >>>>>>>>>>> http://' + localPath + ':' + env.HTTP_SERVER_PORT));

export default env
