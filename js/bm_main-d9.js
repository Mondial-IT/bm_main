/*
 * Copyright (c) Mondial-IT BV - Blue Marloc 2024
 *   Created on 2024-11-21 at 11:32:11
 */

// this window.BM is the first element in the Blue Marloc stack
// every other js will come after it.
window.BM = {
  info: 'bm_main provides central settings',
  log: {
    color1: 'background-color:#ad1ab9;color:white;',
    color2: 'background-color:#1e8fff;color:white;',
    textColor: 'color:#1e8fff;',
  }
}
//throbber(true,"Installing bm_main")

info = (s)=>{  console.log("%c bm_main: %c "+s,BM.log.color1, BM.log.color2); }
info("window.BM installed");


/**
 * note bm_main is a dependency in most blue marloc
 * javascript. It provides the general available settings
 *
 * #### offers
 * * BM.log.color1, BM.log.color2, BM.log.textColor as indicator
 * * ajaxAutoDownload(selector) download div content as download.csv
 * * throbber(Onoff, message, force)
 * * throbberSuccess(successFail)
 * * triggerPulseAnimation(element)
 *
 * #### and offers the click next to a modal window to close it
 *
 * @type {{attach: Drupal.behaviors.bm_main.attach}}
 */
Drupal.behaviors.bm_main = {
  attach: function (context, settings) {
    info('[40] bm_main.js v250323 is running Ok  ');

    /* todo fix so it resizes better.
    // settings is set in the ajax call from an ajax form
    // BMNodeTableSelectTemplateForm.php for example
    if(settings.sizeAdjustModal !== undefined){
        $modal =document.querySelector(settings.sizeAdjustModal)
        console.log($modal, 'size adjust modal')
        window.setTimeout(optimiseSizeOfDialog, 2000)
    }
    function optimiseSizeOfDialog(){
      console.log(settings.sizeAdjustModal,'dialog open calculate')
      const container = document.querySelector(settings.sizeAdjustModal);
      const $modal = container.closest('[role="dialog"]')

      const fontSize = parseFloat(window.getComputedStyle(container).fontSize);
      const lineHeight = parseFloat(window.getComputedStyle(container).lineHeight);
      const textContent = container.textContent.trim();
      const averageCharacterWidth = container.clientWidth / textContent.length;

      const optimalLineLength = 220; // Adjust based on preference
      const optimalWidth = optimalLineLength * averageCharacterWidth;
      const optimalHeight = Math.ceil(textContent.length / optimalLineLength) * lineHeight;

      $modal.style.width = optimalWidth + 'px';
      $modal.style.height = optimalHeight + 'px';
      // Center the container
      $modal.style.top = '50%';
      $modal.style.left = '50%';
      $modal.style.transform = 'translate(-50%, -50%)';
    }
    */
    if (window.BM.bm_main === undefined) {
      // closing a modal by clicking next to the modal
      document.addEventListener('click', function (event) {

        info("[76]Installs modal.remove()");
        var modal = document.querySelector('.ui-widget-overlay.ui-front');
        if (event.target === modal) {
          modal.remove();
          document.querySelector('[aria-describedby="drupal-modal"]').remove()
        }


      });

      info("[86]listen and act on .summary class open close");

      // listen and act on .summary class open close
      //// markdown_summary_details();

      //document.addEventListener('DOMContentLoaded', aggridHandler)
      info("[92] checkDataTablesLoadedOK()");
      //// checkDataTablesLoadedOK();

      //setTimeout(throbberTestOff,20000)
      //function throbberTestOff() {
      //  throbberSuccess(true)
      //}

      window.BM.bm_main = 'initialised'
    }
    // make text area's use the new field-sizing-content css
    info("[103] enhanceTextAreas")
    //// enhanceTextAreas();

    // enhance tables DataTables.net js.
    info("[107] initializeDataTablesJS");
    //// initializeDataTablesJS();

  }
}
// THROBBER ON/OFF
var ons = 0;

// THROBBER DISPLAYED AS SUCCESS/FAIL
function throbberSuccess(SUCCESSfail) {
  const throbber = document.getElementById('throbber');
  if (throbber) {
    if (SUCCESSfail) {
      throbber.style.backgroundColor = 'lawngreen';
    } else {
      throbber.style.backgroundColor = 'red';
    }
    setTimeout(function () {
      jQuery('#throbber').remove();
    }, 500);
  }
}

