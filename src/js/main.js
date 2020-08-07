import fixedHeader from "./modules/fixedHeader";
import scrolling from "./modules/scrolling";
import tabs from "./modules/tabs";
import modals from "./modules/modals";
import carousel from "./modules/carousel";
import forms from "./modules/forms";


document.addEventListener('DOMContentLoaded', () => {
  fixedHeader();
  scrolling();
  tabs();
  modals();
  forms();
  carousel();
});
