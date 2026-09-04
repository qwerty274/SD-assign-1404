function addTask(){
    document.getElementById('myInput').value = "";
    document.getElementById('myUL').innerHTML += "<li>" + document.getElementById('myInput').value + "</li>";
}