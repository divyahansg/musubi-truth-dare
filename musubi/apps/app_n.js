function MusuWriter(app) {
  this.appContext = app;
}

var musu;
var start_obj_DbObj; //global
Musubi.ready(function(context) {
    console.log("launching bigwords.");
    musu = new MusuWriter(context);
    
    var state_data = musu.appContext.feed.query("type='truth_dare_state'", "_id desc limit 1");
    if(state_data.length > 0)
    {
    	$(".start").css("display","none");
		$(".about").css("display","none");
		$(".input").css("display","inline");
    }
    
    $("#start").click(function(e) {
      var style = "font-size:30px;padding:5px;";
      style += "background-color:blue;white-space:nowrap;";
      style += "color:red;";
      var text = "game started!";
      var html = '<span style="' + style + '">' + text + '</span>';
      var content = { "__html" : html, "text" : text };
      var start_obj = new SocialKit.Obj({type : "truth_dare_state", json: content}) //global
      musu.appContext.feed.post(start_obj);
      //musu.appContext.quit();
      console.log("start_obj looks like this after post:"+ start_obj );
      
    });
    
    
    $("#submit").click(function(e) {
      if($("#truth").val().length == 0 ||  $("#dare").val().length == 0)
      {
        alert("Please input a truth and a dare.");
        return;
      }
      var truth_text = $("#truth").val();
      var html = '<span>' + truth_text + '</span>';
      var truth_content = { "__html" : html, "text" : truth_text};
      var truth_obj = new SocialKit.Obj({type : "truth", json: truth_content});
      
      var dare_text = $("#dare").val();
      html = '<span>' + dare_text + '</span>';
      var dare_content = { "__html" : html, "text" : dare_text};
      var dare_obj = new SocialKit.Obj({type : "dare", json: dare_content});
      
      var data = musu.appContext.feed.query("type='truth_dare_state'", "_id desc limit 1")[0];
      start_obj_DbObj = new SocialKit.DbObj(data);
      start_obj_DbObj.post(truth_obj);
      start_obj_DbObj.post(dare_obj);
      
      //var temp_truth = new SocialKit.Obj(start_obj_DbObj.query("type='truth'")[0]);
      //var temp_dare = new SocialKit.Obj(start_obj_DbObj.query("type='dare'")[0]);
      //var truth_info = temp_truth.json['text'];
      //var dare_info = temp_truth.json['text'];
      
      $(".choice").css("display","inline");
	  $(".input").css("display","none");
	});
	
	$("#truth_button").click(function(e) {
		var temp_truth = start_obj_DbObj.query("type='truth'");
		if(temp_truth.length > 0)
		{
			var arr = new Array();
			for(i = 0; i < temp_truth.length; i++) 
			{
				var truth_DbObj = new SocialKit.DbObj(temp_truth[i]); //need to make temp dbObj to query for answers
				var nested = truth_DbObj.query("type='answer'");
				if(nested.length ==0)
				{
					arr.push(new SocialKit.Obj(temp_truth[i])); //need Obj to extract json next
				}
			}
			var rand = Math.floor(Math.random()* (arr.length+1));
			console.log("arr.length = " + arr.length);
			console.log("arr["+rand+"] = " + arr[rand]);
			console.log("arr["+rand+"].json.text = " + arr[rand].json['text']);
			$("#current_truth").append(arr[rand].json['text']);
		}
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
    $("#truth_button").click(function(e) {
		$(".truth_page").css("display","inline");
		$(".choice").css("display","none");
	});
	$("#dare_button").click(function(e) {
		$(".truth_page").css("display","inline");
		$(".choice").css("display","none");
	});
});