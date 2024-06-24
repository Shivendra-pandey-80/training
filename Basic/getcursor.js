function getCursor(event) {
    let x = event.clientX;
    let y = event.clientY;
    

    const infoElement = document.getElementById('info');
    infoElement.innerHTML = _position;
    infoElement.style.top = y + "px";
    infoElement.style.left = (x + 20) + "px";
   infoElement.style.background = `rgb( ${x%255}, ${y%255}, ${((x + y)/2)%255})`;

}