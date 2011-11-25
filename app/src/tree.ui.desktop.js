Joshfire.define(['joshfire/class', 'joshfire/tree.ui', 'joshfire/uielements/list', 'joshfire/uielements/panel', 'joshfire/uielements/panel.manager', 'joshfire/uielements/button', 'joshfire/adapters/ios/uielements/video.youtube'], function(Class, UITree, List, Panel, PanelManager, Button, Video) {

  return Class(UITree, {

    buildTree: function() {

      var app = this.app;

      app.currentDatasource = false;

      return [
        {
          id: 'header',
          type: Panel,
          children: [
            {
              id: 'title',
              type: Panel,
              content: '{Logo}'
            }
          ]
        },
        {
          id: 'menu',
          type: List,
          dataPath: '/datasourcelist/',
          itemInnerTemplate: '<%= item.name %>',
          onData: function() {} // trigger data, WTF?
        },
        {
          id: 'content',
          type: PanelManager,
          uiMaster: '/menu',
          children: [
            {
              id: 'itemList',
              type: List,
              orientation: 'left',
              loadingTemplate: '<div class="loading"></div>',
              itemInnerTemplate:
                '<%= item.title %>'
            },
            {
              id: 'detail',
              type: Panel,
              uiDataMaster: '/content/itemList',
              loadingTemplate: '<div class="loadin">Loading details</div>',
              autoShow: false,
              children: [
                {
                  id: 'text',
                  type: Panel,
                  uiDataMaster: '/content/itemList',
                  forceDataPathRefresh: true,
                  loadingTemplate: '<div class="loadin">Loading text</div>',
                  innerTemplate:
                    '<div class="title"><h1><%= data.title %></h1>' +
                    '<p class="author"><%= data.creator || data.user %></p></div>' +
                    '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
                  onData: function(ui) {
                    var thisEl = app.ui.element('/content/detail/text').htmlEl;
                    if (ui.data.source != 'youtube') {
                      $(thisEl).show();
                    } else {
                      $(thisEl).hide();
                    }
                  }
                },
                {
                  id: 'video',
                  type: Panel,
                  uiDataMaster: '/content/itemList',
                  forceDataPathRefresh: true,
                  loadingTemplate: '<div class="loadin">Loading video</div>',
                  onData: function(ui) {
                    var thisEl = app.ui.element('/content/detail/video').htmlEl,
                        player = app.ui.element('/content/detail/video/player.youtube');

                    if (ui.data.source == 'youtube') {
                      player.playWithStaticUrl({
                        url: ui.data.url.replace('http://www.youtube.com/watch?v=', ''),
                        width: '480px',
                      });

                      $(thisEl).show();
                    } else {
                      $(thisEl).hide();
                    }
                  },
                  children: [
                    {
                      id: 'title',
                      type: Panel,
                      uiDataMaster: '/content/itemList',
                      innerTemplate:
                        '<div class="title"><h1><%= data.title %></h1>' +
                        '<p class="author">By <strong><%= data.creator || data.user %></strong></p></div>'
                    },
                    {
                      id: 'player.youtube',
                      type: Video,
                      autoShow: true,
                      controls: true,
                      noAutoPlay: false
                    }
                  ]
                }
              ]
            }
            
          ]
        }
      ];
    }

  });

});