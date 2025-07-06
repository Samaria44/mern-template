const Service = require("node-windows").Service;

const svc = new Service({
    name:"CMS-Service",
    description:"app----",
    script:"C:\\Users\\Administrator\\Desktop\\setup\\server\\server.js"
});
svc.on("install",function(){
    svc.start()
});

svc.install();