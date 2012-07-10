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
      
      var start_obj_DbObj = musu.appContext.query.query("type='note'");
      console.log(start_obj_DbObj);
      //musu.appContext.feed.post(truth_obj);
      //musu.appContext.feed.post(dare_obj);

      //start_obj.post(truth_obj);
      //start_obj.post(dare_obj);
      
      musu.appContext.quit();  
      console.log("start_obj looks like this after quit:"+ start_obj );
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
});