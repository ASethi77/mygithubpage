angular.module('resonate', ['ngAudio'])
  .controller('optimusPrime', function($scope, $http, $timeout, ngAudio) {
        $scope.currentlyPlaying = null;
        $scope.searchResults = {};
        $scope.displayedEpisodes = [];
        $scope.searchPodcasts = function(searchTerm) {
          $http.get("https://itunes.apple.com/search?term=" + searchTerm + "&entity=podcast")
            .success(function(data) {
              $scope.displayedEpisodes = null;
              $scope.searchResults = data.results;
              function chunk(arr, size) {
                var newArr = [];
                for (var i=0; i<arr.length; i+=size) {
                  newArr.push(arr.slice(i, i+size));
                }
                return newArr;
              }
              $scope.chunkedData = chunk($scope.searchResults, 4);
            })
        }
        $scope.showPodcastEpisodes = function(rssFeedUrl) {
          $scope.displayedEpisodes = [];
          console.log(rssFeedUrl);
          $.get(rssFeedUrl + ".xml?format=xml", function(data) {
            console.log(data);
            var $XML = $(data);
            $XML.find("item").each(function() {
              var $this = $(this),
              item = {
                episodeUrl:  $this.find("enclosure").attr('url'),
                title:       $this.find("title").text(),
                link:        $this.find("link").text(),
                description: $this.find("description").text(),
                pubDate:     $this.find("pubDate").text(),
                author:      $this.find("author").text()
              };
              $scope.displayedEpisodes.push(item);
            })
            $scope.searchResults = null;
            $scope.$digest();
        })
      }
      $scope.playEpisode = function(url) {
        if ($scope.currentlyPlaying) $scope.currentlyPlaying.stop();
        $scope.currentlyPlaying = null;
        $scope.currentlyPlaying = ngAudio.load(url);
        $scope.currentlyPlaying.play();
        document.getElementById('playbackSlider').disabled = false;
      }
  })

  .directive('topOverview', function() {
    return {
      templateUrl: "top-overview/overview.html",
      restrict: 'E',
    }
  })
  .directive('sideBar', function() {
    return {
      templateUrl: "side-bar/sidebar.html",
      restrict: 'E'
    }
  })
  .directive('mainView', function() {
    return {
      templateUrl: "main-view/main.html",
      restrict: 'E'
    }
  })
  .directive('playerControls', function() {
    return {
      templateUrl: "player-controls/controls.html",
      restrict: 'E'
    }
  })
