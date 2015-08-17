angular.module('wordScramble',['ngAnimate'])
  .controller('wordCtrl', ['$scope', '$http', '$log', '$q', 'wordFactory',
    function ($scope, $http, $log, $q, wordFactory){
      var count = 0;
      $scope.count = count;

      function init(){
        //reset arrays
        $scope.originalWord = [];
        $scope.guess = [];
        $scope.scrambledWord = [];
        //get word from api
        wordFactory.getWord().then(function(data){
            $log.log(data.word);
            var word = data.word;
            $scope.originalWord = word.toUpperCase().split("");
            wordArray(data.word);
        });
      };
      //turn word into array
      function wordArray(str){
        word = str.toUpperCase().split("");
        newWord = shuffleWord(word);
        $scope.scrambledWord = newWord;
      };
      //scramble word
      function shuffleWord(array){
        var tmp, current, top = array.length;

        if(top) while(--top) {
        	current = Math.floor(Math.random() * (top + 1));
        	tmp = array[current];
        	array[current] = array[top];
        	array[top] = tmp;
        }
        return array;
      };
      //check user input
      $scope.check = function(event){
        if (event.keyCode === 8){//backspace
          event.preventDefault();
          lastGuess = $scope.guess[$scope.guess.length-1];
          $scope.scrambledWord.push(lastGuess);
          //remove last user input
          $scope.guess = $scope.guess.slice(0,-1);
        } else {
          if(!event.metaKey){
            userGuess = String.fromCharCode(event.keyCode);
            userGuess = userGuess.toUpperCase().split("");
            for (var i=$scope.scrambledWord.length-1; i>=0;i--){
              if($scope.scrambledWord[i] == userGuess){
                $scope.guess.push(userGuess.join(""));
                $scope.scrambledWord.splice(i,1);
                break;//stops after finding the first instance
              }
            }
          }
        }
        if($scope.guess.length === $scope.originalWord.length){
            var originalWord = $scope.originalWord;
            var guessWord = $scope.guess;
            $scope.checkWord(guessWord, originalWord);
        }
      };
      $scope.checkWord = function(s,t){
        var one = s.join("");
        var two = t.join("");
        if(s.length > 1){
          if(one == two){
            count++;
            $scope.count = count;
            init();
            return;
          } else {
            //check input word to see if it's a valid word
            wordFactory.checkDictionary(one).then(function(data){
              var test = JSON.stringify(data);
              var res = Object.keys(test)[0];
              if(res > 1){
                count++;
                $scope.count = count;
                init();
                return;
              } else {
                $scope.scrambledWord = $scope.guess;
                $scope.guess = [];
              }
            });
          }
        } else {
          return;
        }
      };
      init();
}]);
