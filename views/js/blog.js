$(document).ready(function() {
    const quill = new Quill('#editor-container', {
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline']
          ]
        },
        placeholder: 'write your blog here',
        theme: 'snow'  // or 'bubble'
      });
    $("#saveButton").on('click', function() {

        let content = quill.editor.scroll.domNode.innerHTML;
        let title = $('#title').val();
        $.ajax({
            url : '/dashboard/writeBlog',
            method : 'POST',
            data : {content, title},
            success : function(data, textStatus, xhr) {
              window.location.href = '/dashboard'
            },
            error : function(xhr,status,error) {
              location.reload();
            }
        })
    })
})