function throbber(Onoff, message, force) {
  jQuery(document).one('mousedown', function () {
    throbber(false, '', true)
  });

  if (Onoff) {
    ons++;
    jQuery('#throbber').remove();
    jQuery('body').append(
      '<div id="throbber">' +
      getSVG() +
      '<div class="flymessage zoomOutLeft animated">' +
      getSVGText(message) +
      '</div>' +
      '</div>');

    throbberAnimate();

    // if (message) {
    //   jQuery('.header-main,.content-header')
    //     .append('<div class="flymessage zoomOutLeft animated"
    // style="margin-top:' + (ons * 20) + 'px solid transparent;">' + message +
    // '</div>'); }

  } else {
    if (force) {
      ons = 1;
    }
    ons--;
    if (ons < 1) {
      jQuery('#throbber,.flymessage').hide(2000).remove();
    }
    if (ons < 0) {
      ons = 0;
    }
  }


  function throbberAnimate() {
    // Rotate the SVG
    const svg = document.getElementById('throbberSvg');
    svg.style.animation = 'rotate 6s linear infinite';

    const colors = ["#96ff3a", "#fff53a", "#ffb03a"];

    let i = 1;
    let colorIndex = 0;

    const growShrinkRadius = (circle) => {
      let originalRadius = parseFloat(circle.getAttribute('r'));
      let maxRadius = originalRadius * 1.2; // Grow by 20%
      let step = (maxRadius - originalRadius) / 10; // Determine step size
      let currentRadius = originalRadius;
      let growing = true;

      const animation = setInterval(() => {
        if (growing) {
          currentRadius += step;
          if (currentRadius >= maxRadius) {
            growing = false;
          }
        } else {
          currentRadius -= step;
          if (currentRadius <= originalRadius) {
            currentRadius = originalRadius; // Reset to original radius
            clearInterval(animation);
          }
        }
        circle.setAttribute('r', currentRadius);
      }, 50); // Adjust interval time as needed
    };

    const interval = setInterval(() => {
      const circle = svg.getElementById(`c${i}`);
      if (circle) {
        circle.style.fill = colors[colorIndex];
        growShrinkRadius(circle); // Apply the grow-shrink effect

        i++;
        if (i > 12) {
          i = 1;
          if (colorIndex < 2) {
            colorIndex++;
          }
        }
      } else {
        clearInterval(interval); // Stop the interval when all circles are
                                 // filled
      }
    }, 1000); // Adjust as per your requirement

  }
}

