// Recursively parse json to find required field [lvl1,lvl2,...]
function jsonParser(jsonObject, fields, index) {
    index = index != null ? index : 0;
    if (jsonObject == null) {
        return "";
    }
    console.log(index + " from " + fields)
    var fieldValue = jsonObject[fields[index]];
    if (index == fields.length - 1) {
        return typeof fieldValue !== 'undefined' ? fieldValue : "";
    } else {
        return jsonParser(fieldValue, fields, ++index)
    }
};

export default function (jsonObject, fields) {
    return jsonParser(jsonObject, fields, 0);
};

