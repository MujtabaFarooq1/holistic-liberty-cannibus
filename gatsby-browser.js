import "bootstrap/dist/css/bootstrap.min.css";

export const onClientEntry = () => {
  window.onload = () => {
    var script = document.createElement("script");
    script.innerHTML = "(function(){ var s = document.createElement('script'), e = ! document.body ? document.querySelector('head') : document.body; s.src = 'https://acsbapp.com/apps/app/dist/js/app.js'; s.async = true; s.onload = function(){ acsbJS.init({ statementLink : '', footerHtml : '', hideMobile : false, hideTrigger : false, language : 'en', position : 'right', leadColor : '#146FF8', triggerColor : '#146FF8', triggerRadius : '50%', triggerPositionX : 'right', triggerPositionY : 'bottom', triggerIcon : 'people', triggerSize : 'medium', triggerOffsetX : 20, triggerOffsetY : 20, mobile : { triggerSize : 'small', triggerPositionX : 'right', triggerPositionY : 'center', triggerOffsetX : 0, triggerOffsetY : 0, triggerRadius : '50%' } }); }; e.appendChild(s);}());";

    document.body.appendChild(script)
  }
}