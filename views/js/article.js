$(document).ready(function() {
  let quill = new Quill('#editor-container', {
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline']
      ]
    },
    placeholder: 'write your blog here',
    theme: 'snow'  // or 'bubble'
  });;
  $(".ql-toolbar").css('display', 'none')
    $('#deleteBtn').on('click', function() {
        $.ajax({
            url : `/dashboard/deleteArticle${window.location.href.slice(39, )}`,
            method : 'GET',
            success : function() {
                window.location.href = '/dashboard'
            }
        })
    })
    $("#editBtn").on('click', function() {

        $(this).css('display', 'none');
        $("#deleteBtn").css('display', 'none')
        $("#saveBtn").css('display', 'inline')
        $("#cancelBtn").css('display', 'inline')
        $(".ql-toolbar").css('display', 'block')
        $("#editor-container").css('display', 'block')
        $("#content-para").css('display', 'none')

    })
    $('#cancelBtn').on('click', function() {

      $("#deleteBtn").css('display', 'inline');
      $("#editBtn").css('display', 'inline');
      $('#saveBtn').css('display', 'none');
      $('#cancelBtn').css('display', 'none');
      $(".ql-toolbar").css('display', 'none')
      $("#editor-container").css('display', 'none')
      $("#content-para").css('display', 'block')
    })

    $("#saveBtn").on('click', function() {
      let content = quill.editor.scroll.domNode.innerHTML;
      $.ajax({
        url : `/dashboard/editArticle${window.location.href.slice(39, )}`,
        method : 'POST',
        data : { content },
        success : function() {
          location.reload();
        }
      })
    })
})