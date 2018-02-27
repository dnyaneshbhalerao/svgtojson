let fs = require('fs');
let htmlParser = require('himalaya');

let getAttributesJSON = (allAttributes) => {
  return allAttributes.length !== 0 ?
          allAttributes.reduce((attributes, attribute) => {
            let newAttribute = {};
            newAttribute[`${attribute.key}`] = attribute.value
            return {...attributes, ...newAttribute}
          },{})
          : 
          {...allAttributes};
}

let getAllChildren = allChildren => allChildren.reduce((children, child) => {
                                        let content; 
                                        if(child.type === 'element') {
                                          return {...children, ...svgToJSon(child)}
                                        } else if(child.type === 'text') {
                                          content = child['content']
                                          content = content.replace(/[\t\r\n]+/g,'');
                                        }
                                        return !(content === '') ?
                                            {...children, 'content': content} 
                                            : 
                                            {...children};
                                      },{});

function svgToJSon(svgRawJson) {
  let svgJSON = {};
  if(svgRawJson.length === 0) {
    return {};
  }
  Object.keys(svgRawJson).forEach(key => {
    if(svgRawJson[key] === 'element') {
      svgJSON[`${svgRawJson['tagName']}`] = {};
      svgJSON[`${svgRawJson['tagName']}`]['attributes'] = getAttributesJSON(svgRawJson['attributes']);
      svgJSON[`${svgRawJson['tagName']}`]['children'] = getAllChildren(svgRawJson['children']);
    }
  })
  return svgJSON;
}

fs.readFile('./resources/star.svg', {encoding: 'utf8'}, (err, htmlTagsString)=> {
  if(err) {
    console.log('Error occured', err);
  } else {
    let svgArray = htmlParser.parse(htmlTagsString);
    svgArray.forEach(node =>{
      console.log(JSON.stringify(svgToJSon(node)));
    })
  }
})
