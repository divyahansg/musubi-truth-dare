function MusuWriter(app) {
  this.appContext = app;
}

var musu;
var start_obj; //global
Musubi.ready(function(context) {
    console.log("launching bigwords.");
    musu = new MusuWriter(context);
    
    $("#start").click(function(e) {
      var style = "font-size:30px;padding:5px;";
      style += "background-color:blue;white-space:nowrap;";
      style += "color:red;";
      var text = "game started!";
      var html = '<span style="' + style + '">' + text + '</span>';
      var content = { "__html" : html, "text" : text };
      start_obj = new SocialKit.Obj({type : "note", json: content}) //global
      musu.appContext.feed.post(start_obj);
      //musu.appContext.quit();
      console.log("start_obj looks like this after post:"+ start_obj );
      
    });
    
    
    $("#submit").click(function(e) {
      var truth_text = $("#truth").val();
      var html = '<span>' + truth_text + '</span>';
      var truth_content = { "__html" : html, "text" : truth_text };
      var truth_obj = new SocialKit.Obj({type : "truth", json: truth_content});
      
      var dare_text = $("#dare").val();
      html = '<span>' + dare_text + '</span>';
      var dare_content = { "__html" : html, "text" : dare_text };
      var dare_obj = new SocialKit.Obj({type : "dare", json: dare_content});
      
      musu.appContext.feed.post(truth_obj);
      musu.appContext.feed.post(dare_obj);
      
      var start_obj_DbObj = musu.appContext.feed.query("type='note'", 1);
      var start_obj_DBObj;
      for(i=0; i < 5; i++)
      {
      	start_obj_DBObj = setTimeout(function(){
      		
      		return musu.appContext.feed.query("type='note'",1);
      	
      	}, 200000);
      }
    console.log("toString" + start_obj_DBObj.toString());

      //while (!(start_obj_DbObj instanceof SocialKit.DbObj))
      //{
      //	start_obj_DbObj = musu.appContext.feed.query("type='note'")[0];
      //}
      
      console.log("finished our console");
      console.log("marker here    " + JSON.stringify(start_obj_DBObj));
      //musu.appContext.start_obj_DbObj.post(truth_obj);
      
      //start_obj.post(truth_obj);
      //start_obj.post(dare_obj);
      
      //musu.appContext.quit();  
	});
    
    
});
$(function(){
	$("#about").click(function(e) {
		$(".start").css("display","none");
		$(".about").css("display","inline");
		$(".input").css("display","none");
	});
	$("#start").click(function(e) {
		$(".start").css("display","none");
		$(".about").css("display","none");
		$(".input").css("display","inline");
	});
	$("#return").click(function(e) {
		$(".start").css("display","inline");
		$(".about").css("display","none");
		$(".input").css("display","none");
	});
    $("#submit").click(function(e) {
		$(".choice").css("display","inline");
		$(".input").css("display","none");
	});
});