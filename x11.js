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

module.exports = function (RED) {
    var xManager = require('./lib/xEventManager.js');

    var handleMsg = function(msg, ctx, manager) {
        if (msg != null && msg.payload != null) {

            var payload = msg.payload;
            try {
                switch(payload.event) {
                    case 'keyUp':
                        manager.keyUp(payload.data.key);
                        console.log("keyUp");
                        break;
                    case 'keyDown':
                        manager.keyDown(payload.data.key);
                        console.log("keyDown");
                        break;
                    case 'move':
                        manager.move(payload.data.xPercent, payload.data.yPercent);
                        console.log("move");
                        break;
                    case 'moveRelative':
                        manager.moveRelative(payload.data.x, payload.data.y);
                        console.log("moveRelative");
                        break;
                    case 'click':
                        manager.click(payload.data.clickCode);
                        console.log("click");
                        break;
                }
            } catch(err){ctx.error(err);}
        }
    };

    function X11FunctionNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.x11 = n.x11;
        var ctx = this;
        var manager = null;
        var waitingForManager = false;
        this.topic = n.topic;
        console.log("X11FunctionNode");
        ctx = this;
        this.on("input", function(msg){
             if(manager == null) {
                if(!waitingForManager) {
                    waitingForManager = true;
                    try {
                        xManager.createXManager(function(mng) {
                            manager = mng; waitingForManager = false;}
                        );
                    } catch(err) {
                        waitingForManager = false;
                        ctx.error(err.toString());
                    }
                }
            } else {
                handleMsg(msg, ctx, manager);
            }
        });
    }

    RED.nodes.registerType("x11", X11FunctionNode);
    RED.library.register("x11");
};
