<script>
    $(function() {
    $.ajax({
        type: "GET",
        xhrFields: { withCredentials: true },
        url: "/",
        success: function (userinfo) {
            if(getCookie('username') != undefined){
                if(getCookie('isAdmin') == "true"){
                    $("#edititem").css("display", "block")
                    $("#deleteitem").css("display", "block")
                }
            }
        }
    })
});
</script>