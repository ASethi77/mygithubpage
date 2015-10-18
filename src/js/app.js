angular.module('resonate', ['ngAudio'])
  .controller('masterController', function($scope, $http, ngAudio) {
      $scope.pageState = 'welcome';
        $scope.currentlyPlaying = null;
        $scope.searchResults = {};
        $scope.currentPodcast = null;
        $scope.displayedEpisodes = [];
        $scope.searchPodcasts = function(searchTerm) {
          $scope.currentPodcast = null;
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
              $scope.pageState = 'search-results';
            })
        }
        $scope.showPodcastEpisodes = function(item) {
          $scope.currentPodcast = item;
          $scope.displayedEpisodes = [];
          $.get(item.feedUrl + "?format=xml", function(data) {
            var $XML = $(data);
            $XML.find("item").each(function() {
              var $this = $(this),
              item = {
                episodeUrl:  $this.find("enclosure").attr('url'),
                title:       $this.find("title").text(),
                link:        $this.find("link").text(),
                description: $this.find("description").text(),
                duration:    $this.find("itunes\\:duration, duration").text(),
                pubDate:     $this.find("pubDate").text(),
                author:      $this.find("author").text()
              };
              $scope.displayedEpisodes.push(item);
            })
            $scope.pageState = 'episode-list';
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
      templateUrl: "src/html/top-overview/overview.html",
      restrict: 'E',
    }
  })
  .directive('sideBar', function() {
    return {
      templateUrl: "src/html/side-bar/sidebar.html",
      restrict: 'E'
    }
  })
  .directive('mainView', function() {
    return {
      templateUrl: "src/html/main-view/main.html",
      restrict: 'E'
    }
  })
  .directive('playerControls', function() {
    return {
      templateUrl: "src/html/player-controls/controls.html",
      restrict: 'E'
    }
  })
