function handleAgentData(el, jsonData){
    for(id in jsonData){
	if(jsonData.hasOwnProperty(id)){
	    $(el).removeClass(function(){$(this).attr('class')}); 
	    $(el).addClass(id);
	}
    }

    var ctx = $(el)[0].getContext("2d");
    ctx.fillStyle="#a5AA22";
    ctx.fillRect(0,0,200,200);
    ctx.font="bold 45px Ubuntu";
    ctx.fillStyle="#FFFFFF";
    ctx.fillText("DSK",70,140);
    ctx.fillStyle="#FFFFFF";
    ctx.font="bold 13px Ubuntu";
    ctx.fillText("N  Mount          Size, Kb    Use,%", 10, 20);
    ctx.fillStyle="#FFFFFF"; 
    ctx.font="bold 11px Ubuntu";

    $.each(jsonData.disks, function(i, disk){
	var y = i*13 + 35; 
	ctx.fillText(i, 12, y); 
	ctx.fillText(disk.mount, 30, y);
	ctx.fillText(disk.size, 100, y);
	ctx.fillText(disk.use, 172, y);
    }); 

    ctx.strokeStyle="#FFFFFF";
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(10,23);ctx.lineTo(20, 23);
    ctx.moveTo(27,23);ctx.lineTo(67, 23);
    ctx.moveTo(100,23);ctx.lineTo(150, 23);
    ctx.moveTo(160,23);ctx.lineTo(190, 23);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle="#FFFFFF";
    ctx.font="bold 15px Ubuntu";
    ctx.fillText($(el).attr("id"),10,180);
    setTimeout(function(){comet(el);el=null}, 2000)
}

function handleError(el, error){
    $(el).removeClass(function(){$(this).attr('class')}); 
    $(el).addClass("error");
    setTimeout(function(){comet(el);el=null}, 5000);
}