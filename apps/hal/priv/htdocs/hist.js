function hist(ct, data,   x,y, w,h,  dh, number_fun = short_n){
    var MaxX = Math.max.apply(null, data);
    var DX = (w/data.length) | 0;
    for(var i=0; i<data.length; i++){
        var X = i * DX + 2.0;
        var W = DX - 4.0;
        var H = ((h -dh) * (data[i]/MaxX)) | 0;
        var Y = h - H;

        ct.strokeRect(x+X, y+Y, W, H);

        var old_baseline = ct.textBaseline;
        var old_text_align = ct.textAlign;
        ct.textBaseline = 'middle';
        ct.textAlign = 'center';
        var sn = number_fun(data[i]);
        ct.fillText(sn, x+X + (W/2)|0, y+Y-dh/2);
        ct.textBaseline = old_baseline;
        ct.textAlign = old_text_align;
    }
}

function tab(ct, row_names, col_names, cols,   x,y, w,dh,  number_fun = short_r, inner_font=''){
    var W = cols.length;
    var H = cols[0].length;
    var old_baseline = ct.textBaseline;
    var old_text_align = ct.textAlign;

    var dy=0;
    if(col_names.length!=0){
        dy=1;
    }
    var dx=0;
    if(row_names.length!=0){
        dx=1;
    }

    ct.textAlign = 'left';
    ct.textBaseline = 'top';

    for(var i=0; i<row_names.length; i++){
        ct.fillText(row_names[i], x, y + (i+dy)*dh);
    }

    ct.textAlign = 'right';
    for(var j=0; j<col_names.length; j++){
        ct.fillText(col_names[j], x + w/(W+dx)*(j+dx+1), y);
    }

    var old_font = ct.font;
    if(inner_font!=''){
        ct.font = inner_font;
    }

    for(var j=0; j<W; j++){
        for(var i=0; i<H; i++){
            var sn = number_fun(cols[j][i]);
            ct.fillText(sn, x + w/(W+dx)*(j+dx+1), y + dh*(i+dy));
        }
    }
    ct.textBaseline = old_baseline;
    ct.textAlign = old_text_align;
    ct.font = old_font;
}

function long_n(n){
    if(!is_number(n))return n;
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
    if(!is_number(n))return n;
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
    if(!is_number(n))return n;
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

function short_r(n){
    if(!is_number(n))return n;
    if(n>=1000){
        return short_n(n|0);
    }else if(n>=1){
        return (""+n).substring(0,5);
    }else if(n>0.001){
        return short_r(n*1000)+" m";
    }else if(n>0.000001){
        return short_r(n*1000000)+" μ";
    }else if(n>0.000000001){
        return short_r(n*1000000000)+" n";
    }else if(n>0.000000000001){
        return short_r(n*1000000000000)+" p";
    }
}
function no_n(n){
    return "";
}

function is_number(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
