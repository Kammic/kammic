describe('controller: EditorController', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='editor'></div>");
  });

  afterEach(function() {
    $("#editor").remove();
  });

  beforeEach(inject(function($rootScope, $controller, github) {
    this.github = github;
    this.scope  = $rootScope.$new();
    this.ctrl   = $controller('EditorController', {
      $scope: this.scope,
      $rootScope: this.scope
    });
  }));

  it('emits hideMenu when clicked', function(){
    var done = false;
    this.scope.$on('hideMenu', function(e) {
      done = true;
    });

    waitsFor(function() { return done; }, 'emit hideMenu on click', 100);
    this.scope.$element.click();
  });

  describe('localstorage', function() {
    env.localStorageCoolDownTime = 100;
    beforeEach(function() {
      localStorage.clear();
      this.scope.file = {path: 'some_path.md'};
    });

    var read_file = function(path) {
      return localStorage.getItem('some_path.md');
    }

    var has_data = function(path) {
      return (localStorage.getItem('some_path.md') != null) ? true: false;
    }

    it('Saves to localstorage when changed', function() {
      this.scope.editor.getSession().setValue('xyz');
      waitsFor(function() {
        return has_data('some_path.md');
      }, 'savesLocalFile', 200);
      runs(function() {
        expect(read_file('some_path.md')).toEqual('xyz');  
      });
    });

    it('Saves to localstorage on timer', function(){
      this.scope.editor.getSession().setValue('old data');
      this.scope.editor.getSession().setValue('new data');
      waitsFor(function() {
        return has_data('some_path.md');
      }, 'savesLocalFile', 200);
      runs(function() {
        expect(read_file('some_path.md')).toEqual('new data');
      });
    });

    it('Clears the data for file when performing save', function(){
      var done = false;
      this.scope.$on('saveFile', function() {
        done = true;
      });
      spy_and_return(this.github, 'saveFile', {content: 'test content'});
      this.scope.editor.getSession().setValue('xyz');
      this.scope.$emit('saveFile');

      waitsFor(function() { return done}, 'notify', 100);
      runs(function() {
        expect(read_file('some_path.md')).toEqual(null);  
      });
    });

    it('Saves the file path in changedFiles', function(){
      this.ctrl.lsSave();
      expect(this.ctrl.changedFiles()).toEqual({'some_path.md':true});
    });

    describe('Emit: savedLocal, clearedLocal', function(){
      it('emits savedLocal when lsSave', function(){
        check_emit(this.scope, 'savedLocal');
        this.ctrl.lsSave();
      });

      it('emits clearedLocal when lsClear', function(){
        check_emit(this.scope, 'clearedLocal');
        this.ctrl.lsClear();
        expect(has_data('some_path.md')).toEqual(false);
      });
    });

    describe('#resetFile', function(){
      it('removes a file from changedFiles', function(){
        this.ctrl.fileChanged('a.md');
        this.ctrl.fileChanged('b.md');

        this.ctrl.resetFile('a.md');
        expect(this.ctrl.changedFiles()).toEqual({'b.md':true});
      });

      it('works with a null path', function(){
        this.ctrl.fileChanged('a.md');
        this.ctrl.fileChanged('b.md');

        this.ctrl.resetFile();
        expect(this.ctrl.changedFiles()).toEqual({'a.md':true,'b.md':true});
      });
    });

    describe('#fileChanged', function(){
      it('appends to changedFiles', function(){
        this.ctrl.fileChanged('a.md');
        this.ctrl.fileChanged('b.md');
        this.ctrl.fileChanged('b.md');
        expect(this.ctrl.changedFiles()).toEqual({'a.md':true, 'b.md':true});
      });

      it('doesnt append when path is null', function(){
        this.ctrl.fileChanged();
        expect(this.ctrl.changedFiles()).toEqual({});
      });
    });

    describe('#changedFiles', function(){
      it('gives back a list of changed files in changedFiles', function(){
        files = {'test.md' : true, 'something_else.md': true};
        localStorage.setItem('changedFiles', JSON.stringify(files));
        expect(this.ctrl.changedFiles()).toEqual(files);
      });

      it('returns an empty array when changedFiles is not set', function(){
        localStorage.clear();
        expect(this.ctrl.changedFiles()).toEqual({});
      });
    });

    describe('#lsSave', function(){
      it('skips saving when the file is undefined', function(){
        this.scope.file = {};
        this.ctrl.lsSave();
        expect(has_data('some_path.md')).toEqual(false);
      });

      it('Saves the file', function(){
        this.ctrl.lsSave();
        expect(has_data('some_path.md')).toEqual(true);
      });
    });
  });

  xdescribe('Keyboard events', function(){
    it('emits saveFile when command+s', function(){
      skip();
      var done = false;
      this.scope.$on('saveFile', function(e) {
        done = true;
      });      
      waitsFor(function() { return done; }, 'emit saveFile on command+s', 100);
      $(".ace_content").simulate('keyboardEvent', 
                                  'keyUp', { metaKey: true, keyCode: 83 });
    });
  });

  describe('Event: windowResized', function() {
    it('resizes the element on windowResized', function() {
      var originalWidth = this.scope.$element.width();
      this.scope.$emit('windowResized', 50, 1);
      expect(this.scope.$element.width()).toNotEqual(originalWidth);
    });
  });

  describe('Event: loadFile', function() {
    it('updates the $scope.file', function(){
      this.scope.file = null;
      this.scope.$emit('loadFile', 'object_as_string');
      expect(this.scope.file).toEqual('object_as_string');
    });

    it('sets the ace editor value to object.content', function() {
      var file = {content: '#title'};
      this.scope.$emit('loadFile', file);

      var editorValue = this.scope.editor.getSession().getValue();
      expect(editorValue).toEqual('#title');
    });
  });

  describe('Event: fileSelected', function() {
    it('emits loadFile with response', function() {
      spy_and_return(this.github, 'getFile', {content: 'test content'});
      check_emit(this.scope, 'loadFile');

      var done = false;
      this.scope.$on('loadFile', function(e, file) {
        expect(file.content).toEqual('test content');
        done = true;
      });

      waitsFor(function(){ return done; }, 'emit loadFile w/ content', 100);
      this.scope.$emit('fileSelected', {path: 'some_remote_path'});
    });

    it('sets the path on the response', function(){
      spy_and_return(this.github, 'getFile', {content: 'test content'});
      var done = false;
      this.scope.$on('loadFile', function(e, file) {
        expect(file.path).toEqual('some_remote_path');
        done = true;
      });

      waitsFor(function(){ return done; }, 'emit loadFile w/ content', 100);
      this.scope.$emit('fileSelected', {path: 'some_remote_path'});
    });

    it('loads localstorage file if available', function() {
      localStorage.setItem('some_path.md', '112233');
      check_emit(this.scope, 'loadFile');
      this.scope.$emit('loadFile', {path: 'some_path.md', content: 'xyz'});
      expect(this.ctrl.markdown()).toEqual('112233');
    });
  });

  describe('Event: previewLoaded', function(){
    it('emits markdownUpdated', function(){
      var done = false;
      this.scope.editor.setValue('test content');
      this.scope.$on('markdownUpdated', function(e, content) {
        expect(content).toEqual('test content');
        done = true;
      });

      waitsFor(function(){
        return done;
      }, 'emit markdownUpdated w/ previewLoaded', 100);
      this.scope.$emit('previewLoaded');
    });
  });
});

