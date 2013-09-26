describe('service: editorState', function() {
  beforeEach(module('Application'));
  beforeEach(inject(function(editorState) {
    subject = editorState;
  }));

  describe('currentFile', function(){
    it('can set/get currentFile', function(){
      subject.currentFile({path: 'test.md'});
      expect(subject.currentFile()).toEqual({path: 'test.md'});
    });

  });
});
