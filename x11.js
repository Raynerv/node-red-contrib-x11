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

                        break;
                    case 'keyDown':
                        manager.keyDown(payload.data.key);

                        break;
                    case 'move':
                        manager.move(payload.data.xPercent, payload.data.yPercent);

                        break;
                    case 'moveRelative':
                        manager.moveRelative(payload.data.x, payload.data.y);

                        break;
                    case 'click':
                        manager.click(payload.data.clickCode);

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
        this.topic = n.topic;
        console.log("X11FunctionNode");
        ctx = this;
        this.on("input", function(msg){
             if(manager == null) {
                ctx.error("No XManager");
                try {
                    xManager.createXManager(function(mng) { manager = mng;});
                } catch (err) {
                    ctx.error(err);
                    console.error(err);
                }
            } else {
                handleMsg(msg, ctx, manager);
            }
        });
    }

    RED.nodes.registerType("x11", X11FunctionNode);
    RED.library.register("x11");
};
