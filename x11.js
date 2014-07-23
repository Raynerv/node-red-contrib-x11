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

    function X11FunctionNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.x11 = n.x11;

        this.topic = n.topic;

        try {
            xManager.createXManager(function(manager) {
                this.on("input", function (msg) {
                    if (msg != null && msg.payload != null) {
                        // { event, data }
                        var payload = msg.payload;
                        try {
                            switch(topic) {
                                case 'keyUp':
                                    manager.keyUp(payload.key);
                                    break;
                                case 'keyDown':
                                    manager.keyDown(payload.key);
                                    break;
                                case 'move':
                                    manager.move(payload.xPercent, payload.yPercent);
                                    break;
                                case 'moveRelative':
                                    manager.moveRelative(payload.x, payload.y);
                                    break;
                                case 'click':
                                    manager.click(payload.clickCode);
                                    break;
                            }
                        } catch(err){this.error(err);}
                    }
                });
            });
        } catch (err) {
            this.error(err);
        }
    }

    RED.nodes.registerType("x11", X11FunctionNode);
    RED.library.register("x11");
}
