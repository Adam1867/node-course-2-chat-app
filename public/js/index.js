$(function() {

  var name = store.get('name');

  if ( name ) {
    $('input[name="name"]').val(name);
  }

  $('#message-form').on('submit', function (e) {
    var name = $(this).find('input[name="name"]').val();
    store.set( 'name', name );
  });

});
