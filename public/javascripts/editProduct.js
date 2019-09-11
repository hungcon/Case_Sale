$(document).ready(function () {
    $("#suataikhoan").validate({
        rules: {
            email: {
                required: true
                },
            newPassword: {
                required: true,
                minlength: 6
                },
            passwordConf: {
                required: true,
                equalTo: "#newPassword"
            }
        }
    });
});