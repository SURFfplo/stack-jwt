// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

import {get} from '@loopback/rest';

export class ContextController {
  @get('/context')
  context(): any {

	// ######
        // CONFIG
	// ######
	// course vs tools table
	// a static array for now
	// TODO: a nice interface where a teacher can add tools to courses
	var courseTools = Array();
	courseTools.push({courseId:"1",toolName:"my_first_tool"});
	courseTools.push({courseId:"1",toolName:"Grasple"});

	// request code to get external data
	var request = require('request');
	// Get courses & tools from OOAPI and ltilauncher
	var requestOoapiOptions = {
		url: "https://api.dev.dlo.surf.nl/courses"
	};
	var requestLtilauncherOptions = {
		url: "https://ltilauncher.dev.dlo.surf.nl/api/v1/auth_servers/13ec1e25-33ab-4cb6-bf77-435be68b1f20/tools"
	};

	// ###########################
        // DO NOT EDIT BELOW THIS LINE
	// ###########################

        /* OLD STYLE REQUEST WITH CALLBACK
	function requestResponse(error:any, response:any, body:string) {
		if (!error && response.statusCode == 200) {
			var courseList = JSON.parse(body);
			console.log("*** found courseList ***" + courseList);
		}
		else {
			console.log("*** Could not get courses from ooapi ***");
		}
	};
	request(requestOptions, requestResponse);
        */
	// REQUEST WITH PROMISE, SO WE CAN USE AWAIT
	function requestWithPromise(requestOptions:any) {
		return new Promise(function(resolve, reject){
			request(requestOptions, function(error:any, response:any, body:string) {
		                if (!error && response.statusCode == 200) {
                        		resolve(body);
                		}
                		else {
                        		reject(error);
                		}
			})
		});
	};
	// REQUEST WITH PROMISE AND AWAIT
	async function requestWithAwait(requestOptions:any){
    		const result = await requestWithPromise(requestOptions);
		return result;
	}
	// MULTIPLE REQUESTS WITH PROMISE AND AWAIT
	async function requestWithAwaitMultiple(){
    		try {
			// ##
			// 1. create courses array from OOAPI courseList
			// ##
    			var firstResult = await requestWithPromise(requestOoapiOptions).then(function(result:any){return result}, function(error:any){new Error()});
        		var courseList = JSON.parse(firstResult);
			var courseArray = courseList._embedded.items;
			var courseIdx = Array();
			for (var i=0;i<courseArray.length;i++) {
				courseIdx.push(courseArray[i].courseId);	
			}
        		console.log("*** found courseArray *** #items:" + courseIdx.length);

			// ##
			// 2. create tools array from ltilauncher
			// ##
    			var secondResult = await requestWithPromise(requestLtilauncherOptions).then(function(result:any){return result}, function(error:any){new Error()});
			// NOTE: testing with file
			//var fsTest = require('fs');
			//var secondResult = fsTest.readFileSync('src/controllers/config/toollist.txt');
        		var toolArray = JSON.parse(secondResult);
			var toolIdx = Array();
			for (var i=0;i<toolArray.length;i++) {
				toolIdx.push(toolArray[i].name);	
			}
        		console.log("*** found toolArray *** #items:" + toolIdx.length);

			// ##
			// 3. setup toolsWithContext array, based on Course-Tool table
			// ##
			var fs = require('fs');
			var jwt = require('jsonwebtoken');
			var toolsWithContext = Array();
			for (var i=0; i<courseTools.length; i++) {
				// check if courseId & toolName are in courseIdx and toolIdx
				// then add to toolsWithContext
				var courseItem = courseIdx.indexOf(courseTools[i].courseId);
				var toolItem = toolIdx.indexOf(courseTools[i].toolName);
				if (courseItem != -1 && toolItem != -1) {
					toolsWithContext.push(toolArray[toolItem]);

					// ##
					// 4. add context/token to toolurl in output array
					// ##
					var contextAndRole = {"https://purl.imsglobal.org/spec/lti/claim/context":{"id":"courseArray[courseItem].courseId","title":"courseArray[courseItem].courseName"}, "https://purl.imsglobal.org/spec/lti/claim/roles":["http://purl.imsglobal.org/vocab/lis/v2/institution/person#Student","http://purl.imsglobal.org/vocab/lis/v2/membership#Learner"]};
					var privateKey = fs.readFileSync('src/controllers/config/jwtRS256.key');
					var token = jwt.sign(contextAndRole, privateKey, { algorithm: 'RS256', keyid: '123' });

					toolsWithContext[toolsWithContext.length-1].url = toolsWithContext[toolsWithContext.length-1].launch_url + "?context=" + token;
					var readableContext = JSON.stringify(toolsWithContext[toolsWithContext.length-1]);
        				console.log("*** created context *** " + readableContext);
				}
			}

			return JSON.stringify(toolsWithContext);
    		}
    		catch(error){
			console.log("*** Could not get response from remote source: " + error.message + "***");
    		}
	}

	var out = requestWithAwaitMultiple();
	// cannot cast promise<string> to string...
        //return JSON.parse(out);
        return out;

  }
}
