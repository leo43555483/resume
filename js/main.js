
requirejs.config({
    paths:{
        "jquery":"lib/jquery-1.11.2.min",// 此路径以data-main指定的路径为根路径
        "resum":"resum",
    },
   // shim:{
        //resum:{
            //deps:["jquery"],
            //exports:"resum"
       // },
    //}
});

require(["jquery","resum"],function($,fullpage){
    let options = {
        "keybord" : true,
    };  
    
    $('[data-PageSwitch]').PageSwitch(options); //调用的是依赖中的方法
})