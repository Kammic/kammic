// describe('service: githubFactory', function() {
//   beforeEach(function() {
//     auth_token = 'a17157d31accc9155e12f01825c8fc13fbf6137d';
//   });

//   beforeEach(module('Application'));
  
//   beforeEach(inject(function(githubFactory) {
//     factory = githubFactory;
//   }));

//   it('it can get a users repos', function() {
//     $.mockjax({ url:         '*user/repos*', 
//                 dataType:    'json', 
//                 status:       204, 
//                 responseText: {'test'}});
    
//     var called = false;
//     runs(function(){
//     factory.getRepos()
//       .done(function(repos) {
//         console.debug(repos);
//         called = true;
//       })
//       .fail(function(err) {
//         console.debug(err);
//         console.debug(called);
//         called = true;
//       });      
//     })


//     waitsFor(function() {
//       return called;
//     }, 'Fetch should end', 1000);

//     expect(called).toBe(true);
//   });
// });
