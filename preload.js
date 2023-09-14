'use strict';

const {
  utools
} = window;

const axios = require('axios');

const saveToDatabase = (content) => {
  const api = utools.db.get('api');
  console.log(api)
  if (!api) {
    utools.showNotification('请先设置个人 API!');
    return
  }
  const data = JSON.stringify({
    "content": content
  });

  const config = {
    method: 'post',
    url: api.api,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      // utools.showNotification('发送成功-wucai');
    })
    .catch(function (error) {
      console.log(error);
      utools.showNotification('发送失败-wucai');
    });

}

window.exports = {
  'set_api': {
    mode: 'list',
    args: {
      enter: () => {
        utools.subInputFocus();
      },
      search: (action, searchWord, callbackSetList) => {
        callbackSetList([{
          title: '确定',
          description: '设置 wucai API',
          icon: 'icons/logo.png',
          api: searchWord,
        }]);
      },
      select: (action, itemData, callbackSetList) => {
        const api = utools.db.get('api');
        const data = {
          _id: 'api',
          api: itemData.api,
        };
        //rev 属性，这是代表此文档的版本，每次对文档进行更新时，都要带上最新的版本号，否则更新将失败，版本化的意义在于解决同步时数据冲突
        if (api) {
          data._rev = api._rev;
        }
        utools.db.put(data);
        utools.hideMainWindow();
        utools.showNotification('设置 个人API 成功！');
        utools.outPlugin();
      },
      placeholder: "输入"
    }
  },
  'send_to_database': {
    mode: 'none',
    args: {
      enter: (action, callbackSetList) => {
        utools.hideMainWindow();
        const {
          payload
        } = action;
        saveToDatabase(payload)
        utools.outPlugin();
      },
    }
  },
  'add_to_database': {
    mode: 'list',
    args: {
      // 进入插件时调用（可选）
      enter: () => {
        utools.subInputFocus();
      },
      // 子输入框内容变化时被调用 可选 (未设置则无搜索)
      search: (action, searchWord, callbackSetList) => {
        callbackSetList([{
          title: '添加笔记到wucai',
          description: '随便记点什么吧',
          icon: 'icons/logo.png',
          content: searchWord
        }]);
      },
      // 用户选择列表中某个条目时被调用
      select: (action, itemData, callbackSetList) => {
        utools.hideMainWindow();
        saveToDatabase(itemData.content)
        utools.outPlugin();
      },
      placeholder: "输入"
    }
  },
}