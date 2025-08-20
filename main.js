// ==UserScript==
// @name         GitHub API Button
// @namespace    https://github.com/Jursin/GitHub-API-Button
// @version      1.1
// @description  在 GitHub 仓库导航栏添加 API 按钮，并显示仓库/用户信息
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

    // 添加API按钮
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
        }
    }

    // 获取API数据并添加信息
    function fetchAndDisplayInfo() {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        let apiUrl = '';
        
        if (pathParts.length === 1) {
            // 用户页面: /username
            apiUrl = `https://api.github.com/users/${pathParts[0]}`;
        } else if (pathParts.length >= 2) {
            // 仓库页面: /owner/repo
            apiUrl = `https://api.github.com/repos/${pathParts[0]}/${pathParts[1]}`;
        }

        if (!apiUrl) return;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (pathParts.length >= 2) {
                    // 仓库页面 - 添加创建和更新时间
                    const borderGridCell = document.querySelector('.BorderGrid-cell');
                    if (borderGridCell) {
                        const createdAt = new Date(data.created_at);
                        const updatedAt = new Date(data.updated_at);
                        
                        const dateOptions = { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Asia/Shanghai'
                        };
                        
                        const createdAtStr = createdAt.toLocaleDateString('zh-CN', dateOptions);
                        const updatedAtStr = updatedAt.toLocaleDateString('zh-CN', dateOptions);
                        
                        const infoDiv = document.createElement('div');
                        infoDiv.className = 'mt-3';
                        infoDiv.innerHTML = `
                            <div class="mb-2">
                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-clock mr-1">
                                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"></path>
                                </svg>
                                <span>创建于: ${createdAtStr}</span>
                            </div>
                            <div>
                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-history mr-1">
                                    <path d="M1.643 3.143.427 1.927A.25.25 0 0 1 0 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 0 1-.177-.427L2.715 4.215a6.501 6.501 0 1 1-1.18 4.458.75.75 0 1 1 1.493.154 5.001 5.001 0 1 0 .986-3.262.75.75 0 0 1-1.004-.334.75.75 0 0 1 .334-1.003ZM8 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75H5a.75.75 0 0 1 0-1.5h2.25V4.25A.75.75 0 0 1 8 3.5Z"></path>
                                </svg>
                                <span>更新于: ${updatedAtStr}</span>
                            </div>
                        `;
                        
                        borderGridCell.appendChild(infoDiv);
                    }
                } else if (pathParts.length === 1) {
                    // 用户页面 - 添加创建时间
                    const vcardDetails = document.querySelector('.vcard-details');
                    if (vcardDetails) {
                        const createdAt = new Date(data.created_at);
                        const dateOptions = { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            timeZone: 'Asia/Shanghai'
                        };
                        
                        const createdAtStr = createdAt.toLocaleDateString('zh-CN', dateOptions);
                        
                        const newLi = document.createElement('li');
                        newLi.className = 'vcard-detail pt-1';
                        newLi.innerHTML = `
                            <svg class="octicon octicon-calendar" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                                <path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V3.75C0 2.784.784 2 1.75 2H3V.75A.75.75 0 0 1 4.75 0ZM3 3.5H1.75a.25.25 0 0 0-.25.25V5h13V3.75a.25.25 0 0 0-.25-.25H13v1.25a.75.75 0 0 1-1.5 0V3.5h-5v1.25a.75.75 0 0 1-1.5 0V3.5Zm-1.25 3a.75.75 0 0 1 .75-.75h.75v.75a.75.75 0 0 1-1.5 0Zm.75 2.25a.75.75 0 0 0 0 1.5h.75v-.75a.75.75 0 0 0-1.5 0ZM4 8.75A.75.75 0 0 1 4.75 8h.75v.75a.75.75 0 0 1-1.5 0Zm1.25 1.5a.75.75 0 0 0 0 1.5h.75v-.75a.75.75 0 0 0-1.5 0ZM8 8.75A.75.75 0 0 1 8.75 8h.75v.75a.75.75 0 0 1-1.5 0ZM9.25 10.25a.75.75 0 0 0 0 1.5h.75v-.75a.75.75 0 0 0-1.5 0ZM12 8.75a.75.75 0 0 1 .75-.75h.75v.75a.75.75 0 0 1-1.5 0ZM12.75 10.25a.75.75 0 0 0 0 1.5h.75v-.75a.75.75 0 0 0-1.5 0ZM4.75 7a.75.75 0 0 0 0 1.5h.75v-.75A.75.75 0 0 0 4.75 7ZM8.75 7a.75.75 0 0 0 0 1.5h.75v-.75a.75.75 0 0 0-1.5 0ZM12.75 7a.75.75 0 0 0 0 1.5h.75v-.75a.75.75 0 0 0-1.5 0Z"></path>
                            </svg>
                            <span class="p-label">加入于: ${createdAtStr}</span>
                        `;
                        
                        vcardDetails.appendChild(newLi);
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching GitHub API:', error);
            });
    }

    // 延迟执行以确保页面完全加载
    setTimeout(fetchAndDisplayInfo, 1000);
})();