function getSVG() {
  info("[134] getSVG()");
  return '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
    '<!-- Created with Inkscape (http://www.inkscape.org/) -->\n' +
    '\n' +
    '<svg\n' +
    '   width="100%"\n' +
    '   height="100%"\n' +
    '   viewBox="0 0 491.88188 488.50506"\n' +
    '   version="1.1"\n' +
    '   id="throbberSvg"\n' +
    ' \n' +
    '   inkscape:export-xdpi="25.945688"\n' +
    '   inkscape:export-ydpi="25.945688"\n' +
    '  \n' +
    '   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"\n' +
    '   xmlns:xlink="http://www.w3.org/1999/xlink"\n' +
    '   xmlns="http://www.w3.org/2000/svg"\n' +
    '   xmlns:svg="http://www.w3.org/2000/svg">\n' +
    '  <sodipodi:namedview\n' +
    '     id="namedview7"\n' +
    '     pagecolor="#ffffff"\n' +
    '     bordercolor="#000000"\n' +
    '     borderopacity="0.25"\n' +
    '     inkscape:showpageshadow="2"\n' +
    '     inkscape:pageopacity="0.0"\n' +
    '     inkscape:pagecheckerboard="0"\n' +
    '     inkscape:deskcolor="#d1d1d1"\n' +
    '     inkscape:document-units="mm"\n' +
    '     showgrid="false"\n' +
    '     showguides="true"\n' +
    '     inkscape:lockguides="false"\n' +
    '     inkscape:zoom="0.25"\n' +
    '     inkscape:cx="388"\n' +
    '     inkscape:cy="1108"\n' +
    '     inkscape:window-width="1920"\n' +
    '     inkscape:window-height="1009"\n' +
    '     inkscape:window-x="-8"\n' +
    '     inkscape:window-y="-8"\n' +
    '     inkscape:window-maximized="1"\n' +
    '     inkscape:current-layer="layer4" />\n' +
    '  <defs\n' +
    '     id="defs2">\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       id="linearGradient16192">\n' +
    '      <stop\n' +
    '         style="stop-color:#8026b5;stop-opacity:1;"\n' +
    '         offset="0"\n' +
    '         id="stop16188" />\n' +
    '      <stop\n' +
    '         style="stop-color:#0590fb;stop-opacity:1;"\n' +
    '         offset="1"\n' +
    '         id="stop16190" />\n' +
    '    </linearGradient>\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       id="linearGradient15910">\n' +
    '      <stop\n' +
    '         style="stop-color:#8026b5;stop-opacity:1;"\n' +
    '         offset="0"\n' +
    '         id="stop15906" />\n' +
    '      <stop\n' +
    '         style="stop-color:#0590fb;stop-opacity:0.93333334;"\n' +
    '         offset="1"\n' +
    '         id="stop15908" />\n' +
    '    </linearGradient>\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       id="linearGradient15833">\n' +
    '      <stop\n' +
    '         style="stop-color:#000000;stop-opacity:1;"\n' +
    '         offset="0"\n' +
    '         id="stop15829" />\n' +
    '      <stop\n' +
    '         style="stop-color:#000000;stop-opacity:0;"\n' +
    '         offset="1"\n' +
    '         id="stop15831" />\n' +
    '    </linearGradient>\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       id="linearGradient12515">\n' +
    '      <stop\n' +
    '         style="stop-color:#8026b5;stop-opacity:1;"\n' +
    '         offset="0"\n' +
    '         id="stop12511" />\n' +
    '      <stop\n' +
    '         style="stop-color:#7e2ab6;stop-opacity:1;"\n' +
    '         offset="1"\n' +
    '         id="stop12513" />\n' +
    '    </linearGradient>\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       id="linearGradient12026">\n' +
    '      <stop\n' +
    '         style="stop-color:#8026b5;stop-opacity:1;"\n' +
    '         offset="0"\n' +
    '         id="stop12022" />\n' +
    '      <stop\n' +
    '         style="stop-color:#1087f5;stop-opacity:1;"\n' +
    '         offset="1"\n' +
    '         id="stop12024" />\n' +
    '    </linearGradient>\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       id="linearGradient10778">\n' +
    '      <stop\n' +
    '         style="stop-color:#8026b5;stop-opacity:1;"\n' +
    '         offset="0"\n' +
    '         id="stop10774" />\n' +
    '      <stop\n' +
    '         style="stop-color:#7c25b4;stop-opacity:1;"\n' +
    '         offset="1"\n' +
    '         id="stop10776" />\n' +
    '    </linearGradient>\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       id="linearGradient10496">\n' +
    '      <stop\n' +
    '         style="stop-color:#8026b5;stop-opacity:1;"\n' +
    '         offset="0"\n' +
    '         id="stop10492" />\n' +
    '      <stop\n' +
    '         style="stop-color:#4c54d2;stop-opacity:1;"\n' +
    '         offset="1"\n' +
    '         id="stop10494" />\n' +
    '    </linearGradient>\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       id="linearGradient9110">\n' +
    '      <stop\n' +
    '         style="stop-color:#8026b5;stop-opacity:1;"\n' +
    '         offset="0"\n' +
    '         id="stop9106" />\n' +
    '      <stop\n' +
    '         style="stop-color:#4a57d5;stop-opacity:1;"\n' +
    '         offset="1"\n' +
    '         id="stop9108" />\n' +
    '    </linearGradient>\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       id="linearGradient8138">\n' +
    '      <stop\n' +
    '         style="stop-color:#8026b5;stop-opacity:1;"\n' +
    '         offset="0"\n' +
    '         id="stop8134" />\n' +
    '      <stop\n' +
    '         style="stop-color:#2575e9;stop-opacity:1;"\n' +
    '         offset="1"\n' +
    '         id="stop8136" />\n' +
    '    </linearGradient>\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       id="linearGradient7649">\n' +
    '      <stop\n' +
    '         style="stop-color:#8026b5;stop-opacity:1;"\n' +
    '         offset="0"\n' +
    '         id="stop7645" />\n' +
    '      <stop\n' +
    '         style="stop-color:#1a7fef;stop-opacity:1;"\n' +
    '         offset="1"\n' +
    '         id="stop7647" />\n' +
    '    </linearGradient>\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       id="linearGradient7298">\n' +
    '      <stop\n' +
    '         style="stop-color:#8026b5;stop-opacity:1;"\n' +
    '         offset="0"\n' +
    '         id="stop7294" />\n' +
    '      <stop\n' +
    '         style="stop-color:#1681f1;stop-opacity:1;"\n' +
    '         offset="1"\n' +
    '         id="stop7296" />\n' +
    '    </linearGradient>\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       id="linearGradient7154">\n' +
    '      <stop\n' +
    '         style="stop-color:#8026b5;stop-opacity:1;"\n' +
    '         offset="0"\n' +
    '         id="stop7150" />\n' +
    '      <stop\n' +
    '         style="stop-color:#1484f3;stop-opacity:1;"\n' +
    '         offset="1"\n' +
    '         id="stop7152" />\n' +
    '    </linearGradient>\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       id="linearGradient3508">\n' +
    '      <stop\n' +
    '         style="stop-color:#8026b5;stop-opacity:1;"\n' +
    '         offset="0"\n' +
    '         id="stop3504" />\n' +
    '      <stop\n' +
    '         style="stop-color:#57a5e1;stop-opacity:1;"\n' +
    '         offset="1"\n' +
    '         id="stop3506" />\n' +
    '    </linearGradient>\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       id="linearGradient3496">\n' +
    '      <stop\n' +
    '         style="stop-color:#8026b5;stop-opacity:1;"\n' +
    '         offset="0"\n' +
    '         id="stop3492" />\n' +
    '      <stop\n' +
    '         style="stop-color:#0590fb;stop-opacity:0.93333334;"\n' +
    '         offset="1"\n' +
    '         id="stop3494" />\n' +
    '    </linearGradient>\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       id="linearGradient3488">\n' +
    '      <stop\n' +
    '         style="stop-color:#7e2ab6;stop-opacity:1;"\n' +
    '         offset="0"\n' +
    '         id="stop3484" />\n' +
    '      <stop\n' +
    '         style="stop-color:#0590fb;stop-opacity:1;"\n' +
    '         offset="1"\n' +
    '         id="stop3486" />\n' +
    '    </linearGradient>\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient7298"\n' +
    '       id="linearGradient4929"\n' +
    '       x1="82.484344"\n' +
    '       y1="79.943077"\n' +
    '       x2="123.55577"\n' +
    '       y2="36.722317"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(31.550856,-0.03110012,0.03061922,32.046454,-2390.5686,-857.89836)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient7154"\n' +
    '       id="linearGradient4931"\n' +
    '       x1="95.603943"\n' +
    '       y1="65.364807"\n' +
    '       x2="111.77475"\n' +
    '       y2="45.028137"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(32.070117,-0.03108404,0.03112317,32.029892,-2293.5364,-856.94673)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient3496"\n' +
    '       id="linearGradient4935"\n' +
    '       x1="98.491318"\n' +
    '       y1="51.438179"\n' +
    '       x2="104.2886"\n' +
    '       y2="44.781372"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(32.070117,-0.03108404,0.03112317,32.029892,-2169.3498,-630.03205)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient12026"\n' +
    '       id="linearGradient4937"\n' +
    '       x1="99.947098"\n' +
    '       y1="58.866306"\n' +
    '       x2="108.15252"\n' +
    '       y2="53.466743"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(32.070117,-0.03108404,0.03112317,32.029892,-2293.5364,-856.94673)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient3508"\n' +
    '       id="linearGradient4941"\n' +
    '       x1="83.039917"\n' +
    '       y1="88.216385"\n' +
    '       x2="115.14198"\n' +
    '       y2="42.721577"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(32.070117,-0.03108404,0.03112317,32.029892,-2185.1003,-1049.7093)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient3508"\n' +
    '       id="linearGradient4943"\n' +
    '       x1="92.12841"\n' +
    '       y1="74.263145"\n' +
    '       x2="118.52904"\n' +
    '       y2="36.706654"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(32.070117,-0.03108404,0.03112317,32.029892,-2293.5364,-856.94673)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient3488"\n' +
    '       id="linearGradient9411"\n' +
    '       x1="76.245636"\n' +
    '       y1="36.660297"\n' +
    '       x2="82.761841"\n' +
    '       y2="20.177254"\n' +
    '       gradientUnits="userSpaceOnUse" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient12515"\n' +
    '       id="linearGradient1769"\n' +
    '       x1="239.75212"\n' +
    '       y1="1264.3021"\n' +
    '       x2="1644.8536"\n' +
    '       y2="-240.47864"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(0.92129663,0,0,0.92129663,-6.5519764,536.63126)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient10778"\n' +
    '       id="linearGradient1769-8"\n' +
    '       x1="-63.341228"\n' +
    '       y1="1266.0421"\n' +
    '       x2="1341.7604"\n' +
    '       y2="-238.73862"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(0.92129663,0,0,0.92129663,272.6869,535.02819)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient16192"\n' +
    '       id="linearGradient1769-9"\n' +
    '       x1="-679.10046"\n' +
    '       y1="1606.4808"\n' +
    '       x2="726.0011"\n' +
    '       y2="101.7"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(0.92129663,0,0,0.92129663,839.9838,221.38324)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient15910"\n' +
    '       id="linearGradient1769-6"\n' +
    '       x1="-192.70152"\n' +
    '       y1="851.54407"\n' +
    '       x2="591.76721"\n' +
    '       y2="354.181"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(0.92129663,0,0,0.92129663,963.65303,-11.22667)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient7649"\n' +
    '       id="linearGradient1769-1"\n' +
    '       x1="-1199.4241"\n' +
    '       y1="1671.5592"\n' +
    '       x2="205.67749"\n' +
    '       y2="166.77837"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(0.92129663,0,0,0.92129663,1319.3562,161.42675)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient8138"\n' +
    '       id="linearGradient1769-10"\n' +
    '       x1="-422.06073"\n' +
    '       y1="643.48395"\n' +
    '       x2="47.89817"\n' +
    '       y2="229.41138"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(0.92129663,0,0,0.92129663,1147.9169,388.73965)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient10496"\n' +
    '       id="linearGradient1769-80"\n' +
    '       x1="-1007.2632"\n' +
    '       y1="711.2561"\n' +
    '       x2="397.83829"\n' +
    '       y2="-793.52466"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(0.92129663,0,0,0.92129663,1142.3191,1046.1507)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient9110"\n' +
    '       id="linearGradient1769-88"\n' +
    '       x1="-1213.0739"\n' +
    '       y1="470.09927"\n' +
    '       x2="192.02771"\n' +
    '       y2="-1034.6815"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(0.92129663,0,0,0.92129663,1331.9317,1268.3277)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient3508"\n' +
    '       id="linearGradient1769-0"\n' +
    '       x1="-675.52478"\n' +
    '       y1="548.79932"\n' +
    '       x2="729.57678"\n' +
    '       y2="-955.98145"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(0.92129663,0,0,0.92129663,836.68953,1195.8216)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient3508"\n' +
    '       id="linearGradient1769-96"\n' +
    '       x1="-796.69446"\n' +
    '       y1="256.44464"\n' +
    '       x2="608.4071"\n' +
    '       y2="-1248.3362"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(0.92129663,0,0,0.92129663,948.32278,1465.167)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient3508"\n' +
    '       id="linearGradient1769-93"\n' +
    '       x1="-78.826553"\n' +
    '       y1="896.79517"\n' +
    '       x2="1326.275"\n' +
    '       y2="-607.98566"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(0.92129663,0,0,0.92129663,286.95348,875.21424)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient3508"\n' +
    '       id="linearGradient1769-100"\n' +
    '       x1="240.36562"\n' +
    '       y1="856.06549"\n' +
    '       x2="1645.4672"\n' +
    '       y2="-648.71533"\n' +
    '       gradientUnits="userSpaceOnUse"\n' +
    '       gradientTransform="matrix(0.92129663,0,0,0.92129663,-7.1171837,912.73834)" />\n' +
    '    <linearGradient\n' +
    '       inkscape:collect="always"\n' +
    '       xlink:href="#linearGradient15833"\n' +
    '       id="linearGradient15835"\n' +
    '       x1="1522.7345"\n' +
    '       y1="293.37329"\n' +
    '       x2="1508.8462"\n' +
    '       y2="315.0791"\n' +
    '       gradientUnits="userSpaceOnUse" />\n' +
    '  </defs>\n' +
    '  <g\n' +
    '     inkscape:groupmode="layer"\n' +
    '     id="layer4"\n' +
    '     inkscape:label="Bends"\n' +
    '     style="display:inline"\n' +
    '     transform="matrix(0.27393654,0,0,0.28963238,-21.315947,-48.987069)">\n' +
    '    <circle\n' +
    '       style="display:inline;fill:none;stroke:url(#linearGradient1769-80);stroke-width:44.775;stroke-dasharray:none"\n' +
    '       id="c3"\n' +
    '       cx="1332.3721"\n' +
    '       cy="1331.635"\n' +
    '       r="82.734795" />\n' +
    '    <circle\n' +
    '       style="display:inline;fill:none;stroke:url(#linearGradient1769-88);stroke-width:44.775;stroke-dasharray:none"\n' +
    '       id="c9"\n' +
    '       cx="1521.9846"\n' +
    '       cy="1553.812"\n' +
    '       r="82.734795" />\n' +
    '    <circle\n' +
    '       style="display:inline;fill:none;stroke:url(#linearGradient1769-10);stroke-width:44.775;stroke-dasharray:none"\n' +
    '       id="c2"\n' +
    '       cx="1337.9698"\n' +
    '       cy="674.22394"\n' +
    '       r="82.734795" />\n' +
    '    <path\n' +
    '       sodipodi:type="star"\n' +
    '       style="display:inline;fill:url(#linearGradient9411);fill-opacity:1;stroke:none;stroke-width:2;stroke-linecap:butt;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"\n' +
    '       id="path9403"\n' +
    '       inkscape:flatsided="true"\n' +
    '       sodipodi:sides="6"\n' +
    '       sodipodi:cx="75.542572"\n' +
    '       sodipodi:cy="34.766083"\n' +
    '       sodipodi:r1="19.146004"\n' +
    '       sodipodi:r2="16.580925"\n' +
    '       sodipodi:arg1="0.52359878"\n' +
    '       sodipodi:arg2="1.0471976"\n' +
    '       inkscape:rounded="0"\n' +
    '       inkscape:randomized="0"\n' +
    '       d="m 92.123498,44.339085 -16.580926,9.573001 -16.580926,-9.573001 0,-19.146004 16.580926,-9.573002 16.580926,9.573002 z"\n' +
    '       transform="matrix(14.422644,8.353906,-8.3643986,14.404554,139.72903,-131.12797)"\n' +
    '       inkscape:transform-center-x="-0.034508023"\n' +
    '       inkscape:transform-center-y="0.073093518" />\n' +
    '    <circle\n' +
    '       style="display:inline;fill:none;stroke:url(#linearGradient1769-100);stroke-width:44.775;stroke-dasharray:none"\n' +
    '       id="c11"\n' +
    '       cx="182.93575"\n' +
    '       cy="1198.2225"\n' +
    '       r="82.734795" />\n' +
    '    <circle\n' +
    '       style="display:inline;fill:none;stroke:url(#linearGradient1769-93);stroke-width:44.775;stroke-dasharray:none"\n' +
    '       id="c5"\n' +
    '       cx="477.00641"\n' +
    '       cy="1160.6986"\n' +
    '       r="82.734795" />\n' +
    '    <path\n' +
    '       style="display:inline;fill:none;fill-opacity:1;stroke:url(#linearGradient4935);stroke-width:86.536;stroke-linecap:butt;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"\n' +
    '       d="M 1064.1482,270.49425 510.6637,268.84167 231.51193,746.24382"\n' +
    '       id="path4359"\n' +
    '       sodipodi:nodetypes="ccc"\n' +
    '       inkscape:transform-center-x="415.52787"\n' +
    '       inkscape:transform-center-y="-743.92148" />\n' +
    '    <path\n' +
    '       style="display:inline;fill:none;fill-opacity:1;stroke:url(#linearGradient4941);stroke-width:86.5356;stroke-linecap:butt;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"\n' +
    '       d="m 229.69761,1277.1378 271.55591,470.4023 544.00008,0.4449"\n' +
    '       id="path4361"\n' +
    '       sodipodi:nodetypes="ccc"\n' +
    '       inkscape:transform-center-x="437.23681"\n' +
    '       inkscape:transform-center-y="708.07308" />\n' +
    '    <path\n' +
    '       style="display:inline;fill:none;fill-opacity:1;stroke:url(#linearGradient4929);stroke-width:85.8544;stroke-linecap:butt;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"\n' +
    '       d="m 1559.4346,524.72169 271.0576,478.07451 -271.7898,477.6145"\n' +
    '       id="path4363"\n' +
    '       sodipodi:nodetypes="ccc"\n' +
    '       inkscape:transform-center-x="-937.09825"\n' +
    '       inkscape:transform-center-y="16.795951" />\n' +
    '    <path\n' +
    '       style="display:inline;fill:none;fill-opacity:1;stroke:url(#linearGradient4937);stroke-width:86.5356;stroke-linecap:butt;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"\n' +
    '       d="m 939.19705,504.40639 -286.6307,-0.23007 -144.5161,247.26284"\n' +
    '       id="path4425"\n' +
    '       sodipodi:nodetypes="ccc"\n' +
    '       inkscape:transform-center-x="222.65231"\n' +
    '       inkscape:transform-center-y="-386.54404" />\n' +
    '    <path\n' +
    '       style="display:inline;fill:none;fill-opacity:1;stroke:url(#linearGradient4943);stroke-width:86.5356;stroke-linecap:butt;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"\n' +
    '       d="m 518.50292,1241.8037 139.1967,242.3373 279.8745,-0.4317"\n' +
    '       id="path4427"\n' +
    '       sodipodi:nodetypes="ccc"\n' +
    '       inkscape:transform-center-x="233.04834"\n' +
    '       inkscape:transform-center-y="367.07081" />\n' +
    '    <path\n' +
    '       style="display:inline;fill:none;fill-opacity:1;stroke:url(#linearGradient4931);stroke-width:86.5356;stroke-linecap:butt;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"\n' +
    '       d="m 1379.1455,1255.9948 149.1106,-254.17 -146.396,-255.76142"\n' +
    '       id="path4429"\n' +
    '       sodipodi:nodetypes="ccc"\n' +
    '       inkscape:transform-center-x="-508.20222"\n' +
    '       inkscape:transform-center-y="7.3445172" />\n' +
    '    <circle\n' +
    '       style="display:inline;fill:none;stroke:url(#linearGradient1769);stroke-width:44.775;stroke-dasharray:none"\n' +
    '       id="c12"\n' +
    '       cx="183.50095"\n' +
    '       cy="822.11554"\n' +
    '       r="82.734795" />\n' +
    '    <circle\n' +
    '       style="display:inline;fill:none;stroke:url(#linearGradient1769-0);stroke-width:44.775;stroke-dasharray:none"\n' +
    '       id="c4"\n' +
    '       cx="1026.7424"\n' +
    '       cy="1481.3059"\n' +
    '       r="82.734795" />\n' +
    '    <circle\n' +
    '       style="display:inline;fill:none;stroke:url(#linearGradient1769-8);stroke-width:44.775;stroke-dasharray:none"\n' +
    '       id="c6"\n' +
    '       cx="462.73984"\n' +
    '       cy="820.51251"\n' +
    '       r="82.734795" />\n' +
    '    <circle\n' +
    '       style="display:inline;fill:none;stroke:url(#linearGradient1769-9);stroke-width:44.775;stroke-dasharray:none"\n' +
    '       id="c1"\n' +
    '       cx="1030.0367"\n' +
    '       cy="506.86752"\n' +
    '       r="82.734795" />\n' +
    '    <circle\n' +
    '       style="display:inline;fill:url(#linearGradient15835);stroke:url(#linearGradient1769-6);stroke-width:44.775;stroke-dasharray:none;fill-opacity:1"\n' +
    '       id="c7"\n' +
    '       cx="1153.7059"\n' +
    '       cy="274.25763"\n' +
    '       r="82.734795" />\n' +
    '    <circle\n' +
    '       style="display:inline;fill:none;stroke:url(#linearGradient1769-1);stroke-width:44.775;stroke-dasharray:none"\n' +
    '       id="c8"\n' +
    '       cx="1509.4092"\n' +
    '       cy="446.91107"\n' +
    '       r="82.734795" />\n' +
    '    <circle\n' +
    '       style="display:inline;fill:none;stroke:url(#linearGradient1769-96);stroke-width:44.775;stroke-dasharray:none"\n' +
    '       id="c10"\n' +
    '       cx="1138.3757"\n' +
    '       cy="1750.6514"\n' +
    '       r="82.734795" />\n' +
    '  </g>\n' +
    '</svg>\n';
}

