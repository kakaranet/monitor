function hist(ct, data,   x,y, w,h,  dh){
    var MaxX = Math.max.apply(null, data);
    var DX = (w/data.length) | 0;
    for(var i=0; i<data.length; i++){
        var X = i * DX + 2.0;
        var W = DX - 4.0;
        var H = ((h -dh) * (data[i]/MaxX)) | 0;
        var Y = h - H;

        ct.strokeRect(x+X, y+Y, W, H);

        old_baseline = ct.textBaseline;
        old_text_align = ct.textAlign;
        ct.textBaseline = 'middle';
        ct.textAlign = 'center';
        sn = short_n(data[i]);
        ct.fillText(sn, x+X + (W/2)|0, y+Y-dh/2);
        ct.textBaseline = old_baseline;
        ct.textAlign = old_text_align;
    }
}

function long_n(n){
    var sn = "" + n;
    for(var i=0; i<8; i++){
        MN = 3+i*4;
        if(sn.length>MN){
            sn = sn.substring(0, sn.length-MN) + " " + sn.substring(sn.length-MN, sn.length);
        }
    }
    return sn;
}

function short_n(n){
    var sn = "" + n;
    if(sn.length>4 && sn.length<=7){
        sn = long_n(sn.substring(0, sn.length-3)) + " k";
    }else if(sn.length>7 && sn.length<=10){
        sn = long_n(sn.substring(0, sn.length-6)) + " M";
    }else if(sn.length>10 && sn.length<=13){
        sn = long_n(sn.substring(0, sn.length-9)) + " G";
    }else if(sn.length>13 && sn.length<=16){
        sn = long_n(sn.substring(0, sn.length-12)) + " T";
    }else if(sn.length>16 && sn.length<=19){
        sn = long_n(sn.substring(0, sn.length-15)) + " P";
    }else if(sn.length>19){
        sn = long_n(sn.substring(0, sn.length-18)) + " E";
    }else{
        long_n(n);
    }
    return sn;
}

function short_bytes(n){
    if(n<1024*10){
        return ""+n+" B";
    }else if(n<1024*1024*10){
        return "" + (n/1024|0) + " kB";
    }else if(n<1024*1024*1024*10){
        return "" + ((n/(1024*1024))|0) + " MB";
    }else if(n<1024*1024*1024*1024*10){
        return "" + ((n/(1024*1024*1024))|0) + " GB";
    }else if(n<1024*1024*1024*1024*1024*10){
        return "" + ((n/(1024*1024*1024*1024))|0) + " TB";
    }else if(n<1024*1024*1024*1024*1024*1024*10){
        return "" + ((n/(1024*1024*1024*1024*1024))|0) + " PB";
    }else if(n<1024*1024*1024*1024*1024*1024*1024*10){
        return "" + ((n/(1024*1024*1024*1024*1024*1024))|0) + " EB";
    }
}
