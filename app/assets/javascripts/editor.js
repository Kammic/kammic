//= require_tree ./lib/angular
//= require ./lib/showdown/src/showdown

var Editor = function() {
  var aceEditor = null;
  var $editor    = $('#editor');
  var $preview   = $('#preview');
  var $container = $('#container');
  var mdConverter = new Showdown.converter();

  this.placeElements = function() {
    var documentWidth   = $(document).width();
    var documentHeight  = $(document).height();

    $editor.width(documentWidth/2.05);
    $preview.width(documentWidth/2.05);
  };

  this.updatePreviewPane = function() {
    $preview.html(mdConverter.makeHtml(aceEditor.getValue()));
  };

  this.setupEditor = function() {
    var editor  = ace.edit("editor");
    var shouldUpdatePreview = true;
    var context = this;

    editor.setTheme("ace/theme/twilight");
    editor.getSession().setUseWrapMode(true);
    editor.getSession().setMode("ace/mode/markdown");
    editor.on('change', function(e){
      if(!shouldUpdatePreview)
        return

      context.updatePreviewPane();
      setTimeout(function(){
        shouldUpdatePreview = true;
        context.updatePreviewPane();
      },100);
      shouldUpdatePreview = false;
    });
    return editor;
  };

  (function(){
    var context = this;
    aceEditor = this.setupEditor();

    $(window).resize(function() {
      context.placeElements();
    });
    context.placeElements();
    context.updatePreviewPane();
  }).call(this);

}

$(document).ready(function(){
  var editor = new Editor();  
});

