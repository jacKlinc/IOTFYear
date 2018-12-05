function valForm() {
    var x = document.getElementById("brokerURL").value;
    var y = document.getElementById("brokerURL").value;
    if (x == "" || x == null || y == "" || y == null) { // 
        alert("Name must be filled out");
        return false;
    }
}