function getSVGText(text) {
  info("[698] getSVGText");

  return '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
    '<!-- Created with Inkscape (http://www.inkscape.org/) -->\n' +
    '\n' +
    '<svg\n' +
    '   width="500px"\n' +
    '   height="28px"\n' +
    '   viewBox="0 0 661.00968 30.683197"\n' +
    '   version="1.1"\n' +
    '   id="svg5"\n' +
    '   xmlns:xlink="http://www.w3.org/1999/xlink"\n' +
    '   xmlns="http://www.w3.org/2000/svg"\n' +
    '   xmlns:svg="http://www.w3.org/2000/svg">\n' +
    '  <defs\n' +
    '     id="defs2">\n' +
    '    <rect\n' +
    '       x="-1932"\n' +
    '       y="1328"\n' +
    '       width="3148"\n' +
    '       height="272"\n' +
    '       id="rect317" />\n' +
    '    <linearGradient\n' +
    '       id="linearGradient3488">\n' +
    '      <stop\n' +
    '         style="stop-color:#7e2ab6;stop-opacity:1;"\n' +
    '         offset="0"\n' +
    '         id="stop3484" />\n' +
    '      <stop\n' +
    '         style="stop-color:#0590fb;stop-opacity:1;"\n' +
    '         offset="1"\n' +
    '         id="stop3486" />\n' +
    '    </linearGradient>\n' +
    '    <linearGradient\n' +
    '       xlink:href="#linearGradient3488"\n' +
    '       id="linearGradient905"\n' +
    '       x1="-1609.12"\n' +
    '       y1="1441.5837"\n' +
    '       x2="877.6322"\n' +
    '       y2="1446.4115"\n' +
    '       gradientUnits="userSpaceOnUse" />\n' +
    '  </defs>\n' +
    '  <g\n' +
    '     id="layer4"\n' +
    '     style="display:inline"\n' +
    '     transform="matrix(0.27393654,0,0,0.28963238,56.801838,-547.35612)">\n' +
    '    <text\n' +
    '       xml:space="preserve"\n' +
    '       transform="matrix(0.9658563,0,0,0.75687608,1345.0169,851.69962)"\n' +
    '       id="throbber-text-wrapper"\n' +
    '       style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:140px;font-family:roboto;text-align:center;white-space:pre;shape-inside:url(#rect317);display:inline;fill:url(#linearGradient905);fill-opacity:1;stroke-width:0;stop-color:#000000"\n' +
    '       x="1250.6884"\n' +
    '       y="0"><tspan\n' +
    '         x="-1610.1283"\n' +
    '         y="1511.1837"\n' +
    '         id="throbber-text">' + text + '</tspan></text>\n' +
    '  </g>\n' +
    '</svg>\n';
}

