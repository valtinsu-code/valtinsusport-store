gsap.registerPlugin(ScrollTrigger);
//获取 id main-article-settings
var mainArticleSettings = document.querySelector('#main-article-settings');
//获取 #main-article-settings 下的 所有 h2 
var h2Elements = document.querySelectorAll('.article-section h2');
var chooseTitleArr = [];
var updates_history_sourcesArr = [];
var best_product_insert = '';
var product_parameters_insert = '';
var who_plans_bdsm_scenes = '';
var blog_single_product = '';
var image_switch_insert_text = '';
var jb_tst_wrapper_insert_text = ''
if (mainArticleSettings) {
    var mainArticleSettingsData = JSON.parse(mainArticleSettings.innerHTML);
    console.log(8888888)
    console.log(mainArticleSettingsData);
    //执行 blog best product 插入
    if(mainArticleSettingsData.best_product_insert && mainArticleSettingsData.best_product_insert != ''){
     
      best_product_insert = mainArticleSettingsData.best_product_insert;
    }
    //执行 product parameters 插入
    if(mainArticleSettingsData.product_parameters_insert && mainArticleSettingsData.product_parameters_insert != ''){
      
      product_parameters_insert = mainArticleSettingsData.product_parameters_insert;
    }
    //执行 who plans bdsm scenes 插入
    if(mainArticleSettingsData.who_plans_bdsm_scenes && mainArticleSettingsData.who_plans_bdsm_scenes != ''){
      who_plans_bdsm_scenes = mainArticleSettingsData.who_plans_bdsm_scenes;
    }
    //执行 blog single product 插入
    if(mainArticleSettingsData.blog_single_product && mainArticleSettingsData.blog_single_product != ''){
      blog_single_product = mainArticleSettingsData.blog_single_product;
    }
    //执行 image switch 插入
    if(mainArticleSettingsData.image_switch_insert_text && mainArticleSettingsData.image_switch_insert_text != ''){
      image_switch_insert_text = mainArticleSettingsData.image_switch_insert_text;
    }
    //执行 jb_tst_wrapper_insert_text
    if(mainArticleSettingsData.jb_tst_wrapper_insert_text && mainArticleSettingsData.jb_tst_wrapper_insert_text != ''){
      jb_tst_wrapper_insert_text = mainArticleSettingsData.jb_tst_wrapper_insert_text;
    }

    if(mainArticleSettingsData.chooseTitle && mainArticleSettingsData.chooseTitle != ''){
      chooseTitleArr = splitData(mainArticleSettingsData.chooseTitle)
    }
    if(mainArticleSettingsData.updates_history_sources && mainArticleSettingsData.updates_history_sources != ''){
      updates_history_sourcesArr = splitData(mainArticleSettingsData.updates_history_sources)
    }
    // if(mainArticleSettingsData.tableSettings && mainArticleSettingsData.tableSettings != '')
    tableStyleHandler(splitData(mainArticleSettingsData.tableSettings));
}
//处理数据分割
function splitData(data){
  return data.split(',');
}

//处理 表格样式 添加 自定义class
function tableStyleHandler(tableSettings) {
  const tables = [...document.querySelectorAll('table')].filter(
    table => table.rows.length > 3
  );

  tables.forEach(function (table, index) {
    if (tableSettings[index]) {
      table.classList.add(tableSettings[index]);
    } else {
      table.classList.add('table_layout_one');
    }
    if (table.querySelector('thead')) {
      table.classList.add('table-has-thead');
    }else{
      table.classList.add('table-no-thead');
    }
  });
}

