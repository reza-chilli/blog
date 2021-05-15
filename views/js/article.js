$(document).ready(function() {
    $('#deleteBtn').on('click', function() {
        $.ajax({
            url : `/dashboard/deleteArticle${window.location.href.slice(39, )}`,
            method : 'GET',
            success : function() {
                window.location.href = '/dashboard'
            }
        })
    })
})