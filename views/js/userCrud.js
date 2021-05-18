function deleteUser(el) {
    $.ajax({
        method : 'GET',
        url : `/dashboard/deleteUser${$(el).parent().attr('id')}`,
        success : function() {
            location.reload();
        }
    })
}