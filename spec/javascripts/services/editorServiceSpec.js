describe('service: editor', function() {
  beforeEach(module('Application'));
  beforeEach(inject(function(editor, changedFileQueue, github) {
    subject = editor;
    queue   = changedFileQueue;
    gh  = github;
  }));

  describe('#currentFile', function(){
    it('can set/get currentFile', function(){
      subject.currentFile({path: 'test.md'});
      expect(subject.currentFile()).toEqual({path: 'test.md'});
    });
  });

  describe('#currentPath', function(){
    it('can get currentPath', function(){
      expect(subject.currentFile()).toEqual(null);

      subject.currentFile({path: 'test.md'});
      expect(subject.currentPath()).toEqual('test.md');
    });
  });

  describe('changedFileQueue', function() {

    beforeEach(function(){
      localStorage.clear();
    });

    describe('#changedFiles', function(){
      it('retrieves the list of changed files', function(){
        queue.fileChanged('a.md');
        queue.fileChanged('b.md');
        expect(subject.changedFiles())
         .toEqual(['a.md', 'b.md']);
      });
    });

    describe('#resetFile', function(){
      it('removes file from changedFileQueue', function(){
        queue.fileChanged('a.md');
        queue.fileChanged('b.md');

        subject.resetFile('a.md');
        expect(subject.changedFiles())
         .toEqual(['b.md']);
      });
    });

    describe('#changedWithContent', function(){
      it('returns the content and file names of changed files', function(){
        queue.fileChanged('a.md');
        localStorage.setItem('a.md', 'xyz');

        expect(subject.changedWithContent()).toEqual({'a.md':'xyz'});
      });
    });

    describe('#saveAllChangedFiles', function(){
      it('saves all files from the queue', function() {
        queue.fileChanged('a.md');
        queue.fileChanged('b.md');
        spy_and_return(gh, 'saveFiles', {done: true});
        var done = false;
        subject.saveAllChangedFiles().then(function(status){
          done = true;
        });
        waitsFor(function(){return done;}, 'saveAllChangedFiles', 100);
        expect(subject.changedFiles()).toEqual([]);
      });
    });

  });

});
