describe('controller: EditorController', function() {
  beforeEach(function() {
    module('Application');
    $("body").append("<div id='editor'></div>");
  });

  afterEach(function() {
    $("#editor").remove();
  });

  beforeEach(inject(function($rootScope, $controller,
                              editor, github, changedFileQueue) {
    this.github = github;
    this.editor = editor;
    this.changedFileQueue = changedFileQueue;
    this.scope  = $rootScope.$new();
    this.ctrl   = $controller('EditorController', {
      $scope: this.scope,
      $rootScope: this.scope
    });
  }));

  it('emits hideMenu when clicked', function() {
    var done = false;
    this.scope.$on('hideMenu', function(e) {
      done = true;
    });

    waitsFor(function() { return done; }, 'emit hideMenu on click', 100);
    this.scope.$element.click();
  });

  describe('localstorage', function() {
    env.localStorageCoolDownTime = 10;
    env.previewUpdateCoolDownTime = 10;

    beforeEach(function() {
      localStorage.clear();
      this.editor.currentFile({path: 'some_path.md'});
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
      this.scope.$emit('saveLocalFile');

      waitsFor(function() {
        return has_data('some_path.md');
      }, 'savesLocalFile', 500);
      runs(function() {
        expect(read_file('some_path.md')).toEqual('new data');
      });
    });

    describe('editor.on change', function(){
      it('files saveLocalFile only if not loading', function(){
        var called = false;
        this.scope.loading = true;
        this.scope.$on('saveLocalFile', function(){
          called = true;
        });
        this.scope.editor.getSession().setValue('old data');
        expect(called).toEqual(false);
      });
    });

    describe('Event: saveFile', function() {
      it('emits showLoading and hideLoading when saving', function(){
        check_emit(this.scope, 'showLoading');
        check_emit(this.scope, 'hideLoading');
        spy_and_return(this.github, 'saveFile', {content: 'test content'});

        this.scope.$emit('saveFile');
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

      it('Emits saved when saveFile is successful', function(){
        spy_and_return(this.github, 'saveFile', {content: 'test content'});
        check_emit(this.scope, 'saved');
        this.scope.$emit('saveFile');
      });

      it('Saves the file path in changedFiles', function() {
        var context = this;
        var done = false;
        spyOn(this.changedFileQueue, 'fileChanged');
        this.scope.$on('savedLocal', function(){
          expect(context.changedFileQueue.fileChanged).toHaveBeenCalled();
          done = true;
        });

        waitsFor(function(){return done;}, 'done', 200);
        this.scope.$emit('saveLocalFile');
      });
    });

    describe('Emit: savedLocal, clearedLocal', function(){
      it('emits savedLocal when lsSave', function(){
        check_emit(this.scope, 'savedLocal');
        this.scope.$emit('saveLocalFile');
      });

      it('emits clearedLocal when saveFile', function(){
        spy_and_return(this.github, 'saveFile', {});
        check_emit(this.scope, 'clearedLocal');
        this.scope.$emit('saveFile');
        expect(has_data('some_path.md')).toEqual(false);
      });
    });

    describe('Event: saveLocalFile', function(){
      it('skips saving when the file is undefined', function(){
        this.editor.currentFile({});
        this.scope.$emit('saveLocalFile');
        expect(has_data()).toEqual(false);
      });



      it('Saves the file', function(){
        this.editor.currentFile({path: 'some_path.md', content: 'stuff'});
        this.scope.$emit('saveLocalFile');
        waitsFor(function(){ return has_data();}, 'has data', 100);
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

  describe('Event: loadFile', function() {
    it('updates the editor service', function() {
      this.editor.currentFile({});
      this.scope.$emit('loadFile', {path: 'object_as_string'});
      expect(this.editor.currentFile()).toEqual({path: 'object_as_string'});
    });

    it('sets the ace editor value to object.content', function() {
      var file = {path: 'xyz.md', content: '#title'};
      this.scope.$emit('loadFile', file);

      var editorValue = this.scope.editor.getSession().getValue();
      expect(editorValue).toEqual('#title');
    });

    it('sets the editor to be writable', function() {
      var file = {path: 'xyz.md', content: '#title'};
      this.scope.$emit('loadFile', file);
      expect(this.scope.editor.getReadOnly()).toEqual(false);
    });
  });

  describe('Event: showLoading/hideLoading', function(){
    it('showLoading sets $scope.loading to true', function(){
      this.scope.loading = false;
      this.scope.$emit('showLoading');
      expect(this.scope.loading).toEqual(true);
    });

    it('hideLoading sets $scope.loading to false', function(){
      this.scope.loading = true;
      this.scope.$emit('hideLoading');
      expect(this.scope.loading).toEqual(false);
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

    it('emits startLoadFile and endLoadFile', function(){
      spy_and_return(this.github, 'getFile', {content: 'test content'});
      check_emit(this.scope, 'showLoading');
      check_emit(this.scope, 'hideLoading');
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

    it('waits for a cooldown timer to emit markdownUpdated', function(){
      expect(this.scope.previewUpdateTimer).toBeUndefined();
      this.scope.editor.getSession().setValue('old data');
      expect(this.scope.previewUpdateTimer).toBeDefined();
    });
  });
});

