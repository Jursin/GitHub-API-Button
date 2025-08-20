// ==UserScript==
// @name         GitHub API Button
// @namespace    https://github.com/Jursin/GitHub-API-Button
// @version      1.0
// @description  在 GitHub 仓库导航栏添加 API 按钮
// @author       Jursin
// @match        https://github.com/*
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @grant        none
// @downloadURL  https://github.com/Jursin/GitHub-API-Button/raw/refs/heads/main/main.js
// @updateURL    https://github.com/Jursin/GitHub-API-Button/raw/refs/heads/main/main.js
// @supportURL   https://github.com/Jursin/GitHub-API-Button/issues
// ==/UserScript==

(function() {
    'use strict';

    const navBar = document.querySelector('.UnderlineNav-body.list-style-none');

    if (navBar) {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      let apiUrl = '';
      
      if (pathParts.length === 1) {
        // 用户页面: /username
        apiUrl = `https://api.github.com/users/${pathParts[0]}`;
      } else if (pathParts.length >= 2) {
        // 仓库页面: /owner/repo
        apiUrl = `https://api.github.com/repos/${pathParts[0]}/${pathParts[1]}`;
      }

      if (apiUrl) {
        const svgIcon = `
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-microchip UnderlineNav-octicon d-none d-sm-inline">
          <path d="M5.5,.75c0-.42-.33-.75-.75-.75s-.75,.33-.75,.75v1.25c-1.1,0-2,.9-2,2H.75c-.42,0-.75,.33-.75,.75s.33,.75,.75,.75h1.25v1.75H.75c-.42,0-.75,.33-.75,.75s.33,.75,.75,.75h1.25v1.75H.75c-.42,0-.75,.33-.75,.75s.33,.75,.75,.75h1.25c0,1.1,.9,2,2,2v1.25c0,.42,.33,.75,.75,.75s.75-.33,.75-.75v-1.25h1.75v1.25c0,.42,.33,.75,.75,.75s.75-.33,.75-.75v-1.25h1.75v1.25c0,.42,.33,.75,.75,.75s.75-.33,.75-.75v-1.25c1.1,0,2-.9,2-2h1.25c.42,0,.75-.33,.75-.75s-.33-.75-.75-.75h-1.25v-1.75h1.25c.42,0,.75-.33,.75-.75s-.33-.75-.75-.75h-1.25v-1.75h1.25c.42,0,.75-.33,.75-.75s-.33-.75-.75-.75h-1.25c0-1.1-.9-2-2-2V.75c0-.42-.33-.75-.75-.75s-.75,.33-.75,.75v1.25h-1.75V.75c0-.42-.33-.75-.75-.75s-.75,.33-.75,.75v1.25h-1.75V.75Zm-.5,3.25h6c.55,0,1,.45,1,1v6c0,.55-.45,1-1,1H5c-.55,0-1-.45-1-1V5c0-.55,.45-1,1-1Zm.5,1.5v5h5V5.5H5.5Z"/>
          </svg>
        `;

        const newLi = document.createElement('li');
        newLi.setAttribute('data-view-component', 'true');
        newLi.className = 'd-inline-flex';

        const newAnchor = document.createElement('a');
        newAnchor.setAttribute('id', 'api-tab');
        newAnchor.setAttribute('href', apiUrl);
        newAnchor.setAttribute('target', '_blank');
        newAnchor.className = 'UnderlineNav-item no-wrap js-responsive-underlinenav-item';

        newAnchor.innerHTML = svgIcon + '<span data-content="API">API</span>';

        newLi.appendChild(newAnchor);

        navBar.appendChild(newLi);

        console.log('API button added successfully.');
      } else {
        console.log('API URL could not be determined.');
      }
    } else {
      console.log('Navigation bar not found.');
    }

})();