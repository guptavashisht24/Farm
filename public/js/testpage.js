function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

$(function() {
    $.ajax({
        type: "GET",
        xhrFields: { withCredentials: true },
        url: "/",
        success: function (userinfo) {
            if(getCookie('username') != undefined){
                $('#userIcon').html('Hello, ' + getCookie('username'));
            }
        }
    });
});