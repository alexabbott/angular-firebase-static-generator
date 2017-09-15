const Nightmare = require('nightmare'),
      fs = require('fs'),
      cheerio = require('cheerio'),
      mkdirp = require('mkdirp'),
      selector = 'html';

let links = ['https://fir-cms-76f54.firebaseapp.com/'];

let getLinks = (i) => {
  new Nightmare()
    .goto(links[i])
    .wait('h1 a')
    .wait(1000)
    .evaluate((selector) => {
      // now we're executing inside the browser scope.
      return document.querySelector(selector).innerHTML;
     }, selector)
    .end()
    .then((content) => {
      let $ = cheerio.load(content);
      let thelinks = $('a');
      $(thelinks).each(function(i, link){
        if (links.indexOf('https://fir-cms-76f54.firebaseapp.com' + $(link).attr('href')) === -1) {
          links.push('https://fir-cms-76f54.firebaseapp.com' + $(link).attr('href'));
        }
      });

      scrape();
    });
}

let scrape = () => {
  for (let x = 0; x < links.length; x++) {
    new Nightmare()
      .goto(links[x])
      .wait('h1 a')
      .wait(1000)
      .evaluate((selector) => {
        // now we're executing inside the browser scope.
        return document.querySelector(selector).innerHTML;
       }, selector)
      .end()
      .then((content) => {
        let stream;

        let title = links[x].split('/')[links[x].split('/').length - 1];
        content = content.replace('main.2af7245cee3c60468421.bundle.js', 'https://fir-cms-76f54.firebaseapp.com/main.2af7245cee3c60468421.bundle.js');
        content = content.replace('inline.0efc828aca17ea80794d.bundle.js', 'https://fir-cms-76f54.firebaseapp.com/inline.0efc828aca17ea80794d.bundle.js');
        content = content.replace('polyfills.779bd8aa867d6c58d8bb.bundle.js', 'https://fir-cms-76f54.firebaseapp.com/polyfills.779bd8aa867d6c58d8bb.bundle.js');
        content = content.replace('sw-register.74c6f7bb8799950a379e.bundle.js', 'https://fir-cms-76f54.firebaseapp.com/sw-register.74c6f7bb8799950a379e.bundle.js');
        content = content.replace('vendor.3ca0d556b55ac976e102.bundle.js', 'https://fir-cms-76f54.firebaseapp.com/vendor.3ca0d556b55ac976e102.bundle.js');
        content = content.replace('styles.eff5a9aa544539b59c03.bundle.css', 'https://fir-cms-76f54.firebaseapp.com/styles.eff5a9aa544539b59c03.bundle.css');
        if (x === 0) {
          stream = fs.createWriteStream("./static/index.html");
        } else {
          let path = './static' + links[x].replace('https://fir-cms-76f54.firebaseapp.com', '');
          path = path.split('/');
          path = path.slice(0, -1);
          path = path.join('/');

          mkdirp(path, function (err) {
            if (err) console.error(err)
            else console.log('dir created')
          });
          stream = fs.createWriteStream("./static" + links[x].replace('https://fir-cms-76f54.firebaseapp.com', '') + ".html");
        }
        stream.once('open', (fd) => {
            stream.write(content);
            stream.end();
        })
      });
  }
}

for (let i = 0; i < links.length; i++) {
  getLinks(i);
}