function faqStyleHandler() {
  const iconHtml = `
    <div class="faq-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 9 9" fill="none">
        <path d="M0 4.5C0 4.22386 0.223858 4 0.5 4H8.5C8.77614 4 9 4.22386 9 4.5C9 4.77614 8.77614 5 8.5 5H0.5C0.223858 5 0 4.77614 0 4.5Z" fill="#1D1D1D"/>
        <path d="M4.5 0C4.77614 0 5 0.223858 5 0.5V8.5C5 8.77614 4.77614 9 4.5 9C4.22386 9 4 8.77614 4 8.5V0.5C4 0.223858 4.22386 0 4.5 0Z" fill="#1D1D1D"/>
      </svg>
    </div>
  `;

  const faqSchemaData = [];  // Array to hold the FAQ Schema data

  const h2Elements = Array.from(document.querySelectorAll('h2'));

  h2Elements.forEach((h2) => {
    const title = h2.textContent.trim().toLowerCase();
    if (!title.includes('faq') && !title.includes('frequently asked questions')) return;

    if (h2.dataset.faqProcessed === '1') return;

    const h2Block = h2.closest('.ace-line') || h2;

    if (h2Block.closest('.faq-wrap')) return;

    const parent = h2Block.parentNode;

    const faqWrap = document.createElement('div');
    faqWrap.className = 'faq-wrap';

    parent.insertBefore(faqWrap, h2Block);
    faqWrap.appendChild(h2Block);

    let current = faqWrap.nextElementSibling;
    let currentContent = null;
    let hasH3 = false;
    let firstGroup = true;

    while (current) {
      const next = current.nextElementSibling;

      const nextH2 = current.matches('h2') || current.querySelector('h2');
      if (nextH2) break;

      const h3 = current.matches('h3') ? current : current.querySelector('h3');

      if (h3) {
        hasH3 = true;

        current.classList.add('faq-title');

        if (!current.querySelector('.faq-icon')) {
          const originalHtml = h3.innerHTML;
          h3.innerHTML = `<span class="faq-title-text">${originalHtml}</span>${iconHtml}`;
        }

        faqWrap.appendChild(current);

        currentContent = document.createElement('div');
        currentContent.className = 'faq-content';

        if (firstGroup) {
          current.classList.add('active');
          currentContent.classList.add('active');
          firstGroup = false;
        }

        faqWrap.appendChild(currentContent);


      } else if (currentContent) {
        currentContent.appendChild(current);
      } else {
        faqWrap.appendChild(current);
      }

      current = next;
    }

    if (hasH3) {
      const titles = faqWrap.querySelectorAll('.faq-title');
      titles.forEach(titleEl => {
        const contentEl = titleEl.nextElementSibling;
        if (contentEl && contentEl.classList.contains('faq-content')) {
          const questionText = titleEl.querySelector('.faq-title-text')?.textContent.trim() || titleEl.textContent.trim();

          faqSchemaData.push({
            "@type": "Question",
            "name": questionText,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": contentEl.innerText.trim()
            }
          });
        }
      });
    }
    if (!hasH3) {
      while (faqWrap.firstChild) {
        parent.insertBefore(faqWrap.firstChild, faqWrap);
      }
      faqWrap.remove();
      return;
    }

    h2.dataset.faqProcessed = '1';
  });

  if (faqSchemaData.length > 0) {
    const schemaMarkup = document.createElement('script');
    schemaMarkup.type = 'application/ld+json';
    schemaMarkup.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqSchemaData
    });

    document.head.appendChild(schemaMarkup); // Add schema to the head of the document
  }

  faqHandleClick();
}

// 事件委托，避免重复绑定
function faqHandleClick() {
  if (document.body.dataset.faqClickBound === '1') return;

  document.body.addEventListener('click', function (e) {
    const title = e.target.closest('.faq-wrap .faq-title');
    if (!title) return;

    const faqWrap = title.closest('.faq-wrap');
    const content = title.nextElementSibling;

    if (!content || !content.classList.contains('faq-content')) return;

    faqWrap.querySelectorAll('.faq-title.active').forEach((el) => {
      el.classList.remove('active');
    });

    faqWrap.querySelectorAll('.faq-content.active').forEach((el) => {
      el.classList.remove('active');
    });

    title.classList.add('active');
    content.classList.add('active');
  });

  document.body.dataset.faqClickBound = '1';
}

// 调用
faqStyleHandler();

//处理 选择 h2  标题出来的颜色
function chooseTitlte(cls,someArr,insert_h3_element) {
    for (var i = h2Elements.length - 1; i >= 0; i--) {
      var currentH2 = h2Elements[i];
      var titleText = currentH2.textContent.trim().toLowerCase();

      var matched = someArr.some(function(keyword) {
        return titleText.includes(keyword.toLowerCase());
      });

      if (!matched) continue;

      var wrapper = document.createElement('div');
      wrapper.className = cls;

      currentH2.parentNode.insertBefore(wrapper, currentH2);

      var node = currentH2;
      while (node) {
        var next = node.nextSibling;
        wrapper.appendChild(node);

        if (
          next &&
          next.nodeType === 1 &&
          next.tagName.toLowerCase() === 'h2'
        ) {
          break;
        }

        node = next;
      }
    }
}
chooseTitlte('choose_size_box',chooseTitleArr);

function chooseTitlte2(cls, someArr, insert_h3_element) {
//  console.log('chooseTitlte2')
  // var hasTitle = ['weight', 'size', 'faq'];
  var container = document.querySelector('.article-section-mid');

  if (!container) return;

  var h2List = Array.from(container.querySelectorAll('h2'));
  function textMatch(text) {
   
    console.log(text);
    var value = (text || '').trim().toLowerCase();
    return someArr.some(function (item) {
      return value.includes(item.toLowerCase());
    });
  }

  function getNextSiblingH2(el) {
    var node = el.nextElementSibling;
    while (node) {
      if (node.tagName && node.tagName.toLowerCase() === 'h2') {
        return node;
      }
      node = node.nextElementSibling;
    }
    return null;
  }

  function collectNodesToWrap(h2) {
    var nodes = [];
    var current = h2;
    var nextH2 = getNextSiblingH2(h2);

    // 有下一个 h2：包到下一个 h2 之前
    if (nextH2) {
      while (current && current !== nextH2) {
        nodes.push(current);
        current = current.nextElementSibling;
      }
      return nodes;
    }

    // 当前 h2 是最后一个：包到 .social-media-blog-seciton 为止（包含该元素）
    while (current) {
      nodes.push(current);

      if (
        current.classList &&
        current.classList.contains('social-media-blog-seciton')
      ) {
        break;
      }

      current = current.nextElementSibling;
    }

    return nodes;
  }

  function wrapNodes(nodes, className) {
    if (!nodes || !nodes.length) return null;

    var wrapper = document.createElement('div');
    wrapper.className = className;

    var parent = nodes[0].parentNode;
    parent.insertBefore(wrapper, nodes[0]);

    nodes.forEach(function (node) {
      wrapper.appendChild(node);
    });

    return wrapper;
  }

  function addOpenSpanToH3(wrapper) {
    var h3List = Array.from(wrapper.querySelectorAll(':scope > h3'));

    h3List.forEach(function (h3) {
      if (h3.querySelector(':scope > .updates-h3-open-span')) return;

      var span = document.createElement('span');
      span.className = 'updates-h3-open-span';
      span.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="7" viewBox="0 0 11 7" fill="none">
  <path d="M6.06452 6.62713C5.66575 7.08759 4.95144 7.08759 4.55266 6.62713L0.246375 1.65465C-0.314501 1.00701 0.145551 -1.53364e-07 1.0023 -7.84644e-08L9.61488 6.74471e-07C10.4716 7.49371e-07 10.9317 1.00701 10.3708 1.65465L6.06452 6.62713Z" fill="#fff"/>
</svg>`;
      h3.appendChild(span);
    });
  }

  function wrapContentBetweenH3(wrapper) {
    var h3List = Array.from(wrapper.querySelectorAll(':scope > h3'));

    h3List.forEach(function (h3) {
      var contentNodes = [];
      var current = h3.nextElementSibling;

      while (current && current.tagName.toLowerCase() !== 'h3') {
        var next = current.nextElementSibling;
        //第一个 h3 添加 active 类
          if (!contentNodes.length) {
            h3.classList.add('active');
          }
        // 避免重复包裹
        if (
          !(current.classList && current.classList.contains('updates_history_sources_content'))
        ) {
          contentNodes.push(current);
        }

        current = next;
      }

      if (!contentNodes.length) return;

      var contentWrap = document.createElement('div');
      contentWrap.className = 'updates_history_sources_content';

      h3.parentNode.insertBefore(contentWrap, contentNodes[0]);

      contentNodes.forEach(function (node) {
        contentWrap.appendChild(node);
      });
    });
  }

  h2List.forEach(function (h2) {
    
    if (!textMatch(h2.textContent)) return;
    if (!h2.parentNode || h2.parentNode.classList.contains(cls)) return;
    // 如果当前的h2 的父元素 包含 class ace-line,就给当前的父元素添加 class updates_history_sources_content
    //如果是最后一个 h2
    
   
    var nodesToWrap = collectNodesToWrap(h2);
    if (!nodesToWrap.length) return;

    var sectionWrap = wrapNodes(nodesToWrap, cls);
    if (!sectionWrap) return;

    addOpenSpanToH3(sectionWrap);
    wrapContentBetweenH3(sectionWrap);
  });


 //延迟 1秒执行
  setTimeout(updatesHistorySourcesHandleClick,1000);

}
//页面加载完毕执行 chooseTitlte2('updates_history_sources_box',updates_history_sourcesArr);

  chooseTitlte2('updates_history_sources_box',updates_history_sourcesArr);

  //updates_history_sources_box h3点击事件
function updatesHistorySourcesHandleClick() {
  const h3Titles = document.querySelectorAll('.updates_history_sources_box h3');
  console.log('h3Titles', h3Titles)
  h3Titles.forEach(function (h3) {
    h3.addEventListener('click', function () {
     // 切换 h3 的 active 类
      this.classList.toggle('active');
    });
  });
}


  // 把 HTML 字符串转成可复用节点模板
// function createNodeFromHTML(html) {
//   var temp = document.createElement('div');
//   temp.innerHTML = html.trim();
//   return temp.firstElementChild;
// }

// function chooseTitlte(cls, someArr, insert_h3_element) {

//   for (var i = h2Elements.length - 1; i >= 0; i--) {
//     var currentH2 = h2Elements[i];
//     var titleText = currentH2.textContent.trim().toLowerCase();

//     var matched = someArr.some(function(keyword) {
//       return titleText.includes(keyword.toLowerCase());
//     });

//     if (!matched) continue;

//     var wrapper = document.createElement('div');
//     wrapper.className = cls;

//     currentH2.parentNode.insertBefore(wrapper, currentH2);

//     var node = currentH2;
//     while (node) {
//       var next = node.nextSibling;
//       wrapper.appendChild(node);

//       if (
//         next &&
//         next.nodeType === 1 &&
//         next.tagName.toLowerCase() === 'h2'
//       ) {
//         break;
//       }

//       node = next;
//     }

//     // 检测 wrapper 内是否有 h3，有的话插入 insert_h3_element
//     if (insert_h3_element) {
//       var h3List = wrapper.querySelectorAll('h3');

//       h3List.forEach(function(h3) {
//         var insertNode;

//         if (typeof insert_h3_element === 'string') {
//           insertNode = createNodeFromHTML(insert_h3_element);
//         } else if (insert_h3_element instanceof HTMLElement) {
//           insertNode = insert_h3_element.cloneNode(true);
//         }

//         if (insertNode) {
//           h3.appendChild(insertNode); 
//           // 如果你想插到 h3 最前面，改成：
//           // h3.insertBefore(insertNode, h3.firstChild);
//         }
//       });
//     }
//   }
// }

/*
  1, 父元素的class
  2, 检测标题的数组
*/

// chooseTitlte('choose_size_box',chooseTitleArr);
//
 
// 
//进度条
function blog_progress(){
      const blog_progress_bar = document.querySelector('.blog-progress-box');
      if(blog_progress_bar){
        ScrollTrigger.create({
          trigger: 'html',
          start: `top top`,
          end: `bottom bottom`,
          onUpdate: (self) => {
            const percent = Math.round(self.progress * 100);
            blog_progress_bar.style.top = '0px';
            // blog_progress_bar.style.top = 'var(--bannerbox-header-fixed-value)';
            gsap.set(blog_progress_bar, {
              width: self.progress * 100 + '%',
              ease: 'power1.out'
            });
          }
        });

    }
}

blog_progress();


  var article_left_index_current = 0;
        var article_left_onece = false;
//处理 h2 标签 到左边显示 
 function activateGroup(activeIndex) {
      const leftH2s = document.querySelectorAll(".toc-list .one-level-heading");
        article_left_index_current = activeIndex
        if(!article_left_onece){
          leftH2s.forEach((el, i) => {
                    el.classList.toggle("is-active", i === activeIndex);
                });
        }
    }
function navH2(){
          const headings = document.querySelectorAll('.article-section h2,.article-section h3');
    const tocContainer = document.getElementById('toc');
    const plus = `   
            <span class="plus">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                    <rect y="6.09961" width="12" height="0.8" fill="#333333"/>
                    <rect x="6.39844" y="0.5" width="12" height="0.8" transform="rotate(90 6.39844 0.5)" fill="#333333"/>
                </svg>
            </span>
        `;
    const minus = `   
            <span class="minus">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="2" viewBox="0 0 12 2" fill="none">
                    <rect y="0.599609" width="12" height="0.8" fill="#333333"/>
                </svg>
            </span>
            
        `;
    const button = `
            <div class="tab-button">
                ${plus}${minus}
            </div>
        `;
    if (!headings.length || !tocContainer) return;

    let tocHTML = '<ul class="toc-list">';
    let lastH2Item = '';
    let inH3Section = false;
    let h2_index_two = 0;
    let h3_index_two = -1;
    headings.forEach((heading, index) => {

      if (!heading.id) {
        heading.id = 'section-' + index;
      }
      if (heading.classList.contains('tab-title')) {
        return;
      }
      if (heading.tagName === 'H2') {
        h2_index_two += 1;
 
        if (inH3Section) {
          tocHTML += '</ul></li>';
          inH3Section = false;
        }

        tocHTML += `<li class="toc-h2 font-text-14 one-level-heading">
                    <div class="button-group"><a  data-target="${heading.id}">${heading.textContent}</a>
                    </div>`;

            lastH2Item = heading.id;

         if(h2_index_two == 2){
             const pictureProducts = document.querySelector('.picture-products');
            heading.insertAdjacentHTML('afterend', `<div class="picture-products picture-products-swiper">${pictureProducts.innerHTML}</div>`);
            pictureProducts.remove();
         }
          if(h2_index_two == 3){
            //将 article-section-rt article-content-white-left
            if(window.innerWidth < 768){
              const articleContentWhiteLeft = document.querySelector('.article-section-rt .article-content-white-left');
              if (articleContentWhiteLeft) {
                  heading.parentNode.insertBefore(articleContentWhiteLeft, heading.nextSibling);
              }
            }
          }
          


          } else if (heading.tagName === 'H3') {
            h3_index_two+=1;
            heading.classList.add('size-custom-h3-'+(h3_index_two));
          }
        });

    

        tocHTML += '</ul>';
        tocContainer.innerHTML = tocHTML;
       

         const leftH2s = document.querySelectorAll(".toc-list .one-level-heading");
            //   const leftGroups = document.querySelectorAll(".toc-list");
            window.addEventListener("load", function () {
              document.querySelectorAll(".article-section-mid h2").forEach((el, index) => {
                ScrollTrigger.create({
                  trigger: el,
                  start: "top center", 
                  end: "bottom bottom",
                  toggleActions: "play reverse play reverse",
                  onEnter: () => activateGroup(index,leftH2s),
                  onEnterBack: () => activateGroup(index,leftH2s),
                });
              });

               ScrollTrigger.refresh();
          

              leftH2s.forEach((p, index) => {
              p.addEventListener('click', () => {
                  article_left_index_current = index;
                    article_left_onece = true;
                      document.querySelectorAll(".toc-list .one-level-heading").forEach(function (el) {
                        el.classList.remove('is-active');
                      });
                  var activeHeading = document.querySelectorAll(".toc-list .one-level-heading")[index];
                  if (activeHeading) {
                    activeHeading.classList.add('is-active');
                  }
                var tocHeight = document.querySelector('.is_toc_height');
                if (tocHeight && tocHeight.classList.contains('active')) {
                    var tocUl = document.querySelector('#toc ul');
                    if (tocUl) {
                      tocUl.style.transform = `translateY(-0px)`;
                    }
                   //   document.getElementById('toc').scrollTop = article_left_index_current * 25;
                  
                }
                const targetH2 = document.querySelectorAll('.article-section .article-section-mid h2')[index];
          
                if (targetH2) {
                  // console.log(targetH2.getBoundingClientRect().top)
                //  targetH2.scrollIntoView({ behavior: 'smooth', block: 'center' });
                console.log('点击h2 ');
                console.log(targetH2.getBoundingClientRect().top - 300);
          
                   window.scrollBy({
                      top: targetH2.getBoundingClientRect().top - 300,
                      behavior: 'smooth'
                    })
                }
                setTimeout(()=>{
                  // window.scrollBy(0, -200);
                  article_left_onece = false;
                },1000)
              });
            });
        });
}
navH2();

//初始化 picture-products
function pictureProducts(){
  new Swiper('.article-section .picture-products-swiper', {
     slidesPerView: 3,
     spaceBetween: 15,
     breakpoints: {
      0:{
          slidesPerView: 2
      },
      768:{
          slidesPerView: 2
      },
      1024: {
          slidesPerView: 3
      },
     }
  })

}
pictureProducts();


      //初始化 image-switch-box-swiper swiper
   function imageSwitchSwiper(){
       const imageSwitchSwiper = new Swiper('.image-switch-box-swiper', {
        slidesPerView: 1,
        on: {
          slideChange: function () {
            // 当前 activeindex
            const activeIndex = this.activeIndex;
            //根据当前 activeindex 给 image-switch-thumb-item 添加 active 类
            const thumbItems = document.querySelectorAll('.image-switch-thumb-item');
            thumbItems.forEach((item, index) => {
              item.classList.toggle('active', index === activeIndex);
            });
          },
          init: function(){
            //.image-switch-thumb-item 点击
            const switch_thumbItems = document.querySelectorAll('.image-switch-box .image-switch-thumb-item');
            switch_thumbItems.forEach((item, index) => {
              item.addEventListener('click', () => {
                imageSwitchSwiper.slideTo(index);
              });
            });
          }
        }
      });

   }

   imageSwitchSwiper();


//初始 推荐产品
function blog_recommended_products(){
     // if(window.innerWidth < 1068){
          new Swiper('.blog_recommended_products', {
          slidesPerView: 3,
          spaceBetween: 14,
          pagination: {
            el: '.blog_recommended_products .swiper-pagination',
            type: "progressbar"
          },
          //响应式
          breakpoints: {
            0: {
              slidesPerView: 2,
              spaceBetween: 14
            },
            768:{
              slidesPerView: 2,
              spaceBetween: 14
            },
            900: {
              slidesPerView: 3,
              spaceBetween: 14
            }
          }
        });
    //}

    //讲当前 blog_recommended_products 插入到 social-media-blog-seciton 后面
  
      const social_media_containerbox = document.querySelector('.social-media-containerbox');
      const blog_recommended_products = document.querySelector('.blog_recommended_products');
      if(blog_recommended_products && social_media_containerbox){
        //上面
        social_media_containerbox.parentNode.insertBefore(blog_recommended_products, social_media_containerbox.previousSibling);
        blog_recommended_products.style.display = 'block';
      }
  
}

blog_recommended_products();




function inserTitle(keyword) {
  var container = document.querySelector('.article-section-mid');
  if (container) {
    // 遍历 container 内的所有子元素
    for (let el of container.querySelectorAll('*')) {
      // 如果该元素的文本内容包含 keyword
      if (el.textContent.trim() === keyword) {
        return el;  // 找到并返回该元素
      }
    }
  }

  return null;  // 如果没有找到，返回 null
}

// console.log('77777777777777777777777777777777777777777')
// console.log(inserTitle('Best Step-Up - Explorer M'))

// 执行 blog best product 插入
function blogBestProductInsert(text){
  if(!text || text == '') return;
  var blogBestProduct = document.querySelector('.blog-best-product');
  if(blogBestProduct == null) return;
  console.log('55555')
  console.log(text)
  console.log(inserTitle(text))
  inserTitle(text)?inserTitle(text).parentNode.insertBefore(blogBestProduct, inserTitle(text).nextSibling):null;
  blogBestProduct.style.display = 'grid';
}
 blogBestProductInsert(best_product_insert);

function blogProductInfoInsert(text){
  if(!text || text == '') return;
  var blogProductInfo = document.querySelector('.blog-product-info');
  if(blogProductInfo == null) return;
  console.log('66666')
  console.log(inserTitle(text))
  inserTitle(text)?inserTitle(text).parentNode.insertBefore(blogProductInfo, inserTitle(text).nextSibling):null;
  blogProductInfo.style.display = 'grid';
}
blogProductInfoInsert(product_parameters_insert);

//执行 who plans bdsm scenes 插入
function whoPlansBDSMScenesInsert(text){
  if(!text || text == '') return;
  var whoPlansBDSMScenes = document.querySelector('.blog-product-box');
  if(whoPlansBDSMScenes == null) return;
  console.log('77777')
  console.log(who_plans_bdsm_scenes)
  console.log(inserTitle(text))
  inserTitle(text)?inserTitle(text).parentNode.insertBefore(whoPlansBDSMScenes, inserTitle(text).nextSibling):null;
  whoPlansBDSMScenes.style.display = 'grid';
}
whoPlansBDSMScenesInsert(who_plans_bdsm_scenes);

//执行 blog single product 插入
function blogSingleProductInsert(text){
  if(!text || text == '') return;
  var blogSingleProduct = document.querySelector('.single-product-content-wrapper');
  if(blogSingleProduct == null) return;
  console.log('88888')
  console.log(blog_single_product)
  console.log(inserTitle(text))
  inserTitle(text)?inserTitle(text).parentNode.insertBefore(blogSingleProduct, inserTitle(text).nextSibling):null;
  blogSingleProduct.style.display = 'block';
}
blogSingleProductInsert(blog_single_product);


//执行 image switch 插入
function imageSwitchInsert(text){
  if(!text || text == '') return;
  var imageSwitch = document.querySelector('.image-switch-box');
  if(imageSwitch == null) return;
  console.log('99999')
  console.log(image_switch_insert_text)
  console.log(inserTitle(text))
  inserTitle(text)?inserTitle(text).parentNode.insertBefore(imageSwitch, inserTitle(text).nextSibling):null;
  imageSwitch.style.display = 'block';
}
imageSwitchInsert(image_switch_insert_text);

//执行 jb-tst-wrapper 插入
function jbTstWrapperInsert(text){
  if(!text || text == '') return;
  var jbTstWrapper = document.querySelector('.jb-tst-wrapper');
  if(jbTstWrapper == null) return;
  console.log('10101010')
  console.log(jb_tst_wrapper_insert_text)
  console.log(inserTitle(text))
  inserTitle(text)?inserTitle(text).parentNode.insertBefore(jbTstWrapper, inserTitle(text).nextSibling):null;
  jbTstWrapper.style.display = 'block';
}
jbTstWrapperInsert(jb_tst_wrapper_insert_text);
