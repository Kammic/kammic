describe('service: editorState', function() {
  beforeEach(module('Application'));
  beforeEach(inject(function(editorState) {
    subject = editorState;
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

});