/**
 * Call this to animate an element, with grow and shrink
 * @param element
 */
window.BM.triggerPulseAnimation = function (element) {
  info('[857] triggerPulseAnimation')
  // Add the animation class
  element.classList.add('pulse-animation');

  // Listen for the end of the animation
  element.addEventListener('animationend', function () {
    // Remove the animation class
    element.classList.remove('pulse-animation');
  }, {once: true}); // The listener is removed after it executes once
}

/**
 * #### ajaxAutoDownload(selector_of_div_with_data_or_url)
 * * load the download data into a (hidden) div or from a file
 *
 * **loading from a div**
 * ```
 * $ajax_response->addCommand(
 *  new ReplaceCommand('#download-export-area', '<div id="download-export-area"
 * class="displaynone">' . $data . '</div>') *         );
 *  ```
 *  * call the jquery function to make it a downloadable file and download it
 * ```
 * $ajax_response->addCommand(new InvokeCommand(NULL, 'ajaxAutoDownload',
 * ['#download-export-area']));
 *
 * ```
 *
 * **loading from a file**
 *
 * ```
 *     $uri='public://BlueMarloc example_import.xlsx';
 *     $url = $BMImport->BMImportXLSXhandler->save_as_excel($ymlNames, $uri);
 *
 *     // call the jquery function to make it a downloadable file and download it
 *     $isUrl=true;
 *     $ajax_response->addCommand(new InvokeCommand(NULL, 'ajaxAutoDownload', [$url,'import-example.xlsx',$isUrl]));
 *
 *
 * ```
 *
 *
 *
 * @param selector_of_div_with_data_or_url
 * @param fileName
 * @param isUrl bool when true it is url
 */
