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
							for(let j=0;j<restaurent_data.data[i].cuisine.length; j++){
								let push = true;
								for( let k=0;k<allergies.length;k++){
									if(!restaurent_data.data[i].cuisine[j].name.includes(allergies[k]) ){
										push = false;
										break;
									}
								}
								if(!!push){
									filterData.push(restaurent_data.data[i]);
									//console.log(restaurent_data.data[i].cuisine[j],allergies[k],i,j,k);
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
		var htmlData = "<div class='main_block'>";
		var defaultImg = "https://media-cdn.tripadvisor.com/media/photo-l/0c/e9/03/ef/photo9jpg.jpg";
		var defaultName = "Chipotle"
		if(!!restaurentData.length){
			for(i=0;i<restaurentData.length;i++){
				htmlData= htmlData+ "<div class='inner_block' > ";
				htmlData = htmlData+ "<div class='left_block'><img src="+restaurentData[i].photo?.images?.small?.url+" alt="+defaultImg+" >"
				htmlData = htmlData+ "<a class = 'website' id='navigateTo' href="+restaurentData[i].website+" target = '_blank' >Go To Website</a></div>"
				htmlData = htmlData+ "<div class = 'middle_block'>";
				if (restaurentData[i].name) {
					htmlData=htmlData+"<h3 class='name'>"+ restaurentData[i].name +" </h3>";
				} else {
					htmlData=htmlData+"<h3 class = 'name'>"+ defaultName +" </h3>";
				}
				htmlData = htmlData +"<p class='street'>"+restaurentData[i].address_obj?.street1+"</p>";
				htmlData = htmlData +"<p class='city'>"+restaurentData[i].address_obj?.city+"</p>";
				htmlData = htmlData +"<p class='pin'>"+restaurentData[i].address_obj?.state +" "+restaurentData[i].address_obj?.postalcode+"</p>";
				htmlData = htmlData +"<p class='contact'>"+restaurentData[i]?.phone +"|"+restaurentData[i]?.email+"</p>"
				htmlData = htmlData+"</div>";
				htmlData = htmlData+ "<div class = 'right_block'></div>"
				htmlData = htmlData+"</div>";
			}
			htmlData = htmlData + "</div>";
		}
		else{
			htmlData = "<h3 style='margin-top : 25px;'>No Restaurant Found</h3>";
		}
		document.getElementById("restaurent_data").innerHTML= htmlData;

	};
	$("#navigateTo").click(function navigateTo(){
		window.open('', '_blank');

	});
	onload();
  });
