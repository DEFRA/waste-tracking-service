function onSwaggerRender() {
  setTimeout(function() {
    var properties = getProperties();

    var propertyTable = document.getElementById('propertyDescriptions');
    for(var property in properties) {
      var newRow = propertyTable.insertRow();
      newRow.insertCell().innerText = property;
      newRow.insertCell().innerText = properties[property].isMandatory ? "Mandatory" : "Optional";
      newRow.insertCell().innerHTML = properties[property].description;
    }
  }, 100)
}


window.addEventListener("DOMContentLoaded", function () {

  const el = document.getElementById("swagger-ui");

  // ✅ Only run on pages that have Swagger container
  if (!el) return;

  const specUrl = el.getAttribute("data-spec");

  SwaggerUIBundle({
    url: specUrl,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout",
    onComplete: onSwaggerRender,
    defaultModelsExpandDepth: 1000,
    defaultModelExpandDepth: 1000,
    defaultModelRendering: "model",
    docExpansion: "full"
  });


  //</editor-fold>
};

function getProperties() {
  var properties = {};
  document.querySelectorAll('.property-row').forEach((element) => {
    var description = element.querySelector('.renderedMarkdown');
    if (description) {
      var propertyName = element.firstChild.innerText;
      var isMandatory = false;
      if (propertyName.slice(-1) == '*') {
        isMandatory = true;
      }
      var propertyName = propertyName.split('*')[0];
      properties[propertyName] = {
        description: description.innerHTML,
        isMandatory: isMandatory
      };
    }
  });
  return properties;
}



