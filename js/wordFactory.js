angular.module('wordScramble')
  .factory('wordFactory', ['$http', '$log', '$q', function($http, $log, $q){

    return {
      //get random word from wordnik api
      getWord: function(){
        var req = {
          method: 'GET',
          url: 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&includePartOfSpeech=noun&minCorpusCount=1&maxCorpusCount=-1&minDictionaryCount=10&maxDictionaryCount=-1&minLength=5&maxLength=8&api_key=8dba4744d147470de953d228e1788d494480af9c8a004769a'
        };
        var deferred = $q.defer();
        $http(req)
          .success(function(data){
            $log.log(data);
            deferred.resolve(data)
          })
          .error(function(e){
            deferred.reject(e);
          });
        return deferred.promise;
      },
      //reverse lookup from wordnik api
      checkDictionary: function(str){
        var deferred = $q.defer();
        var req = {
          method: 'GET',
          url: 'http://api.wordnik.com:80/v4/words.json/reverseDictionary?query=' + str + '&minCorpusCount=5&maxCorpusCount=-1&minLength=1&maxLength=-1&includeTags=false&skip=0&limit=10&api_key=8dba4744d147470de953d228e1788d494480af9c8a004769a'
        };
        $http(req)
          .success(function(data){
            $log.log(data);
            deferred.resolve(data)
          })
          .error(function(e){
            deferred.reject(e);
          });
        return deferred.promise;
      }
    };
  }]);