jQuery.fn.ajaxAutoDownload = function (selector_of_div_with_data_or_url, fileName, isUrl) {
  console.log('- bm_main ajaxAutoDownload', selector_of_div_with_data_or_url, fileName, isUrl);

  let url = selector_of_div_with_data_or_url;
  if (isUrl) {
    // fetch data from the file
    const url = selector_of_div_with_data_or_url;
  } else {
    // Fetch the data from the specified div
    let blob;
    let downloadData = jQuery(selector_of_div_with_data_or_url).text();
    // Use the raw text for CSV
    blob = new Blob([downloadData], {
      type: 'text/csv'
    });
    // Create an object URL for the blob
    url = window.URL.createObjectURL(blob);
  }


  // Create a temporary anchor element for the download
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName; // Set the file name
  document.body.appendChild(a);
  a.click(); // Trigger the download
  document.body.removeChild(a); // Remove the anchor element

  // Revoke the object URL to free memory
  window.URL.revokeObjectURL(url);
};

function markdown_summary_details() {
  function handleSummaryClick(event) {
    info("[939]handleSummaryClick")
    let summary = event.target.closest('.summary');
    if (summary) {
      summary.classList.toggle('expanded');
    }
  }

// Attach event listener for summary clicks
  document.addEventListener('click', handleSummaryClick);
}

