var Editor = function() {
  this.aceEditor = null;

  var $editor    = $('#editor');
  var $preview   = $('#preview');
  var $container = $('#container');

  this.placeElements = function() {
    var documentWidth   = $(document).width();
    var documentHeight  = $(document).height();

    $editor.width(documentWidth/2);
    $preview.width(documentWidth/2);
  };

  (function(){
    var editor  = ace.edit("editor");
    var context = this;
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/markdown");
    context.aceEditor = editor;

    $(window).resize(function() {
      context.placeElements();
    });
    context.placeElements();
  }).call(this);

}

var editor = new Editor();
