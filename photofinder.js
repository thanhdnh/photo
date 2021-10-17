function dataRetrieval(keyword, page){
	json = (function () {
    json = null;
    $.ajax({
        'async': false,
        'global': false,
		'type': 'GET',
        'url': 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ce700cda22a7877d7fb50cf2ab1f2e35&text='+keyword+'&per_page='+perpage+'&page='+page+'&format=json&nojsoncallback=1&sort=interestingness-desc',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
	})(); 
}

var json = '';
var page = 1;
var total = 1;
var perpage = 100;

$(document).ready(function(e){	
	writeData('flowers', 1);
	
	$('#txtsearch').keyup(function(e){
		if(e.keyCode==13){
			//writeData($(this).val(), page);
			presentDataSlow($(this).val(), page)
			scroolTop();
			page = 1;
		}
	});
	$('#btprev').click(function(e){
		if(page==0)
			return;
		page--;
		presentDataSlow($('#txtsearch').val(), page)
		//writeData($('#txtsearch').val(), page);
		scroolTop();
	});
	$('#btnext').click(function(e){
		if(page==total)
			return;
		page++;
		presentDataSlow($('#txtsearch').val(), page)
		//writeData($('#txtsearch').val(), page);
		scroolTop();
	});
	
	$('#btclose').click(function(e){
		$('#image_show').css('visibility', 'hidden');
	});
	
	$('#btdownload').click(function(e){
		$('#img_viewer').click();
	});
	
	$('#img_zoom').slider({
		formatter: function(value) {
			return 'Current value: ' + value;
		}
	});
	
	$('#img_zoom').slider().on('change', function(event) {
		//console.log(event.value.newValue);
		$('#img_viewer').css('height', event.value.newValue+'%');
	});

	$('#img_viewer').mouseover(function(){
		//console.log('over');
		$('#ex1Slider').css('opacity', '.7');
	});
	$('#img_viewer').mouseout(function(){
		//console.log('out');
		$('#ex1Slider').css('opacity', '0');
	});
	$('#ex1Slider').mouseover(function(){
		//console.log('out');
		$('#ex1Slider').css('opacity', '.7');
	});
});

function callWriteData(keyword, page){
	return new Promise(resolve => {
		setTimeout(() => {
			writeData(keyword, page);
		}, 100);
	});
}

async function presentDataSlow(keyword, page){
	$('#loading').css('visibility', 'visible');
	await callWriteData(keyword, page); 
}

function writeData(keyword, page){
	//$('#loading').css('visibility', 'visible');
	$('#searchresult').off('click', 'img');
	$('#searchresult').html('');
	dataRetrieval(keyword, page);	
	if(json.photos.photo.length===0){
		$('#searchresult').html('No matched image was found!');
		$('#loading').css('visibility', 'hidden');
		return;
	}
	total = json.photos.pages;
	

	for(var i=0; i<perpage; i++){
		//console.log(i);
		$('<img id=\'img_'+i+'\' onclick="showLoading(\'img_'+i+'\')" title=\''+json.photos.photo[i].title+'\' src=\'https://c1.staticflickr.com/'+json.photos.photo[i].farm+'/'+json.photos.photo[i].server+'/'+json.photos.photo[i].id+'_'+json.photos.photo[i].secret+'.jpg\'>').load(function() {
			$(this).appendTo('#searchresult');
			$('#loading').css('visibility', 'hidden');
		});
	}
}
async function showLoading(id){
	$('#loading').css('visibility', 'visible');
	await promiseCall(id); 
}
function hideLoading(id){
	var ii=id.split('_')[1];
	$('#img_viewer').attr('src', getOriginalImage(json.photos.photo[ii].id));
	$('#img_viewer').load(function(e){
		$('#loading').css('visibility', 'hidden');
	});
	$('#btdownload a').attr('href', getOriginalImage(json.photos.photo[ii].id));
	$('#image_show').css('visibility', 'visible');
}
function promiseCall(id){
	return new Promise(resolve => {
		setTimeout(() => {
			hideLoading(id);
		}, 100);
	});
}

function getOriginalImage(id){
	var original = '';
	$.ajax({
        'async': false,
        'global': false,
		'type': 'GET',
        'url': 'https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=ce700cda22a7877d7fb50cf2ab1f2e35&photo_id='+id+'&format=json&nojsoncallback=1',
        'dataType': "json",
        'success': function (data) {
			original = data.sizes.size[data.sizes.size.length-1].source;
        }
    });
	return original;
}

var img_index = 0;

function scroolTop(){
	$('body,html').animate({
		scrollTop: 0
    }, 800);
}