function checkDataTablesLoadedOK() {
  info("[950] checkDataTablesLoadedOK")
  console.log('%c bm_main: %cjQuery version:' + jQuery.fn.jquery, BM.log.color1, 'background-color:green;color:white;');

  // Check if DataTables core is loaded
  if (jQuery.fn.DataTable) {
    console.log('%c bm_main: %cDataTables core is loaded.', BM.log.color1, 'background-color:green;color:white;');

    // Check if ColReorder extension is loaded
    if (jQuery.fn.dataTable.ColReorder) {
      console.log('%c bm_main: %cDataTables ColReorder extension is loaded.', BM.log.color1, 'background-color:green;color:white;');
    } else {
      console.error('%c bm_main: %cDataTables ColReorder extension is not loaded.', BM.log.color1, 'background-color:red;color:white;');
    }

    // Check if Responsive extension is loaded
    if (jQuery.fn.dataTable.Responsive) {
      console.log('%c bm_main: %cDataTables Responsive extension is loaded.', BM.log.color1, 'background-color:green;color:white;');
    } else {
      console.error('%c bm_main: %cDataTables Responsive extension is not loaded.', BM.log.color1, 'background-color:red;color:white;');
    }

    // Check if Buttons extension is loaded
    if (jQuery.fn.dataTable.Buttons) {
      console.log('%c bm_main: %cDataTables Buttons extension is loaded.', BM.log.color1, 'background-color:green;color:white;');
    } else {
      console.error('%c bm_main: %cDataTables Buttons extension is not loaded.', BM.log.color1, 'background-color:red;color:white;');
    }
  } else {
    console.error('%c bm_main: %cDataTables core is not loaded.', BM.log.color1, 'background-color:red;color:white;');
  }
}

