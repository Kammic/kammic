describe('service: editor', function() {
  beforeEach(module('Application'));
  beforeEach(inject(function(editor, changedFileQueue, github) {
    subject = editor;
    queue   = changedFileQueue;
    gh      = github;
  }));


  describe('#namespace', function(){
    it('can set/get namespace', function() {
      subject.namespace('test');
      expect(subject.namespace()).toEqual('test');
    });

    it('calls namespace on queue', function(){
      spyOn(queue, 'namespace');
      subject.namespace('test');
      expect(queue.namespace).toHaveBeenCalledWith('test');
    });
  });

  describe('#currentFile', function() {
    it('can set/get currentFile', function() {
      subject.currentFile({path: 'test.md'});
      expect(subject.currentFile()).toEqual({path: 'test.md'});
    });

    it('calls lastEditedFile w/ the file object', function() {
      spyOn(subject, 'lastEditedFile');
      subject.currentFile({path: 'xyz.md'});
      expect(subject.lastEditedFile).toHaveBeenCalledWith('xyz.md');
    });
  });

  describe('#currentPath', function(){
    it('can get currentPath', function(){
      expect(subject.currentFile()).toEqual(null);

      subject.currentFile({path: 'test.md'});
      expect(subject.currentPath()).toEqual('test.md');
    });
  });

  describe('#format', function(){
    it('can find the correct format for a path', function(){
      expect(subject.format('test.rb')).toEqual('ruby');
      expect(subject.format('test.md')).toEqual('markdown');
      expect(subject.format('test1.2.3.md')).toEqual('markdown');
      expect(subject.format('test1.2.3.rb')).toEqual('ruby');
      expect(subject.format('test.mdz')).toEqual(undefined);
    });
  });

  describe('#lastEditedFile', function(){
    beforeEach(function(){
      localStorage.clear();
    });

    it('returns the lastEditedFile without a path', function(){
      subject.lastEditedFile('xyzz.md');
      expect(subject.lastEditedFile()).toEqual('xyzz.md');
    });

    it('returns the lastEditedFile without a path', function(){
      subject.namespace('repo');
      localStorage.setItem('repo-lastEditedFile', 'xyz.md');
      expect(subject.lastEditedFile()).toEqual('xyz.md');
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

    describe("#resetAllFiles", function(){
      it('removes all the files from changedFileQueue', function(){
        queue.fileChanged('a.md');
        queue.fileChanged('b.md');

        subject.resetAllFiles();
        expect(subject.changedFiles()).toEqual([]);
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
        spyOn(gh, 'saveFiles');

        var expectedFiles = {'a.md': null};
        subject.saveAllChangedFiles();
        expect(gh.saveFiles).toHaveBeenCalledWith(expectedFiles, 'Updated pending files');
      });

      it('saves all files with custom message', function(){
        queue.fileChanged('a.md');
        queue.fileChanged('b.md');
        spyOn(gh, 'saveFiles');
        var expectedFiles = {'a.md': null, 'b.md': null};

        subject.saveAllChangedFiles('my changes');
        expect(gh.saveFiles).toHaveBeenCalledWith(expectedFiles, 'my changes');
      });
    });

    describe('#localStorage', function() {
      beforeEach(function(){
        localStorage.clear();
      });

      describe('#localSave', function() {
        it('rejects without path and content', function() {
          expect(function(){
            subject.localSave();
          }).toThrow('path is required');
          expect(function(){
            subject.localSave('some.md')
          }).toThrow('content is required');
        });

        it('rejects a file if path is null', function(){
          subject.localSave(null, 'xyz');
          expect(localStorage.getItem('null')).toEqual(null);
        });

        it('saves to localStorage', function() {
          subject.localSave('test.md', 'test content');
          var content = localStorage.getItem('test.md');
          expect(content).toEqual('test content');
        });
      });

      describe('#localDelete', function() {
        it('reject without a path', function() {
          expect(function(){
            subject.localDelete();
          }).toThrow('path is required');
        });

        it('deletes the item', function() {
          localStorage.setItem('xyz.md', 'test content');
          subject.localDelete('xyz.md');
          expect(localStorage.getItem('xyz.md')).toEqual(null);
        });
      });

      describe('#localRead', function() {
        it('rejects without path', function(){
          expect(function() {
            subject.localRead();
          }).toThrow('path is required');
        });

        it('reads from storage', function(){
          localStorage.setItem('some_file.md', 'test content');
          expect(subject.localRead('some_file.md')).toEqual('test content');
        });
      });

    });
  });

});
