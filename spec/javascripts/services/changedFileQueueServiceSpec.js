describe('service: changedFileQueue', function() {
  beforeEach(module('Application'));
  beforeEach(inject(function(changedFileQueue) {
    subject = changedFileQueue;
  }));

  beforeEach(function(){
    localStorage.clear();
  });

  describe('#namespace', function(){
    it('sets/gets the namespace', function(){
      subject.namespace('some_namespace');
      expect(subject.namespace()).toEqual('some_namespace');
    });
  });

  describe('#resetFile', function(){
    it('removes a file from changedFiles', function(){
      subject.fileChanged('a.md');
      subject.fileChanged('b.md');

      subject.resetFile('a.md');
      expect(subject.changedFiles()).toEqual({'b.md':true});
    });

    it('works with a null path', function(){
      subject.fileChanged('a.md');
      subject.fileChanged('b.md');

      subject.resetFile();
      expect(subject.changedFiles()).toEqual({'a.md':true,'b.md':true});
    });
  });

  describe('#fileChanged', function(){
    it('appends to changedFiles', function(){
      subject.fileChanged('a.md');
      subject.fileChanged('b.md');
      subject.fileChanged('b.md');
      expect(subject.changedFiles()).toEqual({'a.md':true, 'b.md':true});
    });

    it('doesnt append when path is null', function(){
      subject.fileChanged();
      expect(subject.changedFiles()).toEqual({});
    });
  });

  describe('#changedFiles', function(){
    it('gives back a list of changed files in changedFiles', function(){
      files = {'test.md' : true, 'something_else.md': true};
      localStorage.setItem('changedFiles', JSON.stringify(files));
      expect(subject.changedFiles()).toEqual(files);
    });

    it('returns an empty array when changedFiles is not set', function(){
      localStorage.clear();
      expect(subject.changedFiles()).toEqual({});
    });
  });

});
