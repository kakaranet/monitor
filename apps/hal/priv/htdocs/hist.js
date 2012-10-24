function hist(ct, data,   x,y, w,h,  dh){
    MaxX = Math.max.apply(null, data);
    DX = (w/data.length) | 0;
    for(i=0; i<data.length; i++){
        X = i * DX + 2.0;
        W = DX - 4.0;
        H = ((h -dh) * (data[i]/MaxX)) | 0;
        Y = h - H;

        ct.strokeRect(x+X, y+Y, W, H);

        old_baseline = ct.textBaseline;
        old_text_align = ct.textAlign;
        ct.textBaseline = 'middle';
        ct.textAlign = 'center';
        ct.fillText(data[i], x+X + (W/2)|0, y+Y-dh/2);
        ct.textBaseline = old_baseline;
        ct.textAlign = old_text_align;
    }    
}
