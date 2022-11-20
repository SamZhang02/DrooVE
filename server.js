import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require('express');
const cors = require('cors')
const app = express();
const PORT = 8000;
const querystring = require('querystring');
import {main} from './main.js'

function queryStringToJSON(qs) {
  qs = qs || location.search.slice(1);

  const pairs = qs.split('&');
  var result = {};
  pairs.forEach(function(p) {
      var pair = p.split('=');
      var key = pair[0];
      var value = decodeURIComponent(pair[1] || '');

      if( result[key] ) {
          if( Object.prototype.toString.call( result[key] ) === '[object Array]' ) {
              result[key].push( value );
          } else {
              result[key] = [ result[key], value ];
          }
      } else {
          result[key] = value;
      }
  });

  return JSON.parse(JSON.stringify(result));
};


app.use(express.static('.'))
app.use(express.json())
app.use(cors())

app.get ('/json', async (req, res) => {
  const qstring = querystring.decode(req._parsedUrl.query);
  const json = JSON.stringify(await main('Montreal, QC', 'Toronto, ON'))
  res.setHeader('Content-Type', 'application/json');
  res.send(json)
})

app.listen(PORT, () => {
  console.log(`Server connected at port ${PORT}`);
})
