// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

import {get} from '@loopback/rest';

export class KeyController {
  @get('/key')
  key(): string {
	var fs = require('fs');
  	var publicKey = fs.readFileSync('src/controllers/config/jwtRS256.key.json');
        return JSON.parse(publicKey);
  }
}
