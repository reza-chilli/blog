function deleteUser(el) {
    $.ajax({
        method : 'GET',
        url : `/dashboard/deleteUser${$(el).parent().attr('id')}`,
        success : function() {
            location.reload();
        }
    })
}

function restorePass(el) {
    $("#confirmPassBtn").on('click', function() {
        $.ajax({
            method : 'GET',
            url : `/dashboard/restorePass${$(el).parent().attr('id')}`,
            success : function() {
                alert('restore success');
            }
        })
    })
}