function MusuWriter(app) {
  this.appContext = app;
}



var musu;
Musubi.ready(function(context) {
    musu = new MusuWriter(context);
    
    
    var state_data = musu.appContext.feed.query("type='truth_dare_state'", "_id desc limit 1");
    if(state_data.length > 0)
    {
		var start_obj_DbObj = new SocialKit.DbObj(state_data[0]);  //Zero-ith game!
		var user_data = getUser(context); //preexisting user status (json representation of a user)
		if(user_data == null) //not joined
		{
			var user = makeUser(context); //make
			start_obj_DbObj.post(user); //nest to game
			$(".start").css("display","none");
			$(".input").css("display","inline"); //direct to input
		}
		else
		{
			var user = new SocialKit.DbObj(user_data); //get user obj
			var user_status = user.query("type='progress'"); //query state
			
			//DEPENDENT ON QUERY ORDER
			if 		(user_status.length == 3) {showDone(user_status[2]);} //MAKE DONE OBJECT AFTER ANSWERING
			else if (user_status.length == 2) {showAnswer(user_status[1]);} //goto answer screen
			else if (user_status.length == 1) {showChoice(user_status[0]);} //goto choice screen
			else    						  {								//goto input screen
											     $(".start").css("display", "none");
											     $(".input").css("display", "inline");
										      }
		}
    }
    
    $("#start").click(function(e) {
    
      //post game start notification
      var style = "font-size:30px;padding:5px;";
      style += "background-color:blue;white-space:nowrap;";
      style += "color:red;";
      var text = "Game started!";
      var html = '<span style="' + style + '">' + text + '</span>';
      var content = { "__html" : html, "text" : text };
      var start_obj = new SocialKit.Obj({type : "truth_dare_state", json: content});
      musu.appContext.feed.post(start_obj); //post game start
      
	  
	  var user_obj = makeUser(context);    //person starting game
	  console.log("=============USER IS: " + user_obj);
	       
      setTimeout(func, 1000);
		function func() {
    		var data = musu.appContext.feed.query("type='truth_dare_state'", "_id desc limit 1")[0]; //getting game state
		    var start_obj_DbObj = new SocialKit.DbObj(data); 
		    console.log("=======================start_obj_Dbobj before posting is: " + start_obj_DbObj);
		    start_obj_DbObj.post(user_obj); //adding starting player to game
		    console.log("========================================== posted");
		}
		
	  $(".start").css("display","none"); //goto input screen
	  $(".about").css("display","none");
	  $(".input").css("display","inline");      
    });
    
    //submit input
    $("#submit").click(function(e) { 
      if($("#truth").val().length == 0 ||  $("#dare").val().length == 0) //check if empty
      {
        alert("Please input a truth and a dare.");
        return;
      }
      var truth_text = $("#truth").val();
      var truth_content = {"text" : truth_text, "src_user": context.user["name"]};
      var truth_obj = new SocialKit.Obj({type : "truth", json: truth_content}); //create truth obj
      
      var dare_text = $("#dare").val();
      var dare_content = {"text" : dare_text, "src_user": context.user["name"]};
      var dare_obj = new SocialKit.Obj({type : "dare", json: dare_content}); //create dare obj
      
      var data = musu.appContext.feed.query("type='truth_dare_state'", "_id desc limit 1")[0]; //get game state for posting t/d
      var start_obj_DbObj = new SocialKit.DbObj(data); //make dbobj of state
      start_obj_DbObj.post(truth_obj); //post t
      start_obj_DbObj.post(dare_obj); //post d
      
      var user = new SocialKit.DbObj(getUser(context)); //get user obj to nest choice progress
      var choice_obj = new SocialKit.Obj({type: "progress"}); //make progress obj (choice)
      user.post(choice_obj); //posted
      console.log("============POSTED CHOICE OBJ");
      
      setTimeout(func, 1000);
		function func() {};
      
      $(".input").css("display", "none");
      $(".choice").css("display", "inline"); //display choice screen
	});
	
	$("#truth_button").click(function(e) { //if clicked truth on choice
		var temp_truth = start_obj_DbObj.query("type='truth'"); //get all truths (array of json truths)
		
		if (temp_truth.length != context.feed.members.length)
		{
			alert("Still waiting on " + (context.feed.members.length - temp_truth.length) + " member(s) to answer!");
			return;
		}
		
		if(temp_truth.length > 0) //if truth submitted - default
		{
			var arr = new Array(); //array of open truths
			for(i = 0; i < temp_truth.length; i++) 
			{
				var truth_DbObj = new SocialKit.DbObj(temp_truth[i]); //need to make temp dbObj to query for answers
				var nested = truth_DbObj.query("type='taken'");
				if(nested.length == 0)
				{
					arr.push(temp_truth[i]); //store json for populating answer page
				}
			}
			var rand = Math.floor(Math.random() * (arr.length)); //rand index
			var truth_json = (new SocialKit.Obj(arr[rand])).json; //random truth json from obj json rep (meta-JSON) 
			console.log("arr["+rand+"] = " + truth_json); //console json
			console.log("arr["+rand+"].json.text = " + truth_json['text']); //console truth text of json truth
			$("#current_truth").append(truth_json['text'] + " asked by: " + truth_json['src_user']); //fill answer-div with rand truth and user
			
			var current_truth = new SocialKit.DbObj(arr[rand]); //making dbobj for nesting answered under truth 
			var taken_obj = new SocialKit.Obj({type: "taken", json: {}}); //make taken obj to nest under answer
			current_truth.post(taken_obj); //post under truth
			
			var user = new SocialKit.DbObj(getUser(context)); //get user to put answer under it 
			var answer_json = {"screen_type" : "truth", "text" : arr[rand].json['text'], "truth_src": arr[rand].json['src_user']}; //make answer json
			var answer_obj = new SocialKit.Obj({type: "progress", json : answer_json}); //make answer obj
			user.post(answer_obj); //put under user
			
			$(".truth_page").css("display","inline");
		    $(".choice").css("display","none"); //display truth_page for answering
		}
	});
	
	$("#submit_truth").click(function(e) {
		var answer = $("#truth_answer").val(); //pull answer
		if (answer.length == 0) //check if empty
		{
			alert("You need to submit an answer! rawr"); //reprimand
			return;
		}
		
		var user = new SocialKit.DbObj(getUser(context)); //get current user
		var answer_obj = new SocialKit.Obj(user.query("type='progress'")[1]); //get json representation of answer obj
		var text = answer_obj.json['text']; //grab statement
		var screen_type = answer_obj.json['screen_type']; //grab type of task (t or d)
		
		var done_json = {"screen_type": screen_type, "statement": text, "answer": answer}; //create json for done obj
		var done_obj = new SocialKit.Obj({type: "progress", json: done_json}); //create done obj
		user.post(done_obj); //append to user
		
		$(".dashboard").css("display","inline");
		$(".truth_page").css("display","none"); //show dashboard page
	});
	
	
	
    function makeUser(context)
    {
      var userID = context.user['id'];   //get player's ID
      var user_json = {"id" : userID, "name" : context.user['name']}; //make player json
      user_obj = new SocialKit.Obj({type: "user", json: user_json}); //make player obj
	  return user_obj; //return obj
    }
    function getUser(context)
    {
      var data = context.feed.query("type='truth_dare_state'", "_id desc limit 1")[0]; //query for game state
	  var start_obj_DbObj = new SocialKit.DbObj(data);  //construct game state
	  var user_arr = start_obj_DbObj.query("type = 'user'"); //get all users as array of user json
	  console.log("================================USERS IN GETUSER IS = " + JSON.stringify(user_arr)); //console found user array
	  for(i =0; i < user_arr.length; i++) {
	  	temp_user = new SocialKit.Obj(user_arr[i]); //make temp user obj
	  	temp_ID = temp_user.json['id']; //get temp user obj ID
	  	if(temp_ID == context.user['id']) { //match temp with user
	  		return user_arr[i]; //return user json
	  	}
	  }
	  return null; //no match; null
    }
    
	function showAnswer(answer_json) //param: answer obj json
	{
	    $(".start").css("display","none");
		var answer_obj = new SocialKit.Obj(answer_json); //make answer obj to get json
		var json = answer_obj.json; //get json
	    var page = json['screen_type']; //get screentype from json INSIDE answer obj
	    if (page == "truth") //if truth
	    {
	    	$("#current_truth").append(json['text'] + " asked by: " + json['truth_src']); //fill answer page
	    	$(".truth_page").css("display","inline"); //show truth-answer page
		}
		//ELSE page == DARE
	}
	function showChoice(json) //show choice
	{
		$(".start").css("display","none");
		$(".choice").css("display","inline");
	}
	
	function showDone(json)
	{
		$(".dashboard").css("display","inline");
		$(".start").css("display","none"); //show done page
	}
});

$(function(){
	$("#about").click(function(e) {
		$(".start").css("display","none");
		$(".about").css("display","inline");
		$(".input").css("display","none");
	});
	$("#return").click(function(e) {
		$(".start").css("display","inline");
		$(".about").css("display","none");
		$(".input").css("display","none");
	});
});