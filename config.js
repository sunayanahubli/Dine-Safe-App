$(document).ready(function(){
	$("#search").click(function(){
		console.log("search clicked");
		var zipcode = document.getElementById('query').value;
		var allergies = [];
		var location_id;
		for(i=1;i<=4;i++){
			if(!!document.getElementById('allergy'+i)?.checked)
				allergies.push( document.getElementById('allergy'+i).value)
		}
		console.log(allergies,zipcode);
		const settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://travel-advisor.p.rapidapi.com/locations/v2/auto-complete?query="+zipcode+"&lang=en_US&units=km",
			"method": "GET",
			"headers": {
				"X-RapidAPI-Key": "327782d2dbmshdf7303c7e63dcabp1512d4jsndbb535c3e75a",
				"X-RapidAPI-Host": "travel-advisor.p.rapidapi.com"
			}
		};
		
		$.ajax(settings).done(function (response) {
			location_id = response.data.Typeahead_autocomplete.results[0].documentId;
			let data=restaurent(location_id,allergies);
			
		});
		
	})
	function restaurent(loc_id,allergies){
	
		const restaurent_API = {
			"async": true,
			"crossDomain": true,
			"url": "https://travel-advisor.p.rapidapi.com/restaurants/list?location_id="+loc_id+"&restaurant_tagcategory=10591&restaurant_tagcategory_standalone=10591&currency=USD&lunit=km&limit=30&open_now=false&lang=en_US",
			"method": "GET",
			"headers": {
				"X-RapidAPI-Key": "327782d2dbmshdf7303c7e63dcabp1512d4jsndbb535c3e75a",
				"X-RapidAPI-Host": "travel-advisor.p.rapidapi.com"
			}
		};
		
		$.ajax(restaurent_API).done(function (response) {
			var restaurent_data = response;
			console.log(response);
			if(!!restaurent_data){
				var filterData=[];
				console.log(allergies);
				if(!!allergies.length){
					for(let i=0;i<restaurent_data.data.length; i++){
						if(!!restaurent_data.data[i].cuisine){
							for( let j=0;j<allergies.length;j++){
								for(let k=0;k<restaurent_data.data[i].cuisine.length; k++){
									if(restaurent_data.data[i].cuisine[k].name.includes(allergies[j]) ){
										filterData.push(restaurent_data.data[i]);
										console.log(restaurent_data.data[i].cuisine[k],allergies[j],i,j,k);
									}
								}
							}
	
						}
					}

				}
				else{
					filterData = restaurent_data.data;
					console.log("else");
				}
				
				console.log(filterData);
				localStorage.setItem("restaurent_data",JSON.stringify(filterData));
				window.location.href ="sample-inner-page.html";
				return filterData;

			}
		});
		
	}
	function onload(){
		var restaurentData=localStorage.getItem("restaurent_data");
		restaurentData = JSON.parse(restaurentData);
		console.log(restaurentData);
		var htmlData = "";
		var defaultImg = "https://media-cdn.tripadvisor.com/media/photo-l/0c/e9/03/ef/photo9jpg.jpg";
		var defaultName = "Chipotle"
		for(i=0;i<restaurentData.length;i++){
			htmlData= htmlData+ "<div class='inner' > ";
			if (restaurentData[i].name) {
				htmlData=htmlData+"<h1 >"+ restaurentData[i].name +" </h1>";
			} else {
				htmlData=htmlData+"<h1 >"+ defaultName +" </h1>";
			}
			htmlData = htmlData+ "<div><img src="+restaurentData[i].photo?.images?.small?.url+" alt="+defaultImg+"></div>";
			htmlData = htmlData+"<p>"+restaurentData[i].address+"</p>";
			htmldata = htmlData+"</div>";
		}
		document.getElementById("restaurent_data").innerHTML= htmlData;

	};
	onload();
  });


