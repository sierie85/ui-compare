module.exports = {
  prettyFileName: (file) => file.replace(/(^\w+:|^)\/\//, '').replace(/[^a-z0-9.]/gi,'-').substring(0,255)
}
