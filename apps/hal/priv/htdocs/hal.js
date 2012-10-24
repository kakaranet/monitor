function handleAgentData(el, jsonData)
{
    for (var i in jsonData)
    {
        console.log("Element of object:"+ jsonData[i]);
    }
    console.log(JSON.stringify(jsonData));

    for(id in jsonData)
    {
        if(jsonData.hasOwnProperty(id))
        {
            $(el).removeClass(function(){$(this).attr('class')}); 
            $(el).addClass(id);
	}
    }

    var ctx = $(el)[0].getContext("2d");
    var blockName;
    var total;
    var used;
    if(jsonData.disks){
	blockName = "DSK";
	 ctx.fillStyle="#a5AA22";
    }else if(jsonData.loads){
	blockName = "SYS";
    }else if(jsonData.mem){
	blockName = "MEM";
	ctx.fillStyle="#aa54ff";
	total = jsonData.mem.total;
	used = jsonData.mem.used;
    } else if(jsonData.dht){
	ctx.fillStyle='#777777';
	blockName = "DHT";
    }

    ctx.fillRect(0,0,200,200);
    ctx.font="bold 45px Ubuntu";
    ctx.fillStyle="#FFFFFF";
    ctx.fillText(blockName,70,160);

    if(jsonData.dht){
	console.log("DHT is array? "+ (jsonData.dht.constructor == Array));
	ctx.font='7px Ubuntu';
	ctx.strokeStyle='#FFFFFF';
	ctx.fillStyle='#FFFFFF';
	ctx.lineWidth = 1;
	hist(ctx, jsonData.dht, 20,20,160,100, 12);
	console.log("Hist " + jsonData.dht);
    }


    if(jsonData.disks){
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

    }

    if(jsonData.loads){
	$.each(jsonData.loads, function(i, load){
	    var y = i*13 + 35;
	    ctx.fillText(i, 12, y);
	    ctx.fillText(load.total, 30, y);
	    ctx.fillText(load.used, 100, y);
	    ctx.fillText(load.cpu_load, 172, y);
	});
    }

    if(jsonData.mem){
	ctx.fillStyle="#FFFFFF";
	ctx.font="bold 15px Ubuntu";
	ctx.fillText("total: "+jsonData.mem[0].total, 10,50);
	ctx.fillText("used: "+jsonData.mem[0].used, 10,68);
    }

    ctx.fillStyle="#FFFFFF";
    ctx.font="bold 15px Ubuntu";
    ctx.fillText($(el).attr("id"),10,180);
    setTimeout(function(){comet(el);el=null}, 2000)
}

function handleError(el, error){
    setTimeout(function(){comet(el);el=null}, 5000);
}