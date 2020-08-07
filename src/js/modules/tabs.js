const tabs = () => {
  function tab(tabNavSelector, tabContentSelector) {
    const tabNav = document.querySelectorAll(tabNavSelector);
    const tabContent = document.querySelectorAll(tabContentSelector);
    let tabName;

    tabNav.forEach((item) => {
      item.addEventListener('click', selectTabNav);
    });

    function selectTabNav() {
      tabNav.forEach((item) => {
        item.classList.remove('active');
      });
      this.classList.add('active');
      tabName = this.getAttribute('data-tab-name');
      selectTabContent(tabName);
    }

    function selectTabContent(tabName) {
      tabContent.forEach((item) => {
        item.classList.contains(tabName) ? item.classList.add('active', 'animated', 'zoomIn')
            : item.classList.remove('active', 'zoomIn');
      });
    }
  }

  tab('.nav-tab', '.tab-content');
};

export default tabs;