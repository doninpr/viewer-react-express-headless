

export function getPropsTreeData(properties) {
  return properties.map(group => {
    let propNames = {};

    const insertToArray = (array, key) => {
      array.forEach(el => {
        if(propNames[key]){
          if(propNames[key].indexOf(el) === -1){
            propNames[key].push(el);
          }
        } else {
          propNames[key] = [el];
        }
      });
    };

    group.objects.forEach(obj => {
      Object.keys(obj.properties).forEach(key => {
        insertToArray(Object.keys(obj.properties[key] || {}), key);
      });
    });

    return {
      ...group,
      propNames,
    };
  });
}
