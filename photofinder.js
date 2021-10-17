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
var perpage = 20;

function drawText(){
	var canvas = document.getElementById('img_viewer');
	var ctx = canvas.getContext('2d');
	var x = canvas.width / 2;
	var y = 50;
    
	var lines = document.getElementById('txtarea').innerText.split('\n');
	if(lines.length<=2)
		y = canvas.height / 2;
	else if(lines.length<=3)
		y = 170;
	else if(lines.length<=4)
		y = 140;
	else if(lines.length<=5)
		y = 110;
	else if(lines.length<=6)
		y = 80;
	
	ctx.fillStyle=$('#txtarea').css('color');
	var fontsize = $('#txtarea').css('font-size');
	ctx.font='bold '+fontsize+" fantasy"; 
	var lineheight = parseInt(fontsize);
	ctx.textAlign="center"; 
	for(var i=0; i<lines.length; i++)
		ctx.fillText(lines[i],x,y+i*10*(lineheight/8)); 
}

$(document).ready(function(e){	
	writeData('flowers', 1);
	perpage = 100;
	
	$('#txtsearch').keyup(function(e){
		if(e.keyCode==13){
			writeData($(this).val(), page);
			scroolTop();
			page = 1;
		}
	});
	$('#btprev').click(function(e){
		if(page==0)
			return;
		page--;
		writeData($('#txtsearch').val(), page);
		scroolTop();
	});
	$('#btnext').click(function(e){
		if(page==total)
			return;
		page++;
		writeData($('#txtsearch').val(), page);
		scroolTop();
	});
	
	$('#btclose').click(function(e){
		$('#image_show').css('visibility', 'hidden');
		$('#txtarea').css('visibility', 'hidden');
		$('#myPNG').css('visibility', 'hidden');
	});
	
	$('#btpreview').click(function(e){
		drawText();
		$('#txtarea').css('visibility', 'hidden');
		var canvas = document.getElementById("img_viewer");
		$('#myPNG').html(Canvas2Image.convertToImage(canvas));
		$('#myPNG').css('visibility', 'visible');
	});
	
	$('#btreset').click(function(e){
		$('#img_'+img_index).click();
		$('#myPNG').css('visibility', 'hidden');
	});
	
	$('#colorpicker').change(function(e){
		$('#txtarea').css('color', $(this).val());
	});
	$('#sizepicker').change(function(e){
		$('#txtarea').css('font-size', $(this).val()+'pt');
	});
});

function writeData(keyword, page){
	$('#searchresult').off('click', 'img');
	$('.resultedimg').remove();
	$('#searchresult').html('');
	$('#loading').css('visibility', 'visible');
	dataRetrieval(keyword, page);	
	if(json.photos.photo.length===0){
		$('#searchresult').html('No matched image was found!');
		$('#loading').css('visibility', 'hidden');
		return;
	}
	total = json.photos.pages;
	

	for(var i=0; i<perpage; i++){
		$('<img class=\'resultedimg\' id=\'img_'+i+'\' title=\''+json.photos.photo[i].title+'\' src=\'https://c1.staticflickr.com/'+json.photos.photo[i].farm+'/'+json.photos.photo[i].server+'/'+json.photos.photo[i].id+'_'+json.photos.photo[i].secret+'.jpg\'>').load(function() {
			$(this).appendTo('#searchresult');
			$('#loading').css('visibility', 'hidden');
		});
		$('#searchresult').on('click', '#img_'+(i), function(e){
			$('#txtarea').css('visibility', 'visible');
			img_index = parseInt($(this).attr('id').split('_')[1]);
			var img = new Image();
			var canvas = document.getElementById('img_viewer');
			canvas.width = 500;
			canvas.height = 400;
			var context = canvas.getContext('2d');
			img.onload = function() {
				var ratioX = canvas.width/img.width;
				var ratioY = canvas.height/img.height;
				
				if(ratioX>ratioY){
					img.width = img.width*ratioX;
					img.height = img.height*ratioX;
					context.drawImage(img, 0, 0, canvas.width, canvas.height);
				}else{
					img.height = img.height*ratioY;
					img.width = img.width*ratioY;
					context.drawImage(img, 0, 0, canvas.width, canvas.height);
				}
			};
			img.src = $(this).attr('src');
			$('#image_show').css('visibility', 'visible');
			$('#txtarea').css('visibility', 'visible');
		});
	}
}

var img_index = 0;

function getCookie(name){
	var cookies = document.cookie.split(';');
	for(var i=0; i<cookies.length; i++){
		if(cookies[i].indexOf(name)>=0)
			return cookies[i].split('=')[1];
	}
	return 'true';
}

function scroolTop(){
	$('body,html').animate({
		scrollTop: 0
    }, 800);
}
