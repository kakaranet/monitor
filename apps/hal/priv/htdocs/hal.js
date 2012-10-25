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

    if(!in_canvas($(el)[0], GMX, GMY)){
        var ctx = $(el)[0].getContext("2d");
        var blockName;
        if(jsonData.disks){
	        blockName = "D S K";
            ctx.fillStyle="#063831";
        }else if(jsonData.loads){
    	    blockName = "S Y S";
        }else if(jsonData.mem){
	        blockName = "M E M";
	        ctx.fillStyle="#552a49";
        } else if(jsonData.dht){
	        ctx.fillStyle='#0c4a7b';
	        blockName = "D H T";
        }

        ctx.fillRect(0,0,200,200);
        ctx.font="bold 45px Ubuntu";
        ctx.fillStyle="#F5F5F5";
        ctx.textAlign="right";
        if(blockName == "M E M"){   // I don't have letter spacing on canvas, and I need an exception for Ms badly so this have to do
            ctx.fillText("M",184,184);
            ctx.fillText("E",138,184);
            ctx.fillText("M",105,184);
        }else{
            ctx.fillText(blockName,184,184);
        }
        ctx.textAlign="left";

        if(jsonData.dht){
    	    console.log("DHT is array? "+ (jsonData.dht.constructor == Array));
	        ctx.font='8px Ubuntu';
	        ctx.strokeStyle='#FFFFFF';
	        ctx.fillStyle='#FFFFFF';
	        ctx.lineWidth = 1;
	        hist(ctx, jsonData.dht, 16,16,168,120, 12);
	        console.log("Hist " + jsonData.dht);
        }

        if(jsonData.disks){
	        ctx.fillStyle="#FFFFFF";
	        $.each(jsonData.disks, function(i, disk){
	            var y = i*15 + 16 + 12;
    	        ctx.font="12px Ubuntu";
	            ctx.fillText(disk.mount, 16, y);
                ctx.textAlign="right";
                bytes_ns = short_bytes(disk.size).split(' ');
	            ctx.fillText(long_n(bytes_ns[0]), 134, y);
                ctx.textAlign="left";
    	        ctx.font="10px Ubuntu";
	            ctx.fillText(bytes_ns[1], 137, y);
                ctx.textAlign="right";
    	        ctx.font="12px Ubuntu";
	            ctx.fillText(disk.use, 174, y);
    	        ctx.font="10px Ubuntu";
	            ctx.fillText("%", 184, y);
                ctx.textAlign="left";
	        });
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

//            jsonData.mem[0].total = 123456789;    // I have trouble retrieving this localy. I get noSuchObject all the time
//            jsonData.mem[0].used = 34567896;

	        ctx.fillStyle="#FFFFFF";
	        ctx.font="bold 15px Ubuntu";
	        ctx.fillText("Total: ", 16,50);
	        ctx.fillText("Used: ", 16,68);
	        ctx.font="15px Ubuntu";
            ctx.textAlign="right";
	        ctx.fillText(long_n(jsonData.mem[0].total) + " B", 184,50);
	        ctx.fillText(long_n(jsonData.mem[0].used) + " B", 184,68);
	        ctx.fillText(((jsonData.mem[0].used * 100 / jsonData.mem[0].total)|0) + " %", 184,86);
            ctx.textAlign="left";
        }

        ctx.fillStyle="#FFFFFF";
        ctx.font="bold 15px Ubuntu";
        ctx.fillText($(el).attr("id"),15,183);
    }
    setTimeout(function(){comet(el);el=null}, 5000);
}

function handleError(el, error){
    setTimeout(function(){comet(el);el=null}, 5000);
}

function in_canvas(canvas, x, y){   // I want a square to stop changing as someone is touching it. 
    br = canvas.getBoundingClientRect();
    if(x > br.left && x < br.left+br.width && y > br.top && y < br.top+br.height){
        return true;
    }else{
        return false;
    }
}

GMX = 0;
GMY = 0;
document.onmousemove = function(e){
    GMX = e.pageX;
    GMY = e.pageY;
}

/*

HAL colors (from http://www.halproject.com/hal/ )
blue
245c9d
0c4a7b
0c132d

violet
4b3351
552a49
714e90

red
750024

green
33583a
063831

black
121214

*/
