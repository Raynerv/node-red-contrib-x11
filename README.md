node-red-contrib-x11
========================

A node-red node that allows you to control the mouse and keyboard of a X11-display on the Linux server hosting node-red.
Accepts keycodes from Chrome and Firefox, while some keycodes must be mapped to X11 variants, these mappings are maintained in [keyMapper.js](./lib/keyMapper.js). 
Example payload (when manually constructing keyDown events don't forget to send a keyUp event to complete the press):

``` javascript
msg.payload = { "event": "keyDown", "data": { "key": 38 }};
return msg;
```

Based on [Andrew Swerlicks Node.js X11Client implementation.](../../AndrewSwerlick/node-remote)


Install
-------

Run the following command in the root directory of your Node-RED install

    npm install node-red-contrib-x11


Usage
-----

In the node-red package.json add a dependency to
"node-red-contrib-x11":"latest"

TODO: Document usage in the node's information panel

Launch node-red in a display, e.g.
```
DISPLAY=:0 node red.js
```

Example flow
------------
This flow contains a HTML-page that connects to your node-red instance via Websockets, and streams keyboard/mouse events to a Websocket input node that forwards these to X11. 
Remember to launch node-red in a display.
``` javascript
[{"id":"30e142f0.cf1ebe","type":"websocket-listener","path":"/ws/x11","wholemsg":"false"},{"id":"bd6bd6dc.429428","type":"http in","name":"","url":"/input","method":"get","x":172.66665649414062,"y":83.66666412353516,"z":"f52a63c3.0ad5a","wires":[["b6e61882.4919e8"]]},{"id":"b6e61882.4919e8","type":"template","name":"Capture events from browser","template":"<html>\n<head>\n    <script src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js\"></script>\n    <script src=\"http://cachedcommons.org/cache/jqtouch/1.0.0/javascripts/jqtouch.js\"></script>\n</head>\n<body>\n<script type=\"text/javascript\">\n    $(document).ready(function(){\n        var server = window.location.hostname + \":\" + window.location.port;\n        console.log(server);\n        var socket = new WebSocket(\"ws://\"+server+\"/ws/x11\");\n        socket.onopen = function () {\n            console.log(\"Connected to websocket\");\n            $(document).mousemove(\n                    function(e){\n                        socket.send(JSON.stringify({event: 'move', data: {\n                            xPercent: (e.pageX / $(window).width()) * 100,\n                            yPercent: (e.pageY / $(window).height()) * 100\n                        }}));\n                    }\n            );\n            $(document).keydown(\n                    function(e){\n                        socket.send(JSON.stringify({event: 'keyDown', data: {\n                            key: e.which\n                        }}));\n                        $(document).keypress();\n                        return false;\n                    }\n            );\n            $(document).keyup(\n                    function(e){\n                        socket.send(JSON.stringify({event: 'keyUp', data : {\n                            key: e.which\n                        }}));\n                        return false;\n                    }\n            );\n            $(document).click(\n                    function(e){\n                        socket.send(JSON.stringify({event: 'click', data: {\n                            clickCode: e.which\n                        }}));\n                        return false;\n                    }\n            );\n            //Adding touch events after the page is loaded\n            $(document).ready(function(){\n                $.jQTouch({\n                    initializeTouch: 'body'\n                });\n                $('.current').bind('drag' ,function(e, info){\n                    socket.send(JSON.stringify({event: 'moveRelative', data: {\n                        x: info.deltaX/10,\n                        y: info.deltaY/10\n                    }}));\n                });\n            });\n        };\n    });\n</script>\n<div>\n    Move your mouse around to control the other computer\n</div>\n</body>\n</html>\n","x":434.6666564941406,"y":85.66666412353516,"z":"f52a63c3.0ad5a","wires":[["4bf6a686.b40958"]]},{"id":"4bf6a686.b40958","type":"http response","name":"","x":700.6666870117188,"y":84.66666412353516,"z":"f52a63c3.0ad5a","wires":[]},{"id":"b2789405.4d8768","type":"websocket in","name":"","server":"30e142f0.cf1ebe","x":177,"y":152,"z":"f52a63c3.0ad5a","wires":[["eb35c908.14ca38"]]},{"id":"eb35c908.14ca38","type":"json","name":"","x":436.33331298828125,"y":152.33331298828125,"z":"f52a63c3.0ad5a","wires":[["3d747c7.fc28b84"]]},{"id":"3d747c7.fc28b84","type":"x11","name":"X11","x":701.3333129882812,"y":152.33331298828125,"z":"f52a63c3.0ad5a","wires":[]}]
```


