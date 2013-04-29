var SHOW_TIME = 4000;
var extra_TIME = 4000;
var EXTRA_TIME_ATT = 0.98;
var UPD_QUANT = 100;

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

    extra_TIME *= EXTRA_TIME_ATT;   // it gets a little bit faster each reload
    update(el, jsonData, SHOW_TIME + extra_TIME);
}

function update(el, jsonData, time){
    var new_time;
    if(!in_canvas($(el)[0], GMX, GMY)){
        new_time = time-UPD_QUANT;
    }else{
        new_time = time;    //  hold on focus
    }

    if(in_canvas($(el)[0], GCX, GCY)){
        GCX = 0;
        GCY = 0;
        new_time = 0;   // next on click
    }
    
    if(new_time<=0){
        comet(el);
        el=null;
    }else{
        draw(el, jsonData);
        setTimeout(function(){update(el, jsonData, new_time);}, UPD_QUANT);
    }
}

function draw(el, jsonData){
    var ctx = $(el)[0].getContext("2d");
    ctx.globalAlpha = 0.5;

    var blockName;    
    if(jsonData.disks){
        blockName = "DSK";
        ctx.fillStyle="#063831";
    }else if(jsonData.loads){
	    blockName = "SYS";
    }else if(jsonData.mem){
	    blockName = "MEM";
	    ctx.fillStyle="#552a49";
    } else if(jsonData.dht){
	    ctx.fillStyle='#0c4a7b';
	    blockName = "DHT";
    } else if(jsonData.dht2){
	    ctx.fillStyle="#0c132d";
	    blockName = "DH2";
    } else if(jsonData.rabbit){
	    ctx.fillStyle="#ffbf00";
	    blockName = "RBT";
    }

    ctx.globalAlpha = 0.9;
    ctx.fillRect(0,0,200,200);
    ctx.font="bold 45px Ubuntu";
    ctx.fillStyle="#F5F5F5";
    ctx.textAlign="right";
    ctx.fillText(blockName[2],184,184);
    ctx.textAlign="center";
    ctx.fillText(blockName[1],127,184);
    ctx.textAlign="left";
    ctx.fillText(blockName[0],70,184);

    if(jsonData.dht){
        ctx.font='8px Ubuntu';
        ctx.strokeStyle='#FFFFFF';
        ctx.fillStyle='#FFFFFF';
        ctx.lineWidth = 1;
        hist(ctx, jsonData.dht, 16,16,168,120, 12);
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

    if(jsonData.dht2){
        $.each(jsonData.dht2, function(i, block){
            ctx.fillStyle="#FFFFFF";
            ctx.font="bold 12px Ubuntu";
            ctx.textAlign="left";
            ctx.fillText("Hangoff timeout:", 16, 28);
            ctx.fillText("GET's total:", 16, 46);
            ctx.fillText("PUT's total:", 16, 64);
            ctx.fillText("CPU avg15:", 16, 82);
            ctx.fillText("GET time median:", 16, 100);
            ctx.fillText("PUT time median:", 16, 118);
            ctx.fillStyle="#FFFFFF";
            ctx.textAlign="right";
            ctx.font="15px Ubuntu";
            ctx.fillText(block.handoff_timeouts, 184, 28);
            ctx.fillText(block.node_gets_total, 184, 46);
            ctx.fillText(block.node_puts_total, 184, 64);
            ctx.fillText(block.cpu_avg15, 184, 82);
            ctx.fillText(asciiToString(block.node_get_fsm_time_median), 184, 100);
            ctx.fillText(asciiToString(block.node_put_fsm_time_median), 184, 118);
            ctx.textAlign="left";
        });
    }

    if (jsonData.rabbit) {
        $.each(jsonData.rabbit, function(i, block){
            ctx.fillStyle="#FFFFFF";
            ctx.font="bold 12px Ubuntu";
            ctx.textAlign="left";
            ctx.fillText("CPU:", 16, 28);
            ctx.fillText("MEM:", 16, 46);
            ctx.fillText("QUEUES:", 16, 64);
            ctx.fillStyle="#FFFFFF";
            ctx.textAlign="right";
            ctx.font="15px Ubuntu";
            ctx.fillText(block.cpu_avg15, 184, 28);
            ctx.fillText(((jsonData.mem[0].used * 100 / jsonData.mem[0].total)|0) + " % of " + long_n(jsonData.mem[0].total) + " B", 184, 46);
            ctx.fillText("not implemented", 184, 64);
            ctx.textAlign="left";
        });
    }

    ctx.fillStyle="#FFFFFF";
    ctx.font="bold 7px Ubuntu";
    ctx.fillText($(el).attr("id"),15,183);
}

function handleError(el, error){
    setTimeout(function(){comet(el);el=null}, 5000);
}

function in_canvas(canvas, x, y){
    br = canvas.getBoundingClientRect();
    if(x > br.left && x < br.left+br.width && y > br.top && y < br.top+br.height){
        return true;
    }else{
        return false;
    }
}

function asciiToString (asciiArray){
    var str = "";
    var len = asciiArray.length;
    for(var i=0; i<len; i++){
	str += String.fromCharCode(asciiArray[i]);
    }
    return str;
}

var GMX = 0;
var GMY = 0;
document.onmousemove = function(e){
    GMX = mouse_x(e);
    GMY = mouse_y(e);
}

var GCX = 0;
var GCY = 0;
document.onclick = function(e){
    GCX = mouse_x(e);
    GCY = mouse_y(e);
}


function mouse_x(e){
    if (e.pageX){
        return e.pageX;
    }else if (e.clientX) {
        return e.clientX + xScrollLeft();
    }
}

function mouse_y(e){
    if (e.pageY){
        return e.pageY;
    }else if (e.clientY) {
        return e.clientY + yScrollLeft();
    }
}

/*

HAL colors
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
