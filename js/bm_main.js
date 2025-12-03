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
info = (s)=>{  console.log("%c bm_main: %c "+s,BM.log.color1, BM.log.color2); }
info("window.BM installed");


/**
 * note bm_main is a dependency in most blue marloc
 * javascript. It provides the general available settings
 *
 * #### provides
 * * BM.log.color1, BM.log.color2, BM.log.textColor as indicator
 * * ajaxAutoDownload(selector) download div content as download.csv
 * * throbber(Onoff, message, force)
 * * throbberSuccess(successFail)
 * * triggerPulseAnimation(element)
 *
 * #### and provides the click next to a modal window to close it
 *
 * @type {{attach: Drupal.behaviors.bm_main.attach}}
 */
Drupal.behaviors.bm_main = {
  attach: function (context, settings) {
    info('[40] bm_main.js v251105 is running Ok  ');

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

      info("[55] listen and act on .summary class open close");
      markdown_summary_details();

      //document.addEventListener('DOMContentLoaded', aggridHandler)

      info("[64] throbberTest");
      setTimeout(throbberTestOff,20000)
      function throbberTestOff() {
        throbberSuccess(true)
      }

      window.BM.bm_main = 'initialised'
    }

    // ON EVERY AJAX LOAD EXECUTED:

    // make text area's use the new field-sizing-content css
    info("[103] enhanceTextAreas")
    enhanceTextAreas();

  }
}
// THROBBER ON/OFF
var ons = 0;

info("[84] defines custom throbber")

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

info("[195] defines grow-shrink animation");
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

info("[212] defines ajaxAutoDownload jquery function");
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

info("[282] defines markdown_summary_details - look alike using class .summary")
function markdown_summary_details() {
  function handleSummaryClick(event) {

    let summary = event.target.closest('.summary');
    if (summary) {
      summary.classList.toggle('expanded');
    }
  }

// Attach event listener for summary clicks
  document.addEventListener('click', handleSummaryClick);
}

function enhanceTextAreas() {
}

info("[363] defines work-around for googleMapEdit dialog niet laden - check nog nodig?")
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
