/*! angular-spotify v1.5.1 2017-06-05 */

!function(a,b,c){"use strict";b.module("spotify",[]).provider("Spotify",function(){var c={};c.clientId=null,c.redirectUri=null,c.scope=null,c.authToken=null,this.setClientId=function(a){return c.clientId=a,c.clientId},this.getClientId=function(){return c.clientId},this.setAuthToken=function(a){return c.authToken=a,c.authToken},this.setRedirectUri=function(a){return c.redirectUri=a,c.redirectUri},this.getRedirectUri=function(){return c.redirectUri},this.setScope=function(a){return c.scope=a,c.scope};var d={};d.toQueryString=function(a){var c=[];return b.forEach(a,function(a,b){this.push(encodeURIComponent(b)+"="+encodeURIComponent(a))},c),c.join("&")},c.apiBase="https://api.spotify.com/v1",this.$get=["$q","$http","$window",function(e,f,g){function h(){this.clientId=c.clientId,this.redirectUri=c.redirectUri,this.apiBase=c.apiBase,this.scope=c.scope,this.authToken=c.authToken,this.toQueryString=d.toQueryString}function i(b,c,d,e){var f=a.open(b,c,d),g=a.setInterval(function(){try{f&&!f.closed||(a.clearInterval(g),e(f))}catch(a){}},1e3);return f}return h.prototype={api:function(a,b,c,d,g){var h=e.defer();return f({url:this.apiBase+a,method:b||"GET",params:c,data:d,headers:g,withCredentials:!1}).then(function(a){h.resolve(a)}).catch(function(a){h.reject(a)}),h.promise},_auth:function(a){var b={Authorization:"Bearer "+this.authToken};return a&&(b["Content-Type"]="application/json"),b},getAlbum:function(a){return a=-1===a.indexOf("spotify:")?a:a.split(":")[2],this.api("/albums/"+a,"GET",null,null,this._auth())},getAlbums:function(a){return a=b.isString(a)?a.split(","):a,b.forEach(a,function(b,c){a[c]=b.indexOf("spotify:")>-1?b.split(":")[2]:b}),this.api("/albums","GET",{ids:a?a.toString():""},null,this._auth())},getAlbumTracks:function(a,b){return a=-1===a.indexOf("spotify:")?a:a.split(":")[2],this.api("/albums/"+a+"/tracks","GET",b,null,this._auth())},getArtist:function(a){return a=-1===a.indexOf("spotify:")?a:a.split(":")[2],this.api("/artists/"+a,"GET",null,null,this._auth())},getArtists:function(a){return a=b.isString(a)?a.split(","):a,b.forEach(a,function(b,c){a[c]=b.indexOf("spotify:")>-1?b.split(":")[2]:b}),this.api("/artists/","GET",{ids:a?a.toString():""},null,this._auth())},getArtistAlbums:function(a,b){return a=-1===a.indexOf("spotify:")?a:a.split(":")[2],this.api("/artists/"+a+"/albums","GET",b,null,this._auth())},getArtistTopTracks:function(a,b){return a=-1===a.indexOf("spotify:")?a:a.split(":")[2],this.api("/artists/"+a+"/top-tracks","GET",{country:b},null,this._auth())},getRelatedArtists:function(a){return a=-1===a.indexOf("spotify:")?a:a.split(":")[2],this.api("/artists/"+a+"/related-artists","GET",null,null,this._auth())},getFeaturedPlaylists:function(a){return this.api("/browse/featured-playlists","GET",a,null,this._auth())},getNewReleases:function(a){return this.api("/browse/new-releases","GET",a,null,this._auth())},getCategories:function(a){return this.api("/browse/categories","GET",a,null,this._auth())},getCategory:function(a,b){return this.api("/browse/categories/"+a,"GET",b,null,this._auth())},getCategoryPlaylists:function(a,b){return this.api("/browse/categories/"+a+"/playlists","GET",b,null,this._auth())},getRecommendations:function(a){return this.api("/recommendations","GET",a,null,this._auth())},getAvailableGenreSeeds:function(){return this.api("/recommendations/available-genre-seeds","GET",null,null,this._auth())},following:function(a,b){return b=b||{},b.type=a,this.api("/me/following","GET",b,null,this._auth())},follow:function(a,b){return this.api("/me/following","PUT",{type:a,ids:b},null,this._auth())},unfollow:function(a,b){return this.api("/me/following","DELETE",{type:a,ids:b},null,this._auth())},userFollowingContains:function(a,b){return this.api("/me/following/contains","GET",{type:a,ids:b},null,this._auth())},followPlaylist:function(a,b,c){return this.api("/users/"+a+"/playlists/"+b+"/followers","PUT",null,{public:c||null},this._auth(!0))},unfollowPlaylist:function(a,b){return this.api("/users/"+a+"/playlists/"+b+"/followers","DELETE",null,null,this._auth())},playlistFollowingContains:function(a,b,c){return this.api("/users/"+a+"/playlists/"+b+"/followers/contains","GET",{ids:c.toString()},null,this._auth())},getSavedUserTracks:function(a){return this.api("/me/tracks","GET",a,null,this._auth())},userTracksContains:function(a){return a=b.isString(a)?a.split(","):a,b.forEach(a,function(b,c){a[c]=b.indexOf("spotify:")>-1?b.split(":")[2]:b}),this.api("/me/tracks/contains","GET",{ids:a.toString()},null,this._auth())},saveUserTracks:function(a){return a=b.isString(a)?a.split(","):a,b.forEach(a,function(b,c){a[c]=b.indexOf("spotify:")>-1?b.split(":")[2]:b}),this.api("/me/tracks","PUT",{ids:a.toString()},null,this._auth())},removeUserTracks:function(a){return a=b.isString(a)?a.split(","):a,b.forEach(a,function(b,c){a[c]=b.indexOf("spotify:")>-1?b.split(":")[2]:b}),this.api("/me/tracks","DELETE",{ids:a.toString()},null,this._auth(!0))},saveUserAlbums:function(a){return a=b.isString(a)?a.split(","):a,b.forEach(a,function(b,c){a[c]=b.indexOf("spotify:")>-1?b.split(":")[2]:b}),this.api("/me/albums","PUT",{ids:a.toString()},null,this._auth())},getSavedUserAlbums:function(a){return this.api("/me/albums","GET",a,null,this._auth())},removeUserAlbums:function(a){return a=b.isString(a)?a.split(","):a,b.forEach(a,function(b,c){a[c]=b.indexOf("spotify:")>-1?b.split(":")[2]:b}),this.api("/me/albums","DELETE",{ids:a.toString()},null,this._auth(!0))},userAlbumsContains:function(a){return a=b.isString(a)?a.split(","):a,b.forEach(a,function(b,c){a[c]=b.indexOf("spotify:")>-1?b.split(":")[2]:b}),this.api("/me/albums/contains","GET",{ids:a.toString()},null,this._auth())},getUserTopArtists:function(a){return a=a||{},this.api("/me/top/artists","GET",a,null,this._auth())},getUserTopTracks:function(a){return a=a||{},this.api("/me/top/tracks","GET",a,null,this._auth())},getUserPlaylists:function(a,b){return this.api("/users/"+a+"/playlists","GET",b,null,this._auth())},getPlaylist:function(a,b,c){return this.api("/users/"+a+"/playlists/"+b,"GET",c,null,this._auth())},getPlaylistTracks:function(a,b,c){return this.api("/users/"+a+"/playlists/"+b+"/tracks","GET",c,null,this._auth())},createPlaylist:function(a,b){return this.api("/users/"+a+"/playlists","POST",null,b,this._auth(!0))},addPlaylistTracks:function(a,c,d,e){return d=b.isArray(d)?d:d.split(","),b.forEach(d,function(a,b){d[b]=-1===a.indexOf("spotify:")?"spotify:track:"+a:a}),this.api("/users/"+a+"/playlists/"+c+"/tracks","POST",{uris:d.toString(),position:e?e.position:null},null,this._auth(!0))},removePlaylistTracks:function(a,c,d){d=b.isArray(d)?d:d.split(",");var e;return b.forEach(d,function(a,b){e=d[b],d[b]={uri:-1===e.indexOf("spotify:")?"spotify:track:"+e:e}}),this.api("/users/"+a+"/playlists/"+c+"/tracks","DELETE",null,{tracks:d},this._auth(!0))},reorderPlaylistTracks:function(a,b,c){return this.api("/users/"+a+"/playlists/"+b+"/tracks","PUT",null,c,this._auth(!0))},replacePlaylistTracks:function(a,c,d){d=b.isArray(d)?d:d.split(",");var e;return b.forEach(d,function(a,b){e=d[b],d[b]=-1===e.indexOf("spotify:")?"spotify:track:"+e:e}),this.api("/users/"+a+"/playlists/"+c+"/tracks","PUT",{uris:d.toString()},null,this._auth(!0))},updatePlaylistDetails:function(a,b,c){return this.api("/users/"+a+"/playlists/"+b,"PUT",null,c,this._auth(!0))},getUser:function(a){return this.api("/users/"+a,"GET",null,null,this._auth())},getCurrentUser:function(){return this.api("/me","GET",null,null,this._auth())},search:function(a,b,c){return c=c||{},c.q=a,c.type=b,this.api("/search","GET",c,null,this._auth())},getTrack:function(a){return a=-1===a.indexOf("spotify:")?a:a.split(":")[2],this.api("/tracks/"+a,"GET",null,null,this._auth())},getTracks:function(a){return a=b.isString(a)?a.split(","):a,b.forEach(a,function(b,c){a[c]=b.indexOf("spotify:")>-1?b.split(":")[2]:b}),this.api("/tracks/","GET",{ids:a?a.toString():""},null,this._auth())},getTrackAudioFeatures:function(a){return a=-1===a.indexOf("spotify:")?a:a.split(":")[2],this.api("/audio-features/"+a,"GET",null,null,this._auth())},getTracksAudioFeatures:function(a){return a=b.isString(a)?a.split(","):a,b.forEach(a,function(b,c){a[c]=b.indexOf("spotify:")>-1?b.split(":")[2]:b}),this.api("/audio-features/","GET",{ids:a?a.toString():""},null,this._auth())},setAuthToken:function(a){return this.authToken=a,this.authToken},login:function(){function a(d){"spotify-token"===d.key&&(k&&k.close(),j=!0,c.setAuthToken(d.newValue),g.removeEventListener("storage",a,!1),b.resolve(d.newValue))}var b=e.defer(),c=this,d=screen.width/2-200,f=screen.height/2-250,h={client_id:this.clientId,redirect_uri:this.redirectUri,scope:this.scope||"",response_type:"token"},j=!1,k=i("https://accounts.spotify.com/authorize?"+this.toQueryString(h),"Spotify","menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=400,height=500,top="+f+",left="+d,function(){j||b.reject()});return g.addEventListener("storage",a,!1),b.promise}},new h}]})}(window,angular);