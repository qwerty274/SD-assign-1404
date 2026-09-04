
let firstimg= "https://static.vecteezy.com/system/resources/thumbnails/015/268/932/small/the-wood-text-hello-image-png.png";
let secondimg= "https://png.pngtree.com/png-clipart/20210313/ourmid/pngtree-hello-text-effects-photoshop-png-image_105649.jpg";
function changeIMG(){
    //document.getElementById('img1').src = "https://png.pngtree.com/png-clipart/20210313/ourmid/pngtree-hello-text-effects-photoshop-png-image_105649.jpg";
    const image = document.getElementById('img1');
    if(image.src === firstimg){
        image.src = secondimg;
    }
    else{
        image.src = firstimg;
    }
}