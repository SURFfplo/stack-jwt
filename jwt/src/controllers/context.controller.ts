// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';


import {get} from '@loopback/rest';

export class ContextController {
  @get('/context')
  context(): string {
	var jwt = require('jsonwebtoken');
	var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    	return token;
  }
}


