$(document).ready(function () {
    $("#idDangky").validate({
        rules: {
            email: {
                required: true
                },
            password: {
                required: true,
                minlength: 6
                },
            passwordConf: {
                required: true,
                equalTo: "#password"
            },
            phoneNumber: {
                required: true,
            },
            address: {
                required: true
            }
        }
    });
});