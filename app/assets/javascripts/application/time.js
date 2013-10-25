$(document).on('page:change', function() {
  updateTimes();
});

$(document).ready(function(){
  updateTimes();
});

var updateTimes = function() {
  $('time').each(function(i, e) {
    var time = moment($(e).attr('datetime'));
    $(e).html('<span>' + time.fromNow() + '</span>');
  });
}
