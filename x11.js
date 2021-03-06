/**
 * Copyright 2013 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var xManager = require('./lib/xEventManager.js');
var manager = null;
var waitingForManager = false;
var ctx;

module.exports = function (RED) {
     var handleMsg = function(msg) {
        if (msg != null && msg.payload != null) {
	   // console.log("Got payload");
            var payload = msg.payload;
            try {
                switch(payload.event) {
                    case 'keyUp':
                        manager.keyUp(payload.data.key);
                       // console.log("keyUp");
                        break;
                    case 'keyDown':
                        manager.keyDown(payload.data.key);
                       // console.log("keyDown");
                        break;
                    case 'move':
                        manager.move(payload.data.xPercent, payload.data.yPercent);
                       // console.log("move");
                        break;
                    case 'moveRelative':
                        manager.moveRelative(payload.data.x, payload.data.y);
                       // console.log("moveRelative");
                        break;
                    case 'click':
                        manager.click(payload.data.clickCode);
                       // console.log("click");
                        break;
                }
            } catch(err){console.log(err);}
        }
    };

    function X11FunctionNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.x11 = n.x11;
        this.topic = n.topic;
        //console.log("X11FunctionNode");
        ctx = this;
        this.on("input", function(msg){
	    // console.log("Got msg");
             if(manager == null) {
                if(!waitingForManager) {
		   // console.log("Not waiting for manager");
                    waitingForManager = true;
                    try {
                        xManager.createXManager(function(mng) {
				//console.log("Got manager");
                            	manager = mng; 
			    }
                        );
                    } catch(err) {
			console.log("Error creating manager");
                        console.log(err.toString());
                    }
                } else {
			console.log("Waiting for manager");
		}
            } else {
                handleMsg(msg);
            }
        });
    }

    RED.nodes.registerType("x11", X11FunctionNode);
    RED.library.register("x11");
};