function initializeDataTablesJS() {

  info("[987] initializeDatatablesJS");
  // when it has been set in the form
  if (drupalSettings.datatables) {
    // define a persistent placeholder
    if (!window.bm_main_datatables) window.bm_main_datatables = {};

    // process selector and configuration
    drupalSettings.datatables.config.forEach((item, n) => {

      // Initialize DataTables on the table and register the instance
      if (!window.bm_main_datatables[item.selector]) {
        // when this ajax trigger has actually inserted the html,
        // as this function is triggered for every ajax
        // and datatable registers it even when it is not present ...
        if (document.querySelector(item.selector)) {
          window.bm_main_datatables[item.selector] = item;
          if (jQuery.fn.DataTable) {
            jQuery(document.querySelector(item.selector)).DataTable(item.configuration);
          }

          //window.bm_main_datatables[item.selector]['instance'] = new DataTable(item.selector, item.configuration);
        }
      }

    });
  }
}

function enhanceTextAreas() {
}

/**
 * bug, map edit in listing edit werkt niet meer
 * jquery dialog wordt niet geladen
 * teveel js? volgorde?
 * dit laad het als laatste waardoor het gefixed wordt als workaround.
 */
class FixGoogleMapEdit {
  constructor() {
    info("[1114] FixGoogleMapEdit");

    // Flag to ensure initialize runs only once
    this.initialized = false;

    // Make sure this runs only once, on node edit
    if (!this.initialized && document.querySelector("body.page-node-type-listing")) {
      jQuery(document).ready(() => {
        this.initialize(); // This will run only once when the document is ready
      });
    }
  }

  initialize() {
    // Check if already initialized
    if (this.initialized) {
      return;
    }

    this.initialized = true; // Mark as initialized
    if (!jQuery("body").hasClass('google-map-field-dialog-processed'))
      //  setTimeout(() => {
    {
      FixGoogleMapEdit.ensureDialogIsLoaded(() => {
        console.log("BMMAIN FIXING GOOGLE MAP EDITOR");

        // Initialize the dialog after jQuery UI is ensured to be loaded
        jQuery("#google_map_field_dialog").dialog({
          autoOpen: false,
          modal: true,
          width: 800
        })
        jQuery('body').addClass('google-map-field-dialog-processed')
        // Example: Open the dialog when a button is clicked
        jQuery("#open_map_dialog_button").click(function () {
          jQuery("#google_map_field_dialog").dialog("open");

        });
      });
    }
    //  }, 1000);
  }

  // Method to load a script dynamically
  loadScript(url, callback) {
    info("[1066] loadScript")
    var script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState) {  // For old versions of IE
      script.onreadystatechange = () => {
        if (script.readyState === "loaded" || script.readyState === "complete") {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {  // For modern browsers
      script.onload = () => {
        callback();
      };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  // Method to load a stylesheet dynamically
  loadStylesheet(url) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
  }

  // Static method to ensure the jQuery UI dialog is loaded
  static ensureDialogIsLoaded(callback) {
    const instance = new FixGoogleMapEdit(); // Create an instance of the class

    if (!jQuery.fn.dialog) {
      // Load jQuery UI CSS
      instance.loadStylesheet("https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css");

      // Load jQuery UI JS
      instance.loadScript("https://code.jquery.com/ui/1.12.1/jquery-ui.min.js", callback);
    } else {
      // jQuery UI is already loaded, proceed with the callback
      callback();
    }
  }
}

// Instantiate the class to trigger the initialization
if (typeof FixGoogleMapEditSingleton === "undefined") {
////  var FixGoogleMapEditSingleton = new FixGoogleMapEdit